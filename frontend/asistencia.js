
const API_EMPLEADOS = "http://localhost:3000/api/empleados";
const API_ASISTENCIAS = "http://localhost:3000/api/asistencias";

const formulario = document.getElementById("asistenciaForm");
const selectorEmpleado = document.getElementById("empleado");
const selectorTipo = document.getElementById("tipo");
const mensaje = document.getElementById("mensaje");
const historial = document.getElementById("historial");
const btnActualizar = document.getElementById("btnActualizar");

async function cargarEmpleados() {
    try {
        const respuesta = await fetch(API_EMPLEADOS);

        if (!respuesta.ok) {
            throw new Error("No se pudieron consultar los empleados");
        }

        const empleados = await respuesta.json();

        selectorEmpleado.replaceChildren();

        const inicial = document.createElement("option");
        inicial.value = "";
        inicial.textContent = "Selecciona un empleado";
        selectorEmpleado.appendChild(inicial);

        empleados.forEach((empleado) => {
            const opcion = document.createElement("option");
            opcion.value = empleado.documento;
            opcion.textContent =
                `${empleado.nombre} — ${empleado.documento}`;

            selectorEmpleado.appendChild(opcion);
        });

        if (empleados.length === 0) {
            mensaje.textContent = "Primero registra un empleado.";
        }
    } catch (error) {
        console.error(error);
        mensaje.textContent = "Error al cargar los empleados.";
    }
}

async function consultarHistorial() {
    try {
        const respuesta = await fetch(API_ASISTENCIAS);

        if (!respuesta.ok) {
            throw new Error("No se pudo consultar el historial");
        }

        const registros = await respuesta.json();
        historial.replaceChildren();

        if (registros.length === 0) {
            const item = document.createElement("li");
            item.textContent = "Todavía no hay asistencias registradas.";
            historial.appendChild(item);
            return;
        }

        registros.forEach((registro) => {
            const item = document.createElement("li");
            const fecha = new Date(registro.fechaHora);

            item.textContent =
                `${registro.nombre} | ${registro.documento} | ` +
                `${registro.tipo} | ${fecha.toLocaleString("es-CO")}`;

            historial.appendChild(item);
        });
    } catch (error) {
        console.error(error);
        mensaje.textContent = "Error al consultar las asistencias.";
    }
}

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const documento = selectorEmpleado.value;
    const tipo = selectorTipo.value;

    if (!documento) {
        mensaje.textContent = "Selecciona un empleado.";
        return;
    }

    mensaje.textContent = "Registrando asistencia...";

    try {
        const respuesta = await fetch(API_ASISTENCIAS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ documento, tipo })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || "Error al registrar");
        }

        mensaje.textContent = datos.mensaje;

        await consultarHistorial();
    } catch (error) {
        console.error(error);
        mensaje.textContent = error.message;
    }
});

btnActualizar.addEventListener("click", consultarHistorial);

cargarEmpleados();
consultarHistorial();
