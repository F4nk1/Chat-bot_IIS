import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Volume2, VolumeX, ThumbsUp, ThumbsDown, Check, Copy, User, ExternalLink, Compass } from 'lucide-react';
import { api } from '../services/api';
import DinoBot02 from '../assets/DinoBot02.png';

// Helper para transformar viñetas inline "1) ... 2) ..." a listas numeradas Markdown "1. ... \n2. ..."
const formatearPasosTexto = (texto) => {
  if (!texto) return '';
  return texto
    .replace(/(?:^|\s+)([1-9]\d?)\)\s*(?=[A-ZÁÉÍÓÚÑa-z])/g, '\n\n$1. ')
    .trim();
};

// Limpiar enlaces, URLs y marcas visuales para la reproducción de voz (TTS)
const limpiarTextoParaVoz = (texto) => {
  if (!texto) return '';
  return texto
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Conservar el nombre/título del enlace y omitir la URL
    .replace(/https?:\/\/\S+/g, '') // Eliminar URLs crudas o sueltas
    .replace(/\*\*/g, '') // Eliminar negritas
    .replace(/\*/g, '') // Eliminar cursivas
    .trim();
};

// Verificar si el mensaje es una respuesta de fallback / error
const esMensajeFallback = (txt) => {
  if (!txt) return true;
  const t = txt.toLowerCase();
  return (
    t.includes('sobrecargado') ||
    t.includes('límite de peticiones') ||
    t.includes('límite de cuota') ||
    t.includes('saturado') ||
    t.includes('espera un minuto') ||
    t.includes('no dispongo de información') ||
    t.includes('no encontré información') ||
    t.includes('no corresponde al ámbito') ||
    t.includes('por favor, indícame tu código') ||
    t.includes('no hay ningún tutor activo') ||
    t.includes('no estoy seguro de cómo responder') ||
    t.includes('solo puedo orientarte sobre trámites') ||
    t.includes('error al conectar')
  );
};

