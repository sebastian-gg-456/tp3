const WIDTH = 800;
const HEIGHT = 600;
const PLAYER_SPEED = 320;
const BASE_SPEED = 180;
const MAX_SPEED = 420;
const SPAWN_MIN = 620;
const SPAWN_MAX = 290;
const MAX_LIVES = 3;
const INVULN_MS = 1500;
const MAX_WEBS = 3;
const WEB_REGEN_MS = 4000;
const WEB_BONUS = 2;
const WEB_SPEED = 430;

// ---- utilidades deterministas (pixel art) ----

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = (h ^ (h >> 13)) | 0;
  h = (h * 1274126177) | 0;
  return Math.abs((h ^ (h >> 16)) % 1000);
}

function dist(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function lerpColor(a, b, t) {
  const ar = (a >> 16) & 255,
    ag = (a >> 8) & 255,
    ab = a & 255;
  const br = (b >> 16) & 255,
    bg = (b >> 8) & 255,
    bb = b & 255;
  return (
    ((ar + ((br - ar) * t) | 0) << 16) |
    ((ag + ((bg - ag) * t) | 0) << 8) |
    (ab + ((bb - ab) * t) | 0)
  );
}

function darken(c, f) {
  const r = ((c >> 16) & 255) * f,
    g = ((c >> 8) & 255) * f,
    b = (c & 255) * f;
  return (r << 16) | (g << 8) | b;
}

function segDist(px, py, ax, ay, bx, by) {
  const vx = bx - ax,
    vy = by - ay;
  const wx = px - ax,
    wy = py - ay;
  const t = Math.max(0, Math.min(1, (wx * vx + wy * vy) / (vx * vx + vy * vy)));
  return Math.hypot(wx - vx * t, wy - vy * t);
}

function polyDist(px, py, pts) {
  let m = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    m = Math.min(m, segDist(px, py, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]));
  }
  return m;
}

function inTriangle(px, py, a, b, c) {
  const d1 = (px - c[0]) * (a[1] - c[1]) - (a[0] - c[0]) * (py - c[1]);
  const d2 = (px - a[0]) * (b[1] - a[1]) - (b[0] - a[0]) * (py - a[1]);
  const d3 = (px - b[0]) * (c[1] - b[1]) - (c[0] - b[0]) * (py - b[1]);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
}

const COLORS = {
  white: 0xffffff,
  pink: 0xff8fc0,
  pinkBright: 0xff9bc0,
  pinkDark: 0xd95c9e,
  pinkEye: 0xff5fa2,
  black: 0x1a1a1a,
};

// patas de la arana (lado izquierdo; el derecho se refleja en x = 24)
const SPIDER_LEGS = [
  [
    [9, 8],
    [6.5, 6.5],
    [3.5, 6],
    [2, 8.5],
  ],
  [
    [8, 10],
    [4.5, 9],
    [2, 10.5],
    [1.5, 13.5],
  ],
  [
    [7.5, 13],
    [3.5, 13],
    [1.5, 15],
    [2.5, 18],
  ],
  [
    [8, 15.5],
    [4.5, 16.5],
    [3.5, 19.5],
    [6, 19.9],
  ],
];

const SPIDER_SPOTS = [
  [9, 11, 2],
  [15, 12, 2.4],
  [12, 16, 2],
  [17, 15, 1.6],
  [7, 15, 1.5],
  [12, 9.5, 1.4],
];

class SpiderBlancScene extends Phaser.Scene {
  constructor() {
    super('SpiderBlancScene');
    this.state = 'playing';
    this.score = 0;
    this.lives = MAX_LIVES;
    this.invulnUntil = 0;
    this.webs = MAX_WEBS;
    this.bonus = 0;
  }

