
const formulario = document.getElementById("loginForm");
const correo = document.getElementById("correo");
const password = document.getElementById("password");
const mensaje = document.getElementById("mensaje");

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const email = correo.value.trim();
    const clave = password.value;

    if (!email || !clave) {
        mensaje.textContent = "Completa todos los campos.";
        return;
    }

    mensaje.textContent = "Conectando con el servidor...";

    try {
        const respuesta = await fetch(
            "http://localhost:3000/api/prueba",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    correo: email
                })
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje);
        }

        mensaje.textContent = datos.mensaje;

    } catch (error) {
        console.error("Error de conexión:", error);
        mensaje.textContent =
            "No fue posible comunicarse con el servidor.";
    }
});
