const botonEnviar = document.getElementById("boton_enviar");
const mensajeInput = document.getElementById("mensaje_input");
const mensajesContenedor = document.getElementById("chatbot-mensajes");
const micBtn = document.getElementById("chatbot-mic");

const URL_API = "http://127.0.0.1:8000";
let id_conversacion_activa = null;

botonEnviar.addEventListener("click", enviarConsulta);
mensajeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        enviarConsulta();
    }
});

// Lógica de Reconocimiento de Voz (Micrófono)
let isListening = false;
let recognition = null;

micBtn.addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Tu navegador no soporta reconocimiento de voz. Recomendamos Google Chrome.");
        return;
    }
    
    if (isListening) {
        if (recognition) recognition.stop();
        setListeningState(false);
        return;
    }
    
    recognition = new SpeechRecognition();
    recognition.lang = 'es-PE';
    
    recognition.onstart = () => {
        setListeningState(true);
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        mensajeInput.value = (mensajeInput.value + " " + transcript).trim();
        enviarConsulta(); // Automatically submit!
    };
    
    recognition.onerror = () => {
        setListeningState(false);
    };
    
    recognition.onend = () => {
        setListeningState(false);
    };
    
    recognition.start();
});

function setListeningState(listening) {
    isListening = listening;
    if (listening) {
        micBtn.classList.add("listening");
        micBtn.style.backgroundColor = "#fee2e2";
        micBtn.style.color = "#dc2626";
    } else {
        micBtn.classList.remove("listening");
        micBtn.style.backgroundColor = "";
        micBtn.style.color = "";
    }
}

// Obtener hora actual formateada
function formatTime() {
    const d = new Date();
    return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Agregar mensaje a la interfaz
function agregarMensaje(rol, texto, mensajeId = null, metadataHtml = '') {
    const div = document.createElement("div");
    const esBot = rol === 'bot';
    div.className = `mensaje-wrapper ${esBot ? 'bot' : 'user'}`;
    
    if (esBot) {
        div.innerHTML = `
            <div class="mensaje-container">
                <img src="../assets/DinoBot02.png" class="mensaje-avatar" alt="DinoBot" />
                <div class="mensaje-bubble">
                    <div class="mensaje-texto">${texto}</div>
                    ${metadataHtml ? `<div class="mensaje-metadata" style="opacity: 0.7; font-size: 10px; display: block; margin-top: 4px;">${metadataHtml}</div>` : ''}
                    <span class="mensaje-timestamp">${formatTime()}</span>
                </div>
            </div>
            <div class="mensaje-acciones" data-msg-id="${mensajeId || ''}">
                <button class="action-btn btn-audio" title="Escuchar respuesta">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                </button>
                <span class="action-divider"></span>
                <button class="action-btn btn-like" title="Es útil">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                </button>
                <button class="action-btn btn-dislike" title="No es útil">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
                    </svg>
                </button>
            </div>
        `;
    } else {
        div.innerHTML = `
            <div class="mensaje-container">
                <div class="mensaje-bubble">
                    <div class="mensaje-texto">${texto}</div>
                    <span class="mensaje-timestamp">${formatTime()}</span>
                </div>
            </div>
        `;
    }
    mensajesContenedor.appendChild(div);
    mensajesContenedor.scrollTop = mensajesContenedor.scrollHeight;
}

// Delegación de eventos para botones de acción (Audio y Valoración)
let audioActual = null;
let botonAudioActual = null;

mensajesContenedor.addEventListener("click", async (e) => {
    const audioBtn = e.target.closest(".btn-audio");
    if (audioBtn) {
        const textElement = audioBtn.closest(".mensaje-wrapper").querySelector(".mensaje-texto");
        const texto = textElement.textContent || textElement.innerText;
        
        if (audioActual && botonAudioActual === audioBtn) {
            audioActual.pause();
            audioActual = null;
            audioBtn.classList.remove("playing");
            botonAudioActual = null;
            return;
        }
        
        if (audioActual) {
            audioActual.pause();
            if (botonAudioActual) botonAudioActual.classList.remove("playing");
        }
        
        audioBtn.classList.add("playing");
        botonAudioActual = audioBtn;

        try {
            const res = await fetch(`${URL_API}/tts/generar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ texto: texto })
            });
            if (res.status === 503) {
                alert("El servicio de voz no está configurado en el servidor.");
                audioBtn.classList.remove("playing");
                return;
            }
            const data = await res.json();
            if (data.url) {
                audioActual = new Audio(`${URL_API}${data.url}`);
                audioActual.play().catch(err => {
                    console.error("Error al reproducir audio:", err);
                    audioBtn.classList.remove("playing");
                });
                audioActual.onended = () => {
                    audioBtn.classList.remove("playing");
                    audioActual = null;
                    botonAudioActual = null;
                };
            }
        } catch (err) {
            console.error("Error TTS:", err);
            audioBtn.classList.remove("playing");
        }
        return;
    }

    // Botones de valoración
    const likeBtn = e.target.closest(".btn-like");
    const dislikeBtn = e.target.closest(".btn-dislike");
    if (likeBtn || dislikeBtn) {
        const btn = likeBtn || dislikeBtn;
        const accionesDiv = btn.closest(".mensaje-acciones");
        const msgId = accionesDiv.getAttribute("data-msg-id");
        if (!msgId) {
            alert("No se puede valorar esta respuesta porque no tiene un ID asociado.");
            return;
        }
        const valor = likeBtn ? 1 : -1;
        try {
            const res = await fetch(`${URL_API}/feedback/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mensaje_id: parseInt(msgId), puntuacion: valor })
            });
            if (res.ok) {
                accionesDiv.innerHTML = '<span class="feedback-gracias">¡Gracias por tu valoración!</span>';
            }
        } catch (err) {
            console.error("Error feedback:", err);
        }
        return;
    }
});

