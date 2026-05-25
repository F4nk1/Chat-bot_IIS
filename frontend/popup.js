const botonEnviar = document.getElementById("boton_enviar");
const respuestaDiv = document.getElementById("contenedor_respuesta");

botonEnviar.addEventListener("click", async () => {
    const mensajeInput = document.getElementById("mensaje_input");
    const mensaje = mensajeInput.value;

    if (!mensaje) return;

    respuestaDiv.innerHTML = "<em>Procesando su consulta...</em>";

    try {
        const respuestaServidor = await fetch(
            "http://127.0.0.1:8000/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mensaje: mensaje
                })
            }
        );

        const datos = await respuestaServidor.json();

        respuestaDiv.innerHTML = `
            <div class="resultado">
                <strong>Respuesta:</strong><br>
                <p>${datos.respuesta}</p>
                <br>
                <small>
                    <strong>Categoría:</strong> ${datos.categoria} | 
                    <strong>Confianza:</strong> ${(datos.confianza * 100).toFixed(2)}%
                </small>
            </div>
        `;

    } catch (error) {
        respuestaDiv.innerHTML = "Error al conectar con el asistente acad&eacute;mico.";
        console.error("Error:", error);
    }
});
