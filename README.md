# Registro de incidencias

Base preliminar para la versión `v1.0.0` del proyecto grupal de Gestión de la Configuración del Software. La aplicación está hecha con HTML, CSS y JavaScript.

## Cómo usarla

1. Abre `index.html` en Chrome o Edge.
2. Pulsa **Nueva incidencia** y escribe un título y una descripción.
3. Guarda el reporte. Aparecerá en el listado con estado **Abierta**.

Para probarla con un servidor local, ejecuta `py -m http.server 8000 --bind 127.0.0.1` desde la carpeta del proyecto y abre [la aplicación local](http://127.0.0.1:8000/).

## Archivos

- `index.html` contiene el listado y el formulario.
- `estilos.css` define el diseño del tablero, las tarjetas y el modal.
- `app.js` valida, guarda y muestra las incidencias.

Los reportes se guardan en el almacenamiento local del navegador. Cada registro contiene un identificador, el título, la descripción, el estado y la fecha.
