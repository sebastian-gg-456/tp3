# Informe final

## Resultado

Se creo un prototipo jugable en Phaser 3 (v3.60.0, CDN) donde una arana blanca con detalles rosas y manchas negras esquiva rocas y bichos que caen. El criterio que verifica el resultado: `node --check js/game.js` sin errores y las pruebas manuales documentadas en `evidencia-pruebas.md`.

## Cambios y decisiones

- Cambios realizados: se agrego `index.html`, `css/style.css` y `js/game.js`; se actualizaron `README.md` y `GDD.md`; se completaron los docs de proceso.
- Decisiones humanas relevantes: nombre SpiderBlanc; mecanica de esquivar obstaculos; Phaser 3 por CDN sin instalar nada; 3 vidas; reinicio con ESPACIO o R.
- Acciones del agente aceptadas, rechazadas o corregidas: se acepto todo; se simplifico internamente el spawn de obstaculos (sin impacto en el alcance).

## Validacion

- Camino principal: movimiento con flechas/A/D, puntaje por segundo y velocidad creciente. Validado por sintaxis OK; prueba manual pendiente del estudiante.
- Caso limite: perdida de vidas con invulnerabilidad temporal y game over con reinicio. Validado por sintaxis OK; prueba manual pendiente.
- Version validada: prototipo local (aun sin commit ni push).

## Limites y riesgos pendientes

- El CDN de Phaser requiere internet; sin conexion no carga el juego.
- Faltan datos personales del estudiante en README (nombre, materia, anio) y el enlace de entrega/demostracion.
- Proximo paso: que el estudiante abra `index.html`, pruebe el juego y, si quiere, haga commit.