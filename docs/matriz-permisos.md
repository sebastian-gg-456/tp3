# Matriz de permisos

Completa esta matriz antes de habilitar acciones de un agente. Una accion no declarada debe considerarse prohibida hasta consultar.

| Accion | Estado | Alcance o justificacion |
|---|---|---|
| Leer archivos del proyecto | Permitida | Lectura de README, GDD, docs y el codigo del prototipo. |
| Buscar rutas y simbolos | Permitida | Verificacion de rutas y sintaxis del codigo Phaser. |
| Editar archivos previstos | Permitida | `index.html`, `css/style.css`, `js/game.js`, `README.md`, `GDD.md`, `docs/*`. |
| Ejecutar scripts documentados | Permitida | `node --check` para validar sintaxis de `js/game.js`. |
| Instalar dependencias | Prohibida | El proyecto usa Phaser 3 por CDN, sin npm ni build. |
| Usar red | Prohibida | No se descargan assets; el CDN lo resuelve el navegador del usuario. |
| Publicar o subir cambios | Prohibida | No se hace commit ni push hasta autorizacion explicita. |
| Acceder a secretos o credenciales | Prohibida | No corresponde al trabajo. |

## Condiciones de detencion

- Consultar si el estudiante quiere cambiar el motor, la mecanica o el alcance.
- Consultar antes de instalar dependencias, usar red o publicar cambios.