  create() {
    this.state = 'playing';
    this.score = 0;
    this.lives = MAX_LIVES;
    this.invulnUntil = 0;
    this.webs = MAX_WEBS;
    this.bonus = 0;

    this.buildCaveData();
    this.makePixelTextures();

    this.add.image(WIDTH / 2, HEIGHT / 2, 'cave').setScale(4);

    this.player = this.physics.add.sprite(WIDTH / 2, HEIGHT - 45, 'spider');
    this.player.setScale(4);
    this.player.setCollideWorldBounds(true);
    this.player.setCircle(6);

    this.obstacles = this.physics.add.group();

    this.time.addEvent({
      delay: 700,
      loop: true,
      callback: () => {
        if (this.state === 'playing') this.spawnObstacle();
      },
    });

    this.physics.add.overlap(this.player, this.obstacles, this.onHit, null, this);

    this.websGroup = this.physics.add.group();
    this.physics.add.overlap(this.websGroup, this.obstacles, this.onWebCatch, null, this);

    this.time.addEvent({
      delay: WEB_REGEN_MS,
      loop: true,
      callback: () => {
        if (this.state === 'playing' && this.webs < MAX_WEBS) {
          this.webs++;
          this.updateWebIcons();
        }
      },
    });

    this.drawHearts();
    this.drawWebIcons();
    this.scoreText = this.add
      .text(WIDTH - 16, 14, 'Puntos: 0', {
        fontFamily: '"Courier New", monospace',
        fontSize: '20px',
        color: '#ffffff',
      })
      .setOrigin(1, 0)
      .setDepth(20);

    this.instructions = this.add
      .text(WIDTH / 2, 34, 'Flechas / A D moverte   |   ESPACIO: tela', {
        fontFamily: '"Courier New", monospace',
        fontSize: '16px',
        color: '#ffd9ec',
      })
      .setOrigin(0.5)
      .setDepth(20);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  // ---- texturas pixel a pixel ----

  makePixelTextures() {
    this.makeCave();
    this.makeSpider();
    this.makeRock();
    this.makeBug();
    this.makeWeb();
  }

  makePixels(key, w, h, colorFn) {
    if (this.textures.exists(key)) this.textures.remove(key);
    const t = this.textures.createCanvas(key, w, h);
    const img = t.context.createImageData(w, h);
    const d = img.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const c = colorFn(x, y);
        const i = (y * w + x) * 4;
        if (c === null) {
          d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
        } else {
          d[i] = (c >> 16) & 255;
          d[i + 1] = (c >> 8) & 255;
          d[i + 2] = c & 255;
          d[i + 3] = 255;
        }
      }
    }
    t.context.putImageData(img, 0, 0);
    t.refresh();
  }

  buildCaveData() {
    const rng = mulberry32(2026);
    this.floorY = [];
    for (let x = 0; x < 200; x++) {
      this.floorY[x] =
        122 +
        Math.round(
          8 * Math.sin(x * 0.05 + 1) + 5 * Math.sin(x * 0.13 + 2) + 3 * Math.sin(x * 0.21 + 4)
        );
    }
    this.stalactites = [];
    for (let i = 0; i < 18; i++) {
      const xi = 8 + Math.floor(rng() * 184);
      const w = 4 + Math.floor(rng() * 5);
      const len = 12 + Math.floor(rng() * 19);
      this.stalactites.push([[xi - w, 0], [xi + w, 0], [xi, len]]);
    }
    this.stalagmites = [];
    for (let i = 0; i < 13; i++) {
      const xi = 12 + Math.floor(rng() * 176);
      const w = 4 + Math.floor(rng() * 5);
      const h = 10 + Math.floor(rng() * 13);
      const fy = this.floorY[xi] + 2;
      this.stalagmites.push([[xi - w, fy], [xi + w, fy], [xi, fy - h]]);
    }
    this.boulders = [];
    for (let i = 0; i < 8; i++) {
      const xi = 20 + Math.floor(rng() * 160);
      const rr = 2 + Math.floor(rng() * 3);
      this.boulders.push([xi, this.floorY[xi] + Math.round(rr * 0.8), rr]);
    }
    this.crystals = [];
    for (let i = 0; i < 8; i++) {
      const onFloor = rng() < 0.5;
      let cx, cy;
      if (onFloor) {
        cx = 20 + Math.floor(rng() * 160);
        cy = this.floorY[cx] - 4;
      } else {
        cx = Math.random() < 0.5 ? 6 : 194;
        cy = 20 + Math.floor(rng() * 110);
      }
      const r = 2 + Math.floor(rng() * 2);
      this.crystals.push([cx, cy, r]);
    }
  }

  makeCave() {
    this.makePixels('cave', 200, 150, (x, y) => this.caveColor(x, y));
  }

  caveColor(x, y) {
    // estalactitas (cuelgan sobre cualquier cosa)
    for (const tri of this.stalactites) {
      if (inTriangle(x, y, tri[0], tri[1], tri[2])) {
        let c = 0x241137;
        if (hash2(x + 3, y) % 5 === 0) c = 0x2d1a44;
        return c;
      }
    }

    // paredes laterales en perspectiva (convergen hacia el fondo)
    const edgeL = Math.floor(8 + 52 * (1 - y / 150) + 3 * Math.sin(y * 0.3));
    const edgeR = Math.floor(192 - 52 * (1 - y / 150) + 3 * Math.cos(y * 0.25));
    if (x < edgeL || x >= edgeR) {
      let w = 0x140a21;
      if (hash2(x, y) % 6 === 0) w = 0x1e102e;
      if (hash2(x, y + 11) % 9 === 0) w = 0x2a1840;
      return w;
    }

    // techo rocoso con borde irregular
    const ceilY = 14 + Math.round(5 * Math.sin(x * 0.09 + 3));
    if (y < ceilY) {
      let w = 0x1a0f2c;
      if (hash2(x, y) % 5 === 0) w = 0x241636;
      return w;
    }

    // piso con borde superior destacado
    let c;
    if (y > this.floorY[x]) {
      if (y === this.floorY[x] + 1) c = 0x4a2f60;
      else c = 0x38204a;
      if (hash2(x, y) % 6 === 0) c = 0x2a1838;
      if (hash2(x + 5, y) % 9 === 0) c = 0x45305c;
      if (hash2(x, y + 7) % 13 === 0) c = 0x1c1128;
    } else {
      // aire: gradiente de profundidad + luz central de la entrada
      c = lerpColor(0x0d0718, 0x4a2764, y / 150);
      const glow = Math.max(0, 1 - Math.hypot((x - 95) / 62, (y - 40) / 58));
      c = lerpColor(c, 0x7a4a94, glow * 0.45);
      if (hash2(x, y) % 13 === 0) c = darken(c, 0.7);
    }

    // rocas y estalagmitas sobre el piso
    for (const [rx, ry, rr] of this.boulders) {
      if (dist(x, y, rx, ry) <= rr) {
        if (c === 0x4a2f60) break;
        c = 0x554070;
        if (dist(x, y, rx - rr * 0.4, ry - rr * 0.4) <= rr * 0.4) c = 0x6d5488;
      }
    }
    for (const tri of this.stalagmites) {
      if (inTriangle(x, y, tri[0], tri[1], tri[2])) c = 0x261741;
    }
    // cristales rosas brillantes
    for (const [cx, cy, r] of this.crystals) {
      const dd = Math.abs(x - cx) + Math.abs(y - cy);
      if (dd <= r) {
        c = dd <= r - 1 ? 0xffc1df : 0xff7ab5;
        if (dd === 0) c = 0xffffff;
      }
    }
    return c;
  }

  makeSpider() {
    this.makePixels('spider', 24, 20, (x, y) => this.spiderColor(x, y));
  }

  spiderColor(x, y) {
    let c = null;

    // patas (derechas e izquierdas reflejadas)
    for (const leg of SPIDER_LEGS) {
      const dl = polyDist(x, y, leg);
      const dm = polyDist(x, y, leg.map(([px, py]) => [24 - px, py]));
      const d = Math.min(dl, dm);
      if (d < 1.25) c = COLORS.pinkBright;
      else if (d < 2.1) c = COLORS.pinkDark;
    }

    // abdomen
    const dAb = dist(x, y, 12, 13);
    if (dAb <= 6) {
      c = COLORS.white;
      if (dAb > 5.3) c = COLORS.pink;
    }

    // cefalotorax (cabeza)
    const dH = dist(x, y, 12, 5);
    if (dH <= 3.8) {
      c = COLORS.white;
      if (dH > 3.2) c = COLORS.pink;
    }

    // manchas negras
    for (const [sx, sy, sr] of SPIDER_SPOTS) {
      if (dist(x, y, sx, sy) <= sr) c = COLORS.black;
    }

    // ojos rosas
    if (dist(x, y, 10, 4) <= 1.6 || dist(x, y, 14, 4) <= 1.6) c = COLORS.pinkEye;

    // hocico / zona delantera rosa
    if (dist(x, y, 12, 6.5) <= 1.2) c = COLORS.pink;

    return c;
  }

  makeRock() {
    this.makePixels('rock', 12, 10, (x, y) => this.rockColor(x, y));
  }

  rockColor(x, y) {
    const d = Math.hypot((x - 6.5) / 5.2, (y - 4.5) / 3.6);
    if (d > 1) return null;
    let c = 0x5c5c6e;
    if (d > 0.82) c = 0x44444f;
    if (dist(x, y, 4, 2.6) < 1.7) c = 0x8a8a9c;
    if (dist(x, y, 3, 3.5) < 0.9) c = 0xa4a4b5;
    if (hash2(x, y) % 7 === 0) c = hash2(x + 1, y) % 2 === 0 ? 0x474756 : 0x6f6f82;
    return c;
  }

  makeBug() {
    this.makePixels('bug', 10, 8, (x, y) => this.bugColor(x, y));
  }

  bugColor(x, y) {
    const d = Math.hypot((x - 5) / 3.6, (y - 4) / 2.8);
    if (d > 1) return null;
    let c = 0x1a1a1a;
    if (d > 0.8) c = 0x090909;
    if (dist(x, y, 4, 3) < 0.9) c = 0x3a3a3a;
    if (dist(x, y, 3, 2) <= 1.2 || dist(x, y, 7, 2) <= 1.2) c = COLORS.pinkEye;
    return c;
  }

  makeWeb() {
    this.makePixels('web', 16, 16, (x, y) => this.webColor(x, y));
  }

  webColor(x, y) {
    const cx = 8;
    const cy = 7.5;
    const d = dist(x, y, cx, cy);
    if (d > 7.2) return null;
    let c = null;

    // hilados radiales (12 rayos)
    if (d > 0 && d <= 7) {
      const snapped =
        Math.round(Math.atan2(y - cy, x - cx) / (Math.PI / 6)) * (Math.PI / 6);
      const px = cx + Math.cos(snapped) * d;
      const py = cy + Math.sin(snapped) * d;
      if (dist(x, y, px, py) < 0.45) c = 0xefe4ff;
    }

    // hebras en espiral: anillos con cortes desfasados
    const rings = [2.2, 3.7, 5.2, 6.6];
    for (let ri = 0; ri < rings.length; ri++) {
      const rr = rings[ri];
      if (Math.abs(d - rr) <= 0.5) {
        const ang = Math.atan2(y - cy, x - cx);
        if (Math.sin(ang * 8 + ri * 1.3) < 0.65) c = 0xefe4ff;
      }
    }

    // sostén exterior mas grueso
    if (Math.abs(d - 6.9) <= 0.55) c = 0x4a2d63;

    // centro rosa brillante
    if (d <= 1.5) {
      c = 0xff8fc0;
      if (d <= 0.7) c = 0xffffff;
    }
    return c;
  }

  drawWebIcons() {
    if (this.webIcons) {
      this.webIcons.forEach((i) => i.destroy());
    }
    this.webIcons = [];
    for (let i = 0; i < MAX_WEBS; i++) {
      const ic = this.add.image(22 + i * 24, HEIGHT - 24, 'web').setScale(2).setDepth(20);
      this.webIcons.push(ic);
    }
    this.updateWebIcons();
  }

  updateWebIcons() {
    if (!this.webIcons) return;
    this.webIcons.forEach((ic, i) => ic.setAlpha(i < this.webs ? 1 : 0.2));
  }

  updateScoreText() {
    this.scoreText.setText('Puntos: ' + (this.score + this.bonus));
  }

  shootWeb() {
    if (this.state !== 'playing' || this.webs <= 0) return;
    this.webs--;
    this.updateWebIcons();
    const web = this.websGroup.create(this.player.x, this.player.y - 45, 'web');
    web.setScale(3);
    web.setCircle(14);
    web.setVelocityY(-WEB_SPEED);
  }

  onWebCatch(web, obs) {
    web.destroy();
    obs.destroy();
    this.bonus += WEB_BONUS;
    this.updateScoreText();
    this.spawnWebBurst(obs.x, obs.y);
  }

  spawnWebBurst(x, y) {
    const p = this.add.image(x, y, 'web').setScale(2).setDepth(10);
    this.tweens.add({
      targets: p,
      scale: 0.2,
      alpha: 0,
      duration: 300,
      onComplete: () => p.destroy(),
    });
  }

  // ---- HUD ----

  drawHearts() {
    if (this.heartGroup) this.heartGroup.destroy(true);
    this.heartGroup = this.add.group();
    for (let i = 0; i < MAX_LIVES; i++) {
      const filled = i < this.lives;
      const heart = this.add
        .text(24 + i * 30, 14, filled ? '\u2764' : '\u2661', {
          fontFamily: '"Courier New", monospace',
          fontSize: '22px',
          color: filled ? '#ff5fa2' : '#ffffff',
        })
        .setDepth(20);
      this.heartGroup.add(heart);
    }
  }

  // ---- jugabilidad ----

  spawnObstacle() {
    const x = Phaser.Math.Between(40, WIDTH - 40);
    const type = Math.random() < 0.5 ? 'rock' : 'bug';
    const obs = this.obstacles.create(x, -60, type);
    obs.setScale(7);
    obs.setCircle(type === 'rock' ? 6 : 4);
    const speed = Math.min(BASE_SPEED + this.score * 0.6, MAX_SPEED);
    obs.setVelocityY(speed);
    obs.setAngularVelocity(Phaser.Math.Between(-60, 60));
  }

  onHit() {
    if (this.state !== 'playing') return;
    if (this.time.now < this.invulnUntil) return;

    this.lives--;
    this.drawHearts();
    this.invulnUntil = this.time.now + INVULN_MS;

    if (this.lives <= 0) {
      this.gameOver();
    } else {
      const victims = this.obstacles.getChildren().slice(0, 3);
      victims.forEach((o) => o.destroy());
    }
  }

  gameOver() {
    this.state = 'gameover';
    this.player.setTint(0x555555);

    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x000000, 0.6).setDepth(30);

    this.add
      .text(WIDTH / 2, HEIGHT / 2 - 40, 'GAME OVER', {
        fontFamily: '"Courier New", monospace',
        fontSize: '44px',
        fontStyle: 'bold',
        color: '#ff8fc0',
      })
      .setOrigin(0.5)
      .setDepth(31);

    this.add
      .text(WIDTH / 2, HEIGHT / 2 + 18, 'Puntuacion: ' + this.score, {
        fontFamily: '"Courier New", monospace',
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setDepth(31);

    this.add
      .text(WIDTH / 2, HEIGHT / 2 + 56, 'Presiona ESPACIO o R para jugar de nuevo', {
        fontFamily: '"Courier New", monospace',
        fontSize: '16px',
        color: '#ffd9ec',
      })
      .setOrigin(0.5)
      .setDepth(31);
  }

  restart() {
    this.scene.restart();
  }

  update() {
    if (this.state === 'playing') {
      if (Phaser.Input.Keyboard.JustDown(this.keySpace)) this.shootWeb();

      const left = this.cursors.left.isDown || this.keyA.isDown;
      const right = this.cursors.right.isDown || this.keyD.isDown;
      let vx = 0;
      if (left) vx -= PLAYER_SPEED;
      if (right) vx += PLAYER_SPEED;
      this.player.setVelocityX(vx);

      if (this.time.now < this.invulnUntil) {
        this.player.setAlpha(Math.sin(this.time.now * 0.02) > 0 ? 0.5 : 1);
      } else {
        this.player.setAlpha(1);
      }

      this.score = Math.floor(this.time.now / 1000);
      this.updateScoreText();

      this.obstacles.getChildren().forEach((o) => {
        if (o.y > HEIGHT + 60) o.destroy();
      });
      this.websGroup.getChildren().forEach((w) => {
        if (w.y < -40) w.destroy();
      });
    }

    if (this.state === 'gameover' && (this.keyR.isDown || this.keySpace.isDown)) {
      this.restart();
    }
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#0d0616',
  render: {
    pixelArt: true,
    antialias: false,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  audio: {
    noAudio: true,
  },
  scene: SpiderBlancScene,
};

new Phaser.Game(config);