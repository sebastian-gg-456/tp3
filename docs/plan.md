# Plan de intervencion

## Objetivo del plan

Crear un prototipo jugable y simple en Phaser 3 donde una arana blanca (detalles rosas y manchas negras) esquiva obstaculos que caen, con puntaje, vidas y reinicio. Sin ampliar el alcance: sin build, sin dependencias instaladas, sin assets externos.

## Cambios propuestos

| Paso | Cambio minimo | Archivos previstos | Verificacion | Riesgo | Condicion de detencion |
|---:|---|---|---|---|---|
| 1 | Pagina base con Phaser 3 por CDN | `index.html`, `css/style.css` | Abrir `index.html` y ver el canvas | CDN sin conexion | Consultar si no carga Phaser |
| 2 | Escena del juego con arana procedural | `js/game.js` | `node --check js/game.js` | Error de sintaxis | Corregir antes de continuar |
| 3 | Mecanica de esquivar, puntaje y vidas | `js/game.js` | Prueba manual en navegador | Colisiones o reinicio fallidos | Consultar ante fallo sin causa comprendida |
| 4 | Documentar proyecto y proceso | `README.md`, `GDD.md`, `docs/*` | Relectura de marcadores `[PENDIENTE]` | Contenido ficticio | No inventar datos |

## Orden de implementacion

Primero la base ejecutable para validar que Phaser carga; luego la jugabilidad; al final la documentacion, que describe hechos ya verificados.

## Fuera de alcance

- Instalar npm/Vite o cualquier dependencia.
- Descargar assets de terceros.
- Subir o publicar cambios en el repositorio.
- Niveles, power-ups, sonido o multijugador.