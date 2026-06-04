/* Componente de ejemplo para mensajes del chatbot */
export function crearComponenteMensaje(rol, contenido) {
    const plantilla = `
        <div class="message ${rol}">
            <div class="msg-avatar">
                <i class="fas fa-${rol === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="msg-content">${contenido}</div>
        </div>
    `;
    return plantilla;
}
