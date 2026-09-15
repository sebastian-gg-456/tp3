# GDD - SpiderBlanc

> Documento de diseno del juego **SpiderBlanc**.
> Motor: Phaser 3 (v3.60.0) via CDN | Arte: pixel art procedural | Sin assets externos.

---

## 1. Resumen del proyecto

| Campo | Detalle |
|---|---|
| Nombre | SpiderBlanc |
| Genero | Arcade infinito de esquivar obstaculos |
| Plataforma | Navegador web (PC, teclado) |
| Motor / version | Phaser 3.60.0 por CDN |
| Lenguaje | JavaScript puro (sin build, sin npm) |
| Duracion de la partida | Partidas cortas (1 a 3 minutos en promedio) |
| Modelo de partida | Un jugador, partida infinita con dificultad creciente |
| Estado | Prototipo jugable |

---

## 2. Concepto y premisa

En lo profundo de una cueva, una arana blanca con detalles rosas y manchas
negras busca sobrevivir a la lluvia de rocas y bichos negros que caen del
techo. Sin atajos ni escudos: solo su velocidad lateral y la seda que teje
para neutralizar a sus presas.

La fantasia central es **"soy una arana rapida y tramposa"**: esquivar por
habilidad y, cuando las condiciones aprietan, gastar seda para borrar del mapa
al obstaculo que se acerca.

---

## 3. Objetivos

- **Objetivo del juego:** sobrevivir el mayor tiempo posible y acumular el
  puntaje mas alto.
- **Objetivo por partida:** cada segundo sobrevivido suma 1 punto; atrapar un
  obstaculo con la tela suma 2 puntos extra.
- **Objetivo de diseno:** generar tension progresiva (velocidad de caida) con
  un contrapeso de gestion de recursos (cargas de tela).

---

## 4. Mecanicas del jugador

### 4.1 Movimiento

- La arana se mueve en el eje horizontal al pie del area de juego.
- Entradas: flechas izquierda/derecha o teclas A / D.
- Velocidad constante: `320 px/s`.
- La arana no puede salir de los bordes del canvas (colision de bordes).

### 4.2 Disparo de tela (mecanica principal tematica)

- Entrada: tecla **ESPACIO** (presion corta; usa `JustDown`, no se repite al
  mantenerla).
- La arana lanza una bola de telarana hacia arriba (`430 px/s`) por la columna
  en la que se encuentra.
- Al tocar el primer obstaculo, la tela lo atrapa: destruye el obstaculo y
  otorga **+2 puntos** (bonus, no afecta la dificultad).
- Si la tela sale por arriba de la pantalla sin atrapar nada, se pierde.
- **Recurso:** la arana tiene **3 cargas de tela** (visibles en el HUD).
  - Disparar consume 1 carga.
  - Las cargas se **regeneran una cada 4 segundos** mientras la partida esta
    activa, hasta el maximo de 3.

### 4.3 Toma de decisiones

- Disparar ahora (neutraliza el peligro inmediato) o conservar seda para
  cuando la dificultad sea mayor.
- La regeneracion lenta castiga el gasto derrochador.

---

## 5. Obstaculos y dificultad

### 5.1 Tipos de obstaculos

| Tipo | Forma | Tamano en mundo (escala 7) | Colision (circulo) | Imagen |
|---|---|---|---|---|
| Roca | Piedra gris con brillos | ~84 x 70 px | radio 6 (muy permisivo) | Textura 12x10 px |
| Bicho negro | Escarabajo negro con ojos rosas | ~70 x 56 px | radio 4 | Textura 10x8 px |

- Nacen en la parte superior del canvas en una posicion X aleatoria (entre
  margenes de 40 px) y caen con velocidad vertical constante.
- Rotan mientras caen (velocidad angular aleatoria entre -60 y 60 grados/s).
- Al superar el borde inferior de la pantalla se eliminan (no punis). Se
  reusan/eliminan para mantener la poblacion acotada.

### 5.2 Curva de dificultad

- `velocidad = min(180 + puntaje(tiempo) * 0.6, 420)`
  - Arranca en 180 px/s y crece 0.6 px/s por segundo sobrevivido.
  - Tope de 420 px/s (meseta para no volverse imposible).
- Cadencia de aparicion: 1 obstaculo cada **700 ms** (constante).
- La dificultad solo sube con el tiempo sobrevivido, no con el bonus de tela.

### 5.3 Colisiones de la arana

