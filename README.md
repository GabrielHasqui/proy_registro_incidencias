# Sistema de registro de incidencias

Proyecto grupal de la asignatura Gestión de la Configuración del Software. La aplicación permite registrar incidencias con un título y una descripción. Cada reporte se crea en estado **Abierta**. El listado muestra los reportes más recientes primero y permite filtrar por estado.

## Ejecutar en Windows

Se requiere Python 3.14. Desde PowerShell, clona el repositorio si aún no tienes una copia.

```powershell
git clone https://github.com/GabrielHasqui/proy_registro_incidencias.git
cd proy_registro_incidencias
```

Desde la raíz del proyecto, crea el entorno virtual, instala Django, aplica las migraciones e inicia el servidor.

```powershell
py -3.14 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py runserver
```

Abre [la aplicación local](http://127.0.0.1:8000/) y selecciona **Nueva incidencia** para abrir el formulario en un modal. Los reportes se guardan en SQLite. Para cambiar su estado, arrastra la tarjeta con el mouse a otra columna.

## Estructura MVT

| Componente | Ubicación | Función |
| --- | --- | --- |
| Modelo | `app/incidencias/models.py` | Define los campos de una incidencia y sus estados. |
| Vistas | `app/incidencias/views.py` | `IncidenciaListaView` usa `ListView` y `IncidenciaCrearView` usa `CreateView`. |
| Plantillas | `templates/incidencias/` | Presentan el listado y el formulario. |
| Rutas | `app/incidencias/urls.py` | Conectan las direcciones con las vistas. |

## Validación

```powershell
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py makemigrations --check --dry-run
.\.venv\Scripts\python.exe manage.py test
```

GitHub Actions ejecuta estas comprobaciones en los pull requests hacia `main` y cuando se suben cambios a esa rama.

## Releases previstas

| Versión | Alcance |
| --- | --- |
| `v1.0.0` | Registro y listado de incidencias. |
| `v1.1.0` | Filtro de incidencias por estado. |
| `v1.1.1` | Validación del estado recibido por la URL para que un valor desconocido muestre el listado completo. |

El código local contiene las tres funcionalidades. Para presentar la evolución mediante commits distintos, el equipo puede integrar primero el registro y el listado, después el filtro y por último la validación del parámetro junto con su prueba. Para reproducir el caso de la corrección en la versión previa, registra incidencias y abre `/?estado=desconocido`. Un filtro que aplica ese valor directamente oculta todos los registros. Con la validación, se muestra el listado completo. Registra el caso en un Issue, vincula el pull request y documenta el antes y el después en las notas de la versión.

Cada integrante debe realizar al menos dos commits propios y abrir un pull request hacia `main` para que otro compañero revise sus cambios.

## Despliegue

La configuración actual sirve para desarrollo local. GitHub Pages aloja archivos estáticos y Django requiere un servidor Python. Para publicar esta aplicación, el equipo debe acordar con el docente un alojamiento compatible y configurar allí el despliegue posterior a la validación. [Documentación de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
