import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Volume2, VolumeX, ThumbsUp, ThumbsDown, Check, Copy, Bot, User } from 'lucide-react';
import { api } from '../services/api';
import DinoBot02 from '../assets/DinoBot02.png';

export default function MessageItem({ message, isStreaming = false }) {
  const { id, rol, contenido, fecha_creacion } = message;
  const isBot = rol === 'asistente';
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
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

  // Reproducir/Pausar síntesis de voz (TTS)
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
      // 1. Llamar a la API para generar el audio
      const data = await api.generarAudio(contenido);
      if (data && data.url) {
        // 2. Crear y reproducir el audio
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

  // Enviar valoración
  const handleFeedback = async (score) => {
    if (feedbackSent) return;
    try {
      if (!id) return;
      await api.enviarFeedback(id, score);
      setFeedbackSent(true);
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
              <ReactMarkdown>{contenido}</ReactMarkdown>
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

          {/* Valoración */}
          {feedbackSent ? (
            <span className="text-[11px] font-medium text-green-600 animate-fade-in">¡Gracias!</span>
          ) : (
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handleFeedback(1)} 
                className="p-1 rounded hover:bg-slate-100 hover:text-green-600 transition-colors cursor-pointer"
                title="Es útil"
              >
                <ThumbsUp size={14} />
              </button>
              <button 
                onClick={() => handleFeedback(-1)} 
                className="p-1 rounded hover:bg-slate-100 hover:text-red-600 transition-colors cursor-pointer"
                title="No es útil"
              >
                <ThumbsDown size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
