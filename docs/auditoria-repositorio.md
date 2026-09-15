# Auditoria del repositorio

## Objetivo

Registrar hechos verificables sobre la estructura, arquitectura y validacion del proyecto antes de proponer cambios.

## Rutas y simbolos relevantes

| Ruta o simbolo | Rol observado | Evidencia |
|---|---|---|
| `index.html` | Pagina base que carga Phaser 3 por CDN y el script del juego | Archivo creado |
| `css/style.css` | Estilos de fondo, encabezado y contenedor del canvas | Archivo creado |
| `js/game.js` | Escena `SpiderBlancScene` y configuracion del juego (creacion de arana, obstaculos, colisiones, puntaje, vidas, game over) | `node --check js/game.js` sin errores |
| `README.md` | Datos del proyecto, requisitos, controles y creditos | Archivo actualizado |
| `GDD.md` | Intencion de diseno del prototipo | Archivo actualizado |
| `docs/*` | Artefactos del proceso (matriz, plan, especificacion, evidencia, informe) | Archivos completados |

## Flujo observado

`index.html` carga Phaser 3 y ejecuta `js/game.js`, que crea una escena de 800x600. La escena genera las texturas (arana, roca, bicho) con Graphics, spawnea obstaculos desde arriba con velocidad creciente, detecta colisiones con el jugador (Arcade Physics), actualiza puntaje/vidas y muestra game over con reinicio.

## Pruebas y comandos disponibles

| Comando o prueba | Que verifica | Resultado inicial |
|---|---|---|
| `node --check js/game.js` | Sintaxis de JavaScript valida | OK, sin errores |
| Abrir `index.html` en un navegador | Phaser carga por CDN, canvas y jugabilidad | Pendiente de validacion manual por el estudiante |

## Hechos, supuestos y preguntas abiertas

- Hechos comprobados: Clon de la plantilla; no habia codigo; ahora existe `index.html`, `css/` y `js/game.js`; sintaxis del script valida.
- Supuestos por verificar: Que el CDN de Phaser responda en la red del estudiante y que el canvas se vea bien en su pantalla.
- Preguntas para consultar: Nombre real del estudiante, materia/anio y si quiere publicar el repositorio.