const prefijo = "registro-incidencias:";
const estadoInicial = "Abierta";
const estados = [estadoInicial, "En proceso", "Resuelta"];
let incidenciasBase = [];
let avisoBase = "";
let incidenciaArrastrada = null;
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
const plantillaColumna = document.querySelector("#plantilla-columna");

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

    return incidencias;
}

function guardarIncidencia(incidencia) {
    localStorage.setItem(prefijo + incidencia.id, JSON.stringify(incidencia));
}

function resaltarDestino(columna) {
    const anterior = listado.querySelector(".columna-destino");
    if (anterior !== columna) {
        anterior?.classList.remove("columna-destino");
        columna?.classList.add("columna-destino");
    }
}

function limpiarArrastre() {
    incidenciaArrastrada = null;
    listado.querySelector(".arrastrando")?.classList.remove("arrastrando");
    resaltarDestino(null);
}

function obtenerDestino(evento) {
    if (!incidenciaArrastrada) {
        return null;
    }

    const columna = evento.target.closest(".columna");
    return columna && listado.contains(columna) && columna.dataset.estado !== incidenciaArrastrada.estado
        ? columna
        : null;
}

function crearTarjeta(incidencia) {
    const tarjeta = plantilla.content.cloneNode(true);
    const articulo = tarjeta.querySelector(".tarjeta");

    articulo.addEventListener("dragstart", (evento) => {
        incidenciaArrastrada = incidencia;
        articulo.classList.add("arrastrando");
        evento.dataTransfer.effectAllowed = "move";
        evento.dataTransfer.setData("text/plain", incidencia.id);
    });
    articulo.addEventListener("dragend", limpiarArrastre);

    tarjeta.querySelector(".codigo").textContent =
        "INC-" + incidencia.id.slice(0, 8).toUpperCase();
    tarjeta.querySelector(".estado").textContent = incidencia.estado;
    tarjeta.querySelector("h4").textContent = incidencia.titulo;
    tarjeta.querySelector(".descripcion").textContent = incidencia.descripcion;

    const fecha = tarjeta.querySelector("time");
    fecha.dateTime = incidencia.fecha;
    fecha.textContent = formatoFecha.format(new Date(incidencia.fecha));
    return tarjeta;
}

function crearColumna(estado, incidencias) {
    const contenido = plantillaColumna.content.cloneNode(true);
    const columna = contenido.querySelector(".columna");
    columna.dataset.estado = estado;
    columna.id = "estado-" + estado.toLowerCase().replace(" ", "-");
    columna.setAttribute("aria-label", estado);
    columna.querySelector(".nombre-estado").textContent = estado;
    columna.querySelector(".contador").textContent = incidencias.length;

    const tarjetas = columna.querySelector(".tarjetas");
    if (incidencias.length) {
        tarjetas.append(...incidencias.map(crearTarjeta));
    } else {
        const vacio = document.createElement("p");
        vacio.className = "columna-vacia";
        vacio.textContent = "Sin incidencias en este estado.";
        tarjetas.append(vacio);
    }

    return contenido;
}

function mostrarIncidencias() {
    limpiarArrastre();
    const porId = new Map(incidenciasBase.map((incidencia) => [incidencia.id, incidencia]));
    const avisos = [avisoBase];
    try {
        for (const incidencia of leerIncidencias()) {
            porId.set(incidencia.id, incidencia);
        }
    } catch {
        avisos.push("No se pudo leer el almacenamiento del navegador.");
    }

    const grupos = new Map(estados.map((estado) => [estado, []]));
    const incidencias = [...porId.values()].sort((primera, segunda) =>
        segunda.fecha.localeCompare(primera.fecha)
    );
    for (const incidencia of incidencias) {
        const grupo = grupos.get(incidencia.estado) ?? grupos.get(estadoInicial);
        grupo.push(incidencia);
    }

    listado.replaceChildren(...estados.map((estado) => crearColumna(estado, grupos.get(estado))));
    contador.textContent = incidencias.length === 1 ? "1 reporte" : incidencias.length + " reportes";
    mensajeListado.textContent = avisos.filter(Boolean).join(" ");
}

async function cargarBase() {
    if (location.protocol === "file:") {
        avisoBase = "Abre la aplicación con un servidor local para cargar las incidencias del archivo JSON.";
    } else {
        try {
            const respuesta = await fetch("data/incidencias.json");
            if (!respuesta.ok) {
                throw new Error("No se pudo cargar el archivo JSON.");
            }
            const datos = await respuesta.json();
            if (!Array.isArray(datos)) {
                throw new Error("El archivo JSON debe contener una lista de incidencias.");
            }
            incidenciasBase = datos;
        } catch {
            avisoBase = "No se pudieron cargar las incidencias iniciales del archivo JSON.";
        }
    }

    mostrarIncidencias();
}

document.addEventListener("dragover", (evento) => {
    const columna = obtenerDestino(evento);
    resaltarDestino(columna);
    if (columna) {
        evento.preventDefault();
        evento.dataTransfer.dropEffect = "move";
    }
});

listado.addEventListener("drop", (evento) => {
    const columna = obtenerDestino(evento);
    if (!columna) {
        return;
    }

    evento.preventDefault();
    const estado = columna.dataset.estado;
    const incidencia = { ...incidenciaArrastrada, estado };
    limpiarArrastre();

    try {
        guardarIncidencia(incidencia);
    } catch {
        aviso.setAttribute("data-error", "");
        aviso.textContent = "No se pudo guardar el cambio de estado.";
        return;
    }

    mostrarIncidencias();
    aviso.removeAttribute("data-error");
    aviso.textContent = `La incidencia pasó a ${estado}.`;
});

document.querySelector("#abrir-registro").addEventListener("click", () => {
    aviso.removeAttribute("data-error");
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
        guardarIncidencia({
            id: crypto.randomUUID(),
            titulo,
            descripcion,
            estado: estadoInicial,
            fecha: new Date().toISOString(),
        });
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

cargarBase();
