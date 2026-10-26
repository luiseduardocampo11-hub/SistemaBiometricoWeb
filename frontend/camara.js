
const video = document.getElementById("video");
const estado = document.getElementById("estado");
const botonActivar = document.getElementById("activar");
const botonDetener = document.getElementById("detener");

let flujoCamara = null;

botonActivar.addEventListener("click", async () => {
    try {
        if (!navigator.mediaDevices?.getUserMedia) {
            throw new Error(
                "El navegador no permite acceder a la cámara en esta dirección. Usa localhost o HTTPS."
            );
        }

        estado.textContent = "Solicitando permiso para usar la cámara...";

        flujoCamara = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user"
            },
            audio: false
        });

        video.srcObject = flujoCamara;
        await video.play();

        estado.textContent = "Cámara activada correctamente.";
    } catch (error) {
        console.error("Error de cámara:", error);

        if (error.name === "NotAllowedError") {
            estado.textContent =
                "Permiso denegado. Autoriza la cámara en el navegador.";
        } else if (error.name === "NotFoundError") {
            estado.textContent =
                "No se encontró una cámara disponible.";
        } else {
            estado.textContent =
                "No se pudo activar la cámara: " + error.message;
        }
    }
});

botonDetener.addEventListener("click", () => {
    if (flujoCamara) {
        flujoCamara.getTracks().forEach((pista) => pista.stop());
        flujoCamara = null;
    }

    video.srcObject = null;
    estado.textContent = "Cámara detenida.";
});
