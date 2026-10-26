
const totalEmpleados = document.getElementById("totalEmpleados");
const mensaje = document.getElementById("mensaje");

async function cargarResumen() {
    try {
        const respuesta = await fetch(
            "http://localhost:3000/api/empleados"
        );

        if (!respuesta.ok) {
            throw new Error("Error al consultar los empleados");
        }

        const empleados = await respuesta.json();

        totalEmpleados.textContent = empleados.length;
        mensaje.textContent = "Información actualizada correctamente.";

    } catch (error) {
        console.error(error);
        totalEmpleados.textContent = "—";
        mensaje.textContent =
            "No se pudo cargar el resumen. Verifica el servidor.";
    }
}

cargarResumen();
