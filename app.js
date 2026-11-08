const prefijo = "registro-incidencias:";
const formatoFecha = new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeStyle: "short",
});

const modal = document.querySelector("#registro");
const formulario = document.querySelector("#formulario");
const aviso = document.querySelector("#aviso");
const errorRegistro = document.querySelector("#error-registro");
const listado = document.querySelector("#listado");
const contador = document.querySelector("#contador");
const mensajeListado = document.querySelector("#mensaje-listado");
const plantilla = document.querySelector("#plantilla-incidencia");

function leerIncidencias() {
    const incidencias = [];
    for (let indice = 0; indice < localStorage.length; indice += 1) {
        const clave = localStorage.key(indice);
        if (clave?.startsWith(prefijo)) {
            const incidencia = JSON.parse(localStorage.getItem(clave));
            if (incidencia) {
                incidencias.push(incidencia);
            }
        }
    }

    return incidencias.sort((primera, segunda) =>
        segunda.fecha.localeCompare(primera.fecha)
    );
}

function crearTarjeta(incidencia) {
    const tarjeta = plantilla.content.cloneNode(true);
    tarjeta.querySelector(".codigo").textContent =
        "INC-" + incidencia.id.slice(0, 8).toUpperCase();
    tarjeta.querySelector(".estado").textContent = incidencia.estado;
    tarjeta.querySelector("h3").textContent = incidencia.titulo;
    tarjeta.querySelector(".descripcion").textContent = incidencia.descripcion;

    const fecha = tarjeta.querySelector("time");
    fecha.dateTime = incidencia.fecha;
    fecha.textContent = formatoFecha.format(new Date(incidencia.fecha));
    return tarjeta;
}

function mostrarIncidencias() {
    try {
        const incidencias = leerIncidencias();
        listado.replaceChildren(...incidencias.map(crearTarjeta));
        contador.textContent = incidencias.length === 1 ? "1 reporte" : incidencias.length + " reportes";
        mensajeListado.textContent = incidencias.length ? "" : "Aún no hay incidencias registradas.";
    } catch {
        contador.textContent = "";
        mensajeListado.textContent = "No se pudo leer el almacenamiento del navegador.";
    }
}

document.querySelector("#abrir-registro").addEventListener("click", () => {
    aviso.textContent = "";
    modal.showModal();
});

document.querySelector("#cancelar").addEventListener("click", () => modal.close());

modal.addEventListener("close", () => {
    formulario.reset();
    errorRegistro.textContent = "";
});

formulario.addEventListener("input", () => {
    errorRegistro.textContent = "";
});

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const titulo = formulario.elements.titulo.value.trim();
    const descripcion = formulario.elements.descripcion.value.trim();

    if (!titulo || !descripcion) {
        errorRegistro.textContent = "Escribe un título y una descripción.";
        formulario.elements[titulo ? "descripcion" : "titulo"].focus();
        return;
    }

    try {
        const id = crypto.randomUUID();
        const incidencia = {
            id,
            titulo,
            descripcion,
            estado: "Abierta",
            fecha: new Date().toISOString(),
        };
        localStorage.setItem(prefijo + id, JSON.stringify(incidencia));
    } catch {
        errorRegistro.textContent = "No se pudo guardar la incidencia en este navegador.";
        return;
    }

    modal.close();
    mostrarIncidencias();
    aviso.textContent = "Incidencia registrada correctamente.";
});

window.addEventListener("storage", (evento) => {
    if (evento.key === null || evento.key.startsWith(prefijo)) {
        mostrarIncidencias();
    }
});

mostrarIncidencias();
