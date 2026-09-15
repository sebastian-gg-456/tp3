# SpiderBlanc

Prototipo de juego realizado con **Phaser 3** (v3.60.0) vía CDN, sin build ni instalación de dependencias.

> Repositorio creado a partir de la plantilla PIAPC para repositorios individuales.

## Datos del proyecto

- Estudiante: [PENDIENTE - completar con tu nombre]
- Materia, comision y anio: [PENDIENTE - completar]
- Nombre del proyecto: SpiderBlanc
- Motor y version: Phaser 3 (v3.60.0) vía CDN, JavaScript puro
- Estado: Prototipo jugable (juego simple de esquivar obstaculos)

## Descripcion

Eres una arana blanca con detalles rosas y manchas negras que debe esquivar
rocas y bichos que caen del cielo dentro de una cueva. Todo el arte es **pixel
art** generado proceduralmente (araña, obstaculos y cueva se dibujan pixel a
pixel y se escalan con filtro NEAREST). Cada segundo sobrevivido suma puntos y
acelera la caida de los obstaculos. Con **ESPACIO** podes disparar bolas de
tela que atrapan obstaculos (2 puntos extra); tenes 3 cargas de tela que se
regeneran cada 4 segundos. Tenes 3 vidas; al agotarlas es game over y podes
reiniciar con ESPACIO o R.

## Requisitos y ejecucion

- Cualquier navegador moderno con conexion a internet (el script de Phaser se
  carga desde CDN).
- No requiere `npm install`, build ni servidor: abrir `index.html` basta.

Pasos:
1. Clona o descarga el repositorio.
2. Doble clic en `index.html` (o sirvelo con cualquier servidor estatico).

## Controles

- Flechas izquierda / derecha o A / D: mover la arana.
- ESPACIO: disparar una bola de tela que atrapa obstaculos (+2 puntos).
- ESPACIO o R: reiniciar la partida luego del game over.

## Creditos

- Motor: Phaser 3 (MIT) https://phaser.io
- Todos los graficos del juego se generan proceduralmente con la API Graphics
  de Phaser; no se usan assets de terceros.

## Entrega o demostracion

[PENDIENTE - agregar enlace a compilacion, video o publicacion cuando lo pida la consigna]