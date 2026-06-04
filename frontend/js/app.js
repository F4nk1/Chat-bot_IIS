console.log("APLICACION CARGADA", new Date().toISOString());

window.addEventListener('beforeunload', () => {
    console.log("LA PAGINA SE ESTA RECARGANDO");
});

window.onerror = function(mensaje_error, url, linea, columna, error) {
    console.error("ERROR GLOBAL:", mensaje_error);
    return false;
};


document.addEventListener('DOMContentLoaded', () => {
    const entrada_chat = document.getElementById('chat-input');
    const boton_enviar = document.getElementById('send-btn');
    const contenedor_mensajes = document.getElementById('messages-container');
    const pantalla_bienvenida = document.getElementById('welcome-screen');
    const barra_lateral = document.getElementById('sidebar');
    const alternar_menu = document.getElementById('menu-toggle');
    const boton_nuevo_chat = document.getElementById('new-chat-btn');
    const lista_historial = document.getElementById('history-list');

    const URL_API = 'http://127.0.0.1:8000';
    let id_conversacion_activa = null;

    // --- Funciones Nucleo ---

    async function cargar_conversaciones() {
        try {
            const respuesta = await fetch(`${URL_API}/conversaciones/`);
            const conversaciones = await respuesta.json();
            lista_historial.innerHTML = '';
            conversaciones.forEach(conv => {
                agregar_al_historial_interfaz(conv.titulo, conv.id);
            });
        } catch (error) {
            console.error('Error al cargar conversaciones:', error);
        }
    }

    async function cargar_detalle_conversacion(id) {
        try {
            const respuesta = await fetch(`${URL_API}/conversaciones/${id}`);
            const datos = await respuesta.json();
            
            id_conversacion_activa = id;
            pantalla_bienvenida.style.display = 'none';
            contenedor_mensajes.innerHTML = '';
            
            datos.mensajes.forEach(msg => {
                agregar_mensaje_a_interfaz(msg.rol === 'usuario' ? 'user' : 'bot', msg.contenido);
            });
            
            if (window.innerWidth <= 768) {
                barra_lateral.classList.remove('active');
            }
        } catch (error) {
            console.error('Error al cargar detalle de conversacion:', error);
        }
    }

    async function enviar_mensaje() {
        const texto = entrada_chat.value.trim();
        if (!texto) return;

        // 1. Crear conversacion si no hay una activa
        if (!id_conversacion_activa) {
            try {
                const respuesta_conv = await fetch(`${URL_API}/conversaciones/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ titulo: texto.substring(0, 30) + (texto.length > 30 ? '...' : '') })
                });
                const nueva_conv = await respuesta_conv.json();
                id_conversacion_activa = nueva_conv.id;
                cargar_conversaciones(); // Refrescar barra lateral
            } catch (error) {
                console.error('Error al crear conversacion:', error);
                return;
            }
        }

        if (pantalla_bienvenida) pantalla_bienvenida.style.display = 'none';

        // 2. UI: Agregar mensaje de usuario
        agregar_mensaje_a_interfaz('user', texto);
        entrada_chat.value = '';
        entrada_chat.style.height = 'auto';

        // 3. Guardar mensaje de usuario en BD
        await guardar_mensaje_en_bd(id_conversacion_activa, 'usuario', texto);

        // 4. UI: Agregar marcador para respuesta del bot
        const div_mensaje_bot = agregar_mensaje_a_interfaz('bot', '');
        const div_contenido = div_mensaje_bot.querySelector('.msg-content');
        
        try {
            // 5. Obtener respuesta en streaming
            const respuesta = await fetch(`${URL_API}/chat/stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mensaje: texto })
            });

            if (!respuesta.ok) {
                throw new Error(`HTTP ${respuesta.status}`);
            }

            if (!respuesta.body) {
                throw new Error("respuesta.body es nulo");
            }

            const lector = respuesta.body.getReader();
            const decodificador = new TextDecoder();
            let texto_completo = '';
            let acumulador = '';

            // Efecto visual de escritura (cursor parpadeante)
            div_contenido.classList.add('typing-cursor');

            while (true) {
                const { value, done } = await lector.read();
                if (done) break;

                // Concatenar el nuevo fragmento al acumulador
                acumulador += decodificador.decode(value, { stream: true });
                
                const lineas = acumulador.split('\n');
                // Mantener la ultima linea incompleta en el acumulador
                acumulador = lineas.pop();

                for (const linea of lineas) {
                    if (linea.trim().startsWith('data: ')) {
                        try {
                            const cadena_json = linea.trim().substring(6);
                            const datos = JSON.parse(cadena_json);
                            texto_completo += datos.chunk;
                            div_contenido.textContent = texto_completo;
                            
                            // Scroll suave hacia abajo
                            contenedor_mensajes.scrollTo({
                                top: contenedor_mensajes.scrollHeight,
                                behavior: 'smooth'
                            });
                        } catch (e) {
                            console.error('Error al parsear fragmento SSE:', e);
                        }
                    }
                }
            }
            
            div_contenido.classList.remove('typing-cursor');
            
            // 6. Guardar respuesta del bot en BD
            await guardar_mensaje_en_bd(id_conversacion_activa, 'asistente', texto_completo);

        } catch (error) {
            console.error('Error:', error);
            div_contenido.textContent = 'Error al conectar con el servidor.';
        }
    }

    async function guardar_mensaje_en_bd(id_conv, rol, contenido) {
        try {
            await fetch(`${URL_API}/conversaciones/${id_conv}/mensajes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversacion_id: id_conv,
                    rol: rol,
                    contenido: contenido
                })
            });
        } catch (error) {
            console.error('Error al guardar mensaje:', error);
        }
    }

    // --- Ayudantes de UI ---

    function agregar_mensaje_a_interfaz(rol, contenido) {
        const div_mensaje = document.createElement('div');
        div_mensaje.className = `message ${rol}`;
        
        const div_avatar = document.createElement('div');
        div_avatar.className = 'msg-avatar';
        div_avatar.innerHTML = rol === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const div_contenido = document.createElement('div');
        div_contenido.className = 'msg-content';
        div_contenido.textContent = contenido;
        
        div_mensaje.appendChild(div_avatar);
        div_mensaje.appendChild(div_contenido);
        contenedor_mensajes.appendChild(div_mensaje);
        
        contenedor_mensajes.scrollTop = contenedor_mensajes.scrollHeight;
        return div_mensaje;
    }

    function agregar_al_historial_interfaz(titulo, id) {
        const elemento_li = document.createElement('li');
        elemento_li.textContent = titulo;
        elemento_li.dataset.id = id;
        elemento_li.addEventListener('click', () => cargar_detalle_conversacion(id));
        lista_historial.appendChild(elemento_li);
    }

    const formulario_chat = document.getElementById('chat-form');

    // --- Escuchadores de Eventos ---

    entrada_chat.addEventListener('input', () => {
        entrada_chat.style.height = 'auto';
        entrada_chat.style.height = (entrada_chat.scrollHeight) + 'px';
    });

    alternar_menu.addEventListener('click', (evento) => {
        evento.preventDefault();
        barra_lateral.classList.toggle('active');
    });

    // Manejar clics en las tarjetas de sugerencia
    function activar_escuchadores_sugerencias() {
        document.querySelectorAll('.suggestion-card').forEach(tarjeta => {
            tarjeta.addEventListener('click', (evento) => {
                evento.preventDefault();
                entrada_chat.value = tarjeta.textContent;
                enviar_mensaje();
            });
        });
    }

    activar_escuchadores_sugerencias();

    formulario_chat.addEventListener('submit', (evento) => {
        evento.preventDefault();
        enviar_mensaje();
    });
    
    entrada_chat.addEventListener('keydown', (evento) => {
        if (evento.key === 'Enter' && !evento.shiftKey) {
            evento.preventDefault();
            enviar_mensaje();
        }
    });

    boton_nuevo_chat.addEventListener('click', () => {
        id_conversacion_activa = null;
        contenedor_mensajes.innerHTML = '';
        pantalla_bienvenida.style.display = 'flex';
        contenedor_mensajes.appendChild(pantalla_bienvenida);
        if (window.innerWidth <= 768) {
            barra_lateral.classList.remove('active');
        }
    });

    // Carga Inicial
    cargar_conversaciones();
});
