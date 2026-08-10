const host = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
const URL_BASE = import.meta.env.VITE_API_URL || `http://${host}:8001`;

export const api = {
  // Obtener todas las conversaciones
  async getConversaciones() {
    const res = await fetch(`${URL_BASE}/conversaciones/`);
    if (!res.ok) throw new Error('Error al obtener conversaciones');
    return res.json();
  },

  // Obtener el detalle de una conversación (historial de mensajes)
  async getDetalleConversacion(id) {
    const res = await fetch(`${URL_BASE}/conversaciones/${id}`);
    if (!res.ok) throw new Error('Error al obtener detalle de conversación');
    return res.json();
  },

  // Eliminar una conversación
  async eliminarConversacion(id) {
    const res = await fetch(`${URL_BASE}/conversaciones/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar conversación');
    return res.json();
  },

  // Crear una nueva conversación
  async crearConversacion(titulo) {
    const res = await fetch(`${URL_BASE}/conversaciones/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo })
    });
    if (!res.ok) throw new Error('Error al crear conversación');
    return res.json();
  },

  // Guardar un mensaje en la base de datos
  async guardarMensaje(idConv, rol, contenido, intencion = null) {
    const res = await fetch(`${URL_BASE}/conversaciones/${idConv}/mensajes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversacion_id: idConv,
        rol,
        contenido,
        intencion
      })
    });
    if (!res.ok) throw new Error('Error al guardar mensaje');
    return res.json();
  },

  // Enviar valoración de un mensaje (feedback positivo/negativo)
  async enviarFeedback(mensajeId, puntuacion) {
    const res = await fetch(`${URL_BASE}/feedback/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mensaje_id: mensajeId,
        puntuacion
      })
    });
    if (!res.ok) throw new Error('Error al enviar valoración');
    return res.json();
  },

  // Generar audio por síntesis de voz (TTS) para una respuesta
  async generarAudio(texto) {
    const res = await fetch(`${URL_BASE}/tts/generar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto })
    });
    if (res.status === 503) {
      throw new Error('El servicio de voz no está configurado en el servidor.');
    }
    if (!res.ok) throw new Error('Error al generar audio');
    return res.json(); // Devuelve { url: '/static/audio/...' }
  },

  // Obtener la URL completa del recurso de audio
  getAudioUrl(path) {
    return `${URL_BASE}${path}`;
  },

  // Consumir la respuesta en streaming mediante SSE (Server-Sent Events)
  async streamChat(mensaje, historial, onChunk, onDone, onError) {
    try {
      const res = await fetch(`${URL_BASE}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje, historial })
      });

      if (!res.ok) {
        throw new Error(`Error HTTP del servidor: ${res.status}`);
      }

      if (!res.body) {
        throw new Error('El cuerpo de la respuesta de streaming es nulo.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulator = '';
      let detectedCategory = 'General';

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          if (onDone) onDone(detectedCategory);
          break;
        }

        accumulator += decoder.decode(value, { stream: true });
        const lines = accumulator.split('\n');
        // Conservar el último fragmento incompleto
        accumulator = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const jsonStr = trimmed.substring(6);
              const data = JSON.parse(jsonStr);
              if (data.categoria) {
                detectedCategory = data.categoria;
              }
              if (data.chunk !== undefined) {
                onChunk(data.chunk, data.final, data.categoria);
              }
            } catch (err) {
              console.error('Error al decodificar fragmento de stream:', err);
            }
          }
        }
      }
    } catch (err) {
      if (onError) onError(err);
    }
  }
};
