const boton = document.createElement("div");

boton.id = "chatbot-boton";

boton.innerHTML = "💬";

document.body.appendChild(boton);


const ventana = document.createElement("div");

ventana.id = "chatbot-ventana";

ventana.innerHTML = `
    <div id="chatbot-header">
        Chatbot IIS
    </div>

    <div id="chatbot-mensajes"></div>

    <div id="chatbot-input-area">
        <input
            type="text"
            id="chatbot-input"
            placeholder="Escribe tu duda..."
        />

        <button id="chatbot-enviar">
            Enviar
        </button>
    </div>
`;

document.body.appendChild(ventana);


boton.addEventListener("click", () => {

    ventana.classList.toggle("abierto");

});


const input = document.getElementById("chatbot-input");

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        enviarMensaje();
    }
});

document
    .getElementById("chatbot-enviar")
    .addEventListener("click", enviarMensaje);

async function enviarMensaje() {
    const mensaje = input.value;

    if (!mensaje) return;

    agregarMensaje("Tú", mensaje);

    input.value = "";

    try {
        const respuesta = await fetch(
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

        const datos = await respuesta.json();

        agregarMensaje(
            "Bot",
            `${datos.respuesta}<br><small><i>Categoría: ${datos.categoria} (${(datos.confianza * 100).toFixed(1)}%)</i></small>`
        );

    } catch (error) {
        agregarMensaje(
            "Bot",
            "Error conectando con el servidor"
        );
    }
}


function agregarMensaje(usuario, texto) {

    const mensajes = document.getElementById(
        "chatbot-mensajes"
    );

    const div = document.createElement("div");

    div.className = "mensaje";

    div.innerHTML = `
        <strong>${usuario}:</strong>
        ${texto}
    `;

    mensajes.appendChild(div);

    mensajes.scrollTop = mensajes.scrollHeight;
}