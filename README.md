# Registro de incidencias

Base preliminar de la aplicación para el proyecto grupal de Gestión de la Configuración del Software. Está hecha con HTML, CSS y JavaScript.

## Cómo usarla

Desde la carpeta del proyecto, ejecuta `py -m http.server 8000 --bind 127.0.0.1` y abre [la aplicación local](http://127.0.0.1:8000/) en el navegador.

Pulsa **Nueva incidencia**, escribe un título y una descripción y guarda el reporte. El tablero muestra las columnas **Abierta**, **En proceso** y **Resuelta**. Las incidencias nuevas aparecen en **Abierta**. Para cambiar el estado, arrastra la tarjeta con el mouse a la columna de destino. La barra lateral lleva directamente a cada columna.

Para ver solo las incidencias de un estado, elige una opción en **Filtrar por estado**. Con **Todos** se vuelven a mostrar las tres columnas.

## Estructura

- `index.html` contiene la página y el formulario.
- `css/estilos.css` define el diseño.
- `js/app.js` valida los datos y actualiza el tablero.
- `data/incidencias.json` contiene los registros de ejemplo que se cargan al iniciar.

La aplicación lee el archivo JSON y guarda los registros nuevos y los cambios de estado como JSON en el almacenamiento local del navegador. Cada navegador conserva sus propios registros.

## Versiones

Las versiones siguen el formato `MAJOR.MINOR.PATCH` y se publican como releases en GitHub. El detalle de cada versión está en [CHANGELOG.md](CHANGELOG.md).

| Versión | Contenido |
| --- | --- |
| v1.0.0 | Registro y listado de incidencias. |
| v1.1.0 | Filtro de incidencias por estado. |
| v1.1.1 | Corrección del error identificado en la versión 1.1.0. |
