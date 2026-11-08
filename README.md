# Registro de incidencias

Base preliminar de la aplicación para el proyecto grupal de Gestión de la Configuración del Software. Está hecha con HTML, CSS y JavaScript.

## Cómo usarla

Desde la carpeta del proyecto, ejecuta `py -m http.server 8000 --bind 127.0.0.1` y abre [la aplicación local](http://127.0.0.1:8000/) en el navegador.

Pulsa **Nueva incidencia**, escribe un título y una descripción y guarda el reporte. El tablero muestra las columnas **Abierta**, **En proceso** y **Resuelta**. Las incidencias nuevas aparecen en **Abierta**. Para cambiar el estado, arrastra la tarjeta con el mouse a la columna de destino. La barra lateral lleva directamente a cada columna.

## Estructura

- `index.html` contiene la página y el formulario.
- `css/estilos.css` define el diseño.
- `js/app.js` valida los datos y actualiza el tablero.
- `data/incidencias.json` contiene los registros de ejemplo que se cargan al iniciar.

La aplicación lee el archivo JSON y guarda los registros nuevos y los cambios de estado como JSON en el almacenamiento local del navegador. Cada navegador conserva sus propios registros.
