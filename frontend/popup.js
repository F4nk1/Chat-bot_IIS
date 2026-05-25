const sendBtn = document.getElementById("sendBtn");

const responseDiv = document.getElementById("response");

sendBtn.addEventListener("click", async () => {

    const message = document
        .getElementById("message")
        .value;

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );

        const data = await response.json();

        responseDiv.innerHTML = `
            <strong>Respuesta:</strong><br>
            ${data.answer}
            <br><br>
            <strong>Confianza:</strong>
            ${data.confidence}
        `;

    } catch (error) {

        responseDiv.innerHTML =
            "Error conectando con el servidor";

        console.error(error);
    }

});