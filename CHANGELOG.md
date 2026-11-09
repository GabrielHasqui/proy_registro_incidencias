# Historial de versiones

Este proyecto usa versionamiento semántico con el formato `MAJOR.MINOR.PATCH`.

- **MAJOR** aumenta cuando un cambio deja de ser compatible con la versión anterior.
- **MINOR** aumenta cuando se agrega una funcionalidad compatible.
- **PATCH** aumenta cuando se corrige un error sin agregar funcionalidades.

## [1.1.1] - Corrección

### Corregido
- Se corrigió el error registrado en el Issue de la versión 1.1.0. *(Completar con el número del Issue y el pull request de la corrección.)*

## [1.1.0] - Filtro por estado

### Agregado
- Selector **Filtrar por estado** en la cabecera del tablero con las opciones Todos, Abierta, En proceso y Resuelta.
- El contador muestra cuántas incidencias coinciden con el filtro, por ejemplo `1 de 3 reportes`.

## [1.0.0] - Versión inicial

### Agregado
- Registro de incidencias con título y descripción. Cada incidencia nueva se crea en estado Abierta.
- Listado de incidencias en un tablero con las columnas Abierta, En proceso y Resuelta.
- Cambio de estado arrastrando la tarjeta a otra columna.
- Carga de incidencias de ejemplo desde `data/incidencias.json` y almacenamiento de los registros nuevos en el navegador.