export default function MessageItem({ message, isStreaming = false }) {
  const { id, rol, contenido, fecha_creacion } = message;
  const isBot = rol === 'asistente';
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [feedback, setFeedback] = useState(null); // null, 1 (like), -1 (dislike)
  const [copied, setCopied] = useState(false);

  // Formateador de hora local
  const formatTime = (dateStr) => {
    const d = dateStr ? new Date(dateStr) : new Date();
    return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Copiar respuesta al portapapeles
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contenido);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar texto:', err);
    }
  };

  // Reproducir/Pausar síntesis de voz (TTS) limpios sin URLs ni enlaces
  const handleVoice = async () => {
    if (isPlaying) {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      setIsPlaying(false);
      return;
    }

    try {
      let textoParaAudio = contenido || '';
      if (!esMensajeFallback(textoParaAudio) && !textoParaAudio.includes('más información en pantalla')) {
        textoParaAudio += '\n\nA continuación te muestro más información en pantalla';
      }
      const textoLimpio = limpiarTextoParaVoz(textoParaAudio);
      if (!textoLimpio) return;

      const data = await api.generarAudio(textoLimpio);
      if (data && data.url) {
        const audio = new Audio(api.getAudioUrl(data.url));
        setAudioElement(audio);
        setIsPlaying(true);
        
        audio.play().catch(e => {
          console.error("Error al reproducir audio:", e);
          setIsPlaying(false);
        });

        audio.onended = () => {
          setIsPlaying(false);
        };
      }
    } catch (err) {
      console.error('Error al reproducir voz:', err.message);
      alert(err.message || 'Error al conectar con el servidor de voz.');
      setIsPlaying(false);
    }
  };

  // Enviar valoración con retroalimentación visual directa (Iconos Verde / Rojo con animación)
  const handleFeedback = async (score) => {
    if (feedback === score) return;
    setFeedback(score);
    try {
      if (!id) return;
      await api.enviarFeedback(id, score);
    } catch (err) {
      console.error('Error al enviar valoración:', err);
    }
  };

  return (
    <div className={`flex flex-col mb-4 ${isBot ? 'items-start' : 'items-end'}`}>
      <div className={`flex items-start max-w-[85%] gap-2.5 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        {isBot ? (
          <div className="w-8 h-8 rounded-full border border-[#DFB320] bg-white overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
            <img src={DinoBot02} alt="DinoBot" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 shadow-sm">
            <User size={16} />
          </div>
        )}

        {/* Mensaje */}
        <div className={`rounded-2xl px-4 py-2.5 shadow-sm text-sm border ${
          isBot 
            ? 'bg-white text-slate-800 border-slate-200 rounded-tl-none' 
            : 'bg-[#010080] text-white border-transparent rounded-tr-none'
        }`}>
          {isBot ? (
            <div className={`prose prose-sm max-w-none text-slate-800 leading-relaxed ${isStreaming ? 'typing-cursor' : ''}`}>
              <ReactMarkdown
                components={{
                  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1.5 my-2 font-normal text-slate-800">{children}</ol>,
                  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1.5 my-2 font-normal text-slate-800">{children}</ul>,
                  li: ({ children }) => <li className="pl-0.5 leading-relaxed text-slate-800">{children}</li>,
                  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-slate-800">{children}</p>,
                  strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#010080] hover:underline font-semibold my-0.5">
                      <span>{children}</span>
                      <ExternalLink size={12} className="shrink-0 text-[#010080]" />
                    </a>
                  )
                }}
              >
                {formatearPasosTexto(contenido)}
              </ReactMarkdown>

              {!isStreaming && !esMensajeFallback(contenido) && (
                <p className="mt-2.5 text-xs font-extrabold text-[#010080] border-t border-slate-100 pt-1.5 flex items-center gap-1.5">
                  <span>A continuación te muestro más información en pantalla</span>
                </p>
              )}

              <span className="text-[9px] text-slate-400 block text-right mt-1.5">{formatTime(fecha_creacion)}</span>
            </div>
          ) : (
            <div>
              <p className="whitespace-pre-wrap leading-relaxed">{contenido}</p>
              <span className="text-[9px] text-slate-300 block text-right mt-1">{formatTime(fecha_creacion)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción (Solo para el Bot) */}
      {isBot && contenido && (
        <div className="flex items-center gap-3 ml-10 mt-1.5 text-slate-400">
          {/* Botón de reproducción de voz */}
          <button 
            onClick={handleVoice} 
            className={`p-1 rounded hover:bg-slate-100 hover:text-[#010080] transition-colors cursor-pointer ${
              isPlaying ? 'text-[#010080] animate-pulse' : ''
            }`}
            title={isPlaying ? "Detener voz" : "Escuchar respuesta"}
          >
            {isPlaying ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <span className="w-[1px] h-3 bg-slate-200"></span>

          {/* Botón de copiar */}
          <button 
            onClick={handleCopy} 
            className="p-1 rounded hover:bg-slate-100 hover:text-[#010080] transition-colors cursor-pointer"
            title="Copiar al portapapeles"
          >
            {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
          </button>

          <span className="w-[1px] h-3 bg-slate-200"></span>

          {/* Valoración (Iconos Interactivos Verde / Rojo con animación) */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => handleFeedback(1)} 
              className={`p-1 rounded transition-all duration-200 cursor-pointer ${
                feedback === 1 
                  ? 'text-emerald-600 bg-emerald-50 scale-110' 
                  : 'text-slate-400 hover:bg-slate-100 hover:text-emerald-600'
              }`}
              title="Es útil"
            >
              <ThumbsUp size={14} className={feedback === 1 ? 'fill-emerald-600' : ''} />
            </button>

            <button 
              onClick={() => handleFeedback(-1)} 
              className={`p-1 rounded transition-all duration-200 cursor-pointer ${
                feedback === -1 
                  ? 'text-rose-600 bg-rose-50 scale-110' 
                  : 'text-slate-400 hover:bg-slate-100 hover:text-rose-600'
              }`}
              title="No es útil"
            >
              <ThumbsDown size={14} className={feedback === -1 ? 'fill-rose-600' : ''} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
