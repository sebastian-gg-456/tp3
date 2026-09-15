# Especificacion

## Problema

El repositorio plantilla no contiene ningun juego ejecutable. El estudiante necesita un prototipo simple y jugable en Phaser 3 con una arana blanca de detalles rosas y manchas negras.

## Resultado esperado

Un prototipo de esquivar obstaculos: la arana se mueve con las flechas o A/D al pie de la pantalla, esquiva rocas y bichos que caen con velocidad creciente, suma 1 punto por segundo sobrevivido, tiene 3 vidas (corazones rosas) y permite reiniciar con ESPACIO o R tras el game over.

## Alcance

- Incluye: `index.html`, `css/style.css`, `js/game.js` (arana y obstaculos dibujados con Graphics), README y GDD actualizados, docs de proceso completados.
- No incluye: instalacion de dependencias, build, assets externos, sonido, niveles ni publicacion.

## Restricciones

- Tecnicas: Phaser 3 v3.60.0 por CDN, JavaScript puro, canvas de 800x600.
- Operativas: sin instalar dependencias, sin uso de red por parte del agente, sin publicar cambios.
- De calidad: sintaxis valida (`node --check`), controles responsivos, reinicio desde cualquier estado de game over.

## Casos y criterios de aceptacion

| Caso | Dado | Cuando | Entonces | Evidencia |
|---|---|---|---|---|
| Camino principal | Juego iniciado | Se mueve la arana con flechas/A/D | La arana se desplaza de lado a lado sin salir del canvas | Prueba manual en navegador |
| Camino principal | Juego iniciado | Pasan segundos | El puntaje sube y los obstaculos caen mas rapido | Prueba manual |
| Caso limite | La arana toca un obstaculo | Impacto | Pierde una vida (corazon), invulnerabilidad 1,5 s | Prueba manual |
| Caso limite | Las 3 vidas se agotan | Ultimo impacto | Pantalla de game over con puntaje | Prueba manual |
| Error | Game over | Se pulsa ESPACIO o R | Reinicia la partida sin errores | Prueba manual |

## Invariantes

- La arana nunca sale del area de juego (colision de bordes).
- El puntaje refleja segundos sobrevividos y nunca decrece.
- El juego nunca queda atascado sin poder reiniciar.

## Preguntas abiertas

- Ninguna bloqueante: el motor, el nombre (SpiderBlanc), la mecanica (esquivar obstaculos) y el setup (CDN sin instalar) ya fueron definidos por el estudiante.