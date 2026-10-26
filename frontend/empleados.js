
const formulario = document.getElementById("empleadoForm");
const mensaje = document.getElementById("mensaje");
const listaEmpleados = document.getElementById("listaEmpleados");
const btnConsultar = document.getElementById("btnConsultar");

const API = "http://localhost:3000/api/empleados";

// Registrar un empleado
formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const empleado = {
        nombre: document.getElementById("nombre").value.trim(),
        documento: document.getElementById("documento").value.trim(),
        cargo: document.getElementById("cargo").value.trim()
    };

    if (!empleado.nombre || !empleado.documento || !empleado.cargo) {
        mensaje.textContent = "Completa todos los campos.";
        return;
    }

    mensaje.textContent = "Registrando empleado...";

    try {
        const respuesta = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(empleado)
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || "No se pudo registrar.");
        }

        mensaje.textContent = datos.mensaje;
        formulario.reset();

        await consultarEmpleados();

    } catch (error) {
        console.error("Error al registrar:", error);
        mensaje.textContent =
            error.message || "No fue posible conectar con el servidor.";
    }
});

// Consultar empleados desde MongoDB a través del backend
async function consultarEmpleados() {
    listaEmpleados.replaceChildren();
    mensaje.textContent = "Consultando empleados...";

    try {
        const respuesta = await fetch(API);

        if (!respuesta.ok) {
            throw new Error("No fue posible consultar los empleados.");
        }

        const empleados = await respuesta.json();

        if (empleados.length === 0) {
            mensaje.textContent = "Todavía no hay empleados registrados.";
            return;
        }

        empleados.forEach(function (empleado) {
            const elemento = document.createElement("li");

            elemento.textContent =
                `${empleado.nombre} | Documento: ${empleado.documento} | Cargo: ${empleado.cargo}`;

            listaEmpleados.appendChild(elemento);
        });

        mensaje.textContent =
            `Consulta completada. Total de empleados: ${empleados.length}`;

    } catch (error) {
        console.error("Error al consultar:", error);
        mensaje.textContent =
            "Error al consultar. Verifica que el servidor esté funcionando.";
    }
}

// Consultar al pulsar el botón
btnConsultar.addEventListener("click", consultarEmpleados);

// Mostrar los empleados al abrir la página
consultarEmpleados();
