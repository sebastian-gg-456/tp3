# Evidencia de pruebas

Relaciona cada criterio de aceptacion con una prueba o secuencia manual que otra persona pueda repetir.

| Criterio | Version validada | Metodo o comando | Pasos | Resultado esperado | Resultado observado | Evidencia |
|---|---|---|---|---|---|---|
| Sintaxis valida del juego | Prototipo local | `node --check js/game.js` | Ejecutar el comando en la carpeta del proyecto | Sin errores de sintaxis | Sin errores | Salida del comando |
| Phaser carga y canvas visible | Prototipo local | Abrir `index.html` | Doble clic en `index.html` con internet | Canvas 800x600 con cueva pixel art de fondo y arana blanca/rosa | Pendiente de confirmacion manual | Directo del navegador |
| Movimiento de la arana | Prototipo local | Juego en navegador | Mantener flechas o A/D | La arana se desplaza y no sale del canvas | Pendiente | Prueba manual |
| Puntaje y dificultad creciente | Prototipo local | Juego en navegador | Dejar pasar varios segundos | Puntos = segundos sobrevividos; obstaculos mas veloces | Pendiente | Prueba manual |
| Vidas e invulnerabilidad | Prototipo local | Juego en navegador | Chocar contra un obstaculo | Pierde un corazon, parpadea 1,5 s sin perder otra vida | Pendiente | Prueba manual |
| Game over y reinicio | Prototipo local | Juego en navegador | Perder las 3 vidas y pulsar ESPACIO o R | Pantalla de game over y reinicio limpio | Pendiente | Prueba manual |

## Fallos y limites pendientes

- Reproduccion: Requiere conexion a internet por el CDN de Phaser; sin red, el juego no carga.
- Impacto: Solo afecta la primera carga; no es un defecto del codigo.
- Decision: Pospuesto: documentar como requisito "conexion a internet" en README (hecho).