- Cuerpo de colision de la arana: **circulo de radio 6** (mucho menor que la
  silueta visible; disenado a proposito para que el juego se sienta "justo y
  permisivo", los graficos no penalizan al jugador).
- Al colisionar:
  - Pierde 1 vida.
  - Obtiene **invulnerabilidad de 1,5 s** (la arana parpadea: alpha alterna
    entre 0.5 y 1).
  - Si sobrevive, se destruyen los **3 obstaculos mas proximos** (alivio
    despues del impacto para evitar muerte encadenada).
  - Si pierde la tercera vida → **game over**.

---

## 6. Vidas, puntaje y estados

### 6.1 Vidas

- 3 vidas de inicio, representadas como corazones en el HUD.
- Sin vidas extra ni recoleccion de vida.

### 6.2 Puntaje

- `puntaje total = segundos sobrevividos + (atrapes con tela * 2)`
- El puntaje nunca decrece.

### 6.3 Estados de la partida

| Estado | Transicion | Comportamiento |
|---|---|---|
| Jugando | Inicia la escena | Movimiento, spawn de obstaculos, tela, puntaje |
| Invulnerable | Golpe (sigue con vidas) | Parpadeo 1,5 s; no puede volver a ser golpeado |
| Game over | Se agotan las 3 vidas | Se detiene el spawn; overlay oscuro con puntaje |
| Reinicio | ESPACIO o R en game over | `scene.restart()`: todo vuelve al estado inicial |

---

## 7. Controles

| Accion | Tecla |
|---|---|
| Moverse a la izquierda | Flecha izquierda o A |
| Moverse a la derecha | Flecha derecha o D |
| Disparar tela | ESPACIO |
| Reiniciar (solo en game over) | ESPACIO o R |

---

## 8. Ambientacion y narrativa

- **Entorno:** una cueva subterranea generada proceduralmente, siempre con la
  misma semilla (2026) para que se vea identica en cada partida.
- **Elementos de la cueva:**
  - Paredes laterales con perspectiva (convergen hacia el fondo).
  - Techo rocoso irregular con **estalactitas** grandes.
  - Piso con borde superior destacado, **estalagmitas** y rocas sueltas.
  - Luz central tipo entrada de cueva (brillo que da profundidad).
  - Cristales rosas brillantes (coherencia con la paleta de la protagonista).
- **Mensaje de fondo:** la escena es oscura y hostil para que la arana blanca y
  rosa resalte por contraste.

---

## 9. Estilo visual

### 9.1 Pixel art

- Todas las texturas se generan **pixel a pixel** en una textura canvas
  (1 píxel por celda) y se escalan con filtro **NEAREST** (`pixelArt: true`).
- Resoluciones base de las texturas:

| Textura | Grilla base | Escala en pantalla |
|---|---|---|
| Arana | 24 x 20 px | x4 (~96 x 80 px) |
| Roca | 12 x 10 px | x7 (~84 x 70 px) |
| Bicho | 10 x 8 px | x7 (~70 x 56 px) |
| Tela | 16 x 16 px | x3 (proyectil) / x2 (icono) |
| Cueva | 200 x 150 px | x4 (fondo 800 x 600) |

### 9.2 Paleta

| Color | Uso |
|---|---|
| `#FFFFFF` | Cuerpo de la arana (abdomen y cefalotorax) |
| `#FF8FC0 - #D95C9E` | Rosas: patas, franjas, contornos y seda |
| `#FF5FA2` | Ojos y detalles calientes |
| `#1A1A1A` | Manchas del abdomen y bichos |
| `#0D0718 - #4A2764` | Aire de la cueva (gradiente) |
| `#FFC1DF / #FF7AB5` | Cristales |

### 9.3 Anatomia de la arana (pixel art)

- **8 patas** rosas simetricas, articuladas (polilineas de 4 puntos con
  contorno mas oscuro y brillo interior).
- Abdomen blanco con borde rosa y **manchas negras** asimetricas.
- Cefalotorax blanco mas pequeno, ojos rosas brillantes y marca rosa frontal.

---

## 10. Interfaz (HUD)

| Elemento | Posicion | Contenido |
|---|---|---|
| Corazones (vidas) | Superior izquierda | 3 corazones, el perdido se vuelve contorno vacio |
| Puntaje | Superior derecha | `Puntos: X` (tiempo + bonus) |
| Indicador de tela | Inferior izquierda | 3 iconos de telarana; vacios a 20% de alpha |
| Texto de ayuda | Centro superior | `Flechas / A D moverte | ESPACIO: tela` |
| Pantalla de game over | Centro | "GAME OVER", puntaje, indicacion de reinicio |

---

## 11. Audio

- **Sin audio por ahora.** El contexto de Phaser se desactiva
  (`audio.noAudio = true`) para evitar bloqueos de autoplay; queda como
  pendiente de una futura iteracion.

---

## 12. Especificacion tecnica

- **Ejecucion:** abrir `index.html` en cualquier navegador moderno con
  internet (Phaser se carga por CDN). No requiere instalacion, build ni
  servidor.
- **Estructura:**
  - `index.html`: pagina principal y carga de Phaser.
  - `css/style.css`: estilos de la pagina.
  - `js/game.js`: escena, generacion de texturas, fisica, entradas y estados.
- **Fisica:** Arcade Physics, sin gravedad.
- **Generacion de cueva:** ruido determinista (mulberry32 con semilla fija),
  gradientes, estalactitas/estalagmitas por prueba de punto-en-triangulo y
  cristales por distancia Manhattan.

---

## 13. Criterios de aceptacion

1. La arana se mueve de lado a lado sin salir del canvas.
2. Los obstaculos aparecen con velocidad creciente y rotan.
3. El puntaje refleja tiempo sobrevivido + bonus de tela.
4. La tela (ESPACIO) atrapa obstaculos, otorga bonus y no se repite al
   mantener la tecla; las cargas se regeneran.
5. El impacto cuesta 1 vida, da invulnerabilidad breve y destruye obstaculos
   proximos.
6. Con 0 vidas: pantalla de game over y reinicio limpio con ESPACIO o R.
7. El reinicio no produce errores de consola ni texturas duplicadas.
8. Todo el arte es pixel art procedural, sin dependencias ni assets externos.

---

## 14. Fuera de alcance (version actual)

- Sonido y musica.
- Niveles con escenarios diferentes o jefes.
- Power-ups, mejoras o arbol de habilidades.
- Modo 2 jugadores o puntajes online.
- Soporte para pantallas tactiles / movil.
- Localizacion a otros idiomas.

---

## 15. Roadmap sugerido (futuro)

1. Puntuacion maxima persistida (localStorage).
2. Sonido procedural (WebAudio) con sonidos de seda y golpe.
3. Nueva mecanica: tejer una "trampa" estatica en el piso que atrapa bichos.
4. Variantes de obstaculo (estalactitas que se desprenden).
5. Soporte movil con gestos.
6. Pantalla de inicio y de puntajes.