// Envío de consulta al backend
async function enviarConsulta() {
    const mensaje = mensajeInput.value.trim();
    if (!mensaje) return;

    // 1. Crear conversación si no hay una activa
    if (!id_conversacion_activa) {
        try {
            const resConv = await fetch(`${URL_API}/conversaciones/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo: mensaje.substring(0, 30) + (mensaje.length > 30 ? '...' : '') })
            });
            if (resConv.ok) {
                const conv = await resConv.json();
                id_conversacion_activa = conv.id;
            }
        } catch (err) {
            console.error("Error al crear conversación:", err);
        }
    }

    agregarMensaje('user', mensaje);
    mensajeInput.value = "";

    // Guardar mensaje de usuario en base de datos si hay conversación activa
    if (id_conversacion_activa) {
        try {
            await fetch(`${URL_API}/conversaciones/${id_conversacion_activa}/mensajes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversacion_id: id_conversacion_activa,
                    rol: 'usuario',
                    contenido: mensaje
                })
            });
        } catch (err) {
            console.error("Error al guardar mensaje usuario:", err);
        }
    }

    // Indicador visual de procesamiento
    const divCargando = document.createElement("div");
    divCargando.className = "mensaje-wrapper bot typing-indicator-msg";
    divCargando.innerHTML = `
        <div class="mensaje-container">
            <img src="../assets/DinoBot02.png" class="mensaje-avatar" alt="DinoBot" />
            <div class="mensaje-bubble typing-bubble">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
    `;
    mensajesContenedor.appendChild(divCargando);
    mensajesContenedor.scrollTop = mensajesContenedor.scrollHeight;

    try {
        const respuestaServidor = await fetch(
            `${URL_API}/chat`,
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

        divCargando.remove();

        if (!respuestaServidor.ok) {
            throw new Error("Error en respuesta de red");
        }

        const datos = await respuestaServidor.json();
        const textoRespuesta = datos.respuesta;
        const categoria = datos.categoria || 'General';

        let idMensajeBot = null;
        // Guardar mensaje del asistente en base de datos para obtener un ID real
        if (id_conversacion_activa) {
            try {
                const resBotMsg = await fetch(`${URL_API}/conversaciones/${id_conversacion_activa}/mensajes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        conversacion_id: id_conversacion_activa,
                        rol: 'asistente',
                        contenido: textoRespuesta,
                        intencion: categoria
                    })
                });
                if (resBotMsg.ok) {
                    const msgGuardado = await resBotMsg.json();
                    idMensajeBot = msgGuardado.id;
                }
            } catch (err) {
                console.error("Error al guardar mensaje bot:", err);
            }
        }

        const metadataHtml = `Categoría: ${categoria} (${(datos.confianza * 100).toFixed(1)}%)`;
        agregarMensaje('bot', textoRespuesta, idMensajeBot, metadataHtml);

    } catch (error) {
        divCargando.remove();
        agregarMensaje('bot', "Error al conectar con el asistente académico.");
        console.error("Error:", error);
    }
}
