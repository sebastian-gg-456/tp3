# GDD simplificado

## Juego y experiencia

- Genero y situacion de juego: Arcade infinito de esquivar obstaculos. La arana
  esta en la base de una telarana y caen rocas y bichos desde arriba.
- Rol del jugador: Controla la arana blanca (SpiderBlanc) que se mueve
  horizontalmente al pie de la pantalla.
- Experiencia buscada: Partidas cortas y rejugables donde la tension crece con la
  velocidad de los obstaculos y el puntaje.

## Comportamiento a resolver

- Entidad: SpiderBlanc (arana blanca con detalles rosas y manchas negras).
- Problema actual: No tiene nada que esquivar ni mecanica de riesgo/recompensa.
- Comportamiento esperado: El jugador esquiva los obstaculos que caen; cada
  segundo sobrevivido suma 1 punto; el impacto descontando vidas hasta el game
  over, con reinicio inmediato.

## Reglas

- Estados, condiciones o eventos relevantes: Jugando, invulnerabilidad (1,5 s tras
  un golpe), game over (0 vidas).
- Accion del jugador o del entorno: Flechas/A/D mueven la arana de costado; los
  obstaculos nacen en la parte superior con velocidad creciente y rotan al caer.
- Resultado esperado: +1 punto por segundo, -1 vida por golpe, reinicio con
  ESPACIO o R.
- Caso limite: Obstaculos gemelos muy juntos; por eso el golpe otorga
  invulnerabilidad breve y destruye los 3 obstaculos mas proximos.

## Limites

- Fuera de alcance: Sin niveles, sin power-ups, sin pantallas de configuracion,
  sin assets externos.
- Restricciones tecnicas: Phaser 3 v3.60.0 por CDN, JavaScript puro, sin npm ni
  build; graficos generados con la API Graphics.
- Criterios de aceptacion: Control responsivo, puntaje visible, 3 vidas,
  game over y reinicio funcionando.