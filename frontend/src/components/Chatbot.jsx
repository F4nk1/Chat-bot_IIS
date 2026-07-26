import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Plus, Send, Mic, MicOff, Menu, X, HelpCircle, ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import MessageItem from './MessageItem';
import Sidebar from './Sidebar';
import DinoBot02 from '../assets/DinoBot02.png';

export default function Chatbot({ isWidget = false, onCloseWidget = null }) {
  const [conversaciones, setConversaciones] = useState([]);
  const [conversacionActivaId, setConversacionActivaId] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tutorías');

  const messagesContainerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Cargar conversaciones al montar y cleanup del micrófono al desmontar
  useEffect(() => {
    cargarHistorial();
    return () => {
      // Cleanup: detener grabación si el usuario cierra el componente o tab de golpe
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // Hacer scroll automático al recibir mensajes
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [mensajes, streamingContent, cargando]);

  // Cargar historial de la base de datos
  const cargarHistorial = async () => {
    try {
      const data = await api.getConversaciones();
      setConversaciones(data);
    } catch (err) {
      console.error('Error al cargar conversaciones:', err);
    }
  };

  // Seleccionar conversación del historial
  const handleSelectConversacion = async (id) => {
    try {
      setConversacionActivaId(id);
      const data = await api.getDetalleConversacion(id);
      // Filtrar o mapear mensajes cargados
      setMensajes(data.mensajes || []);
      setStreamingContent('');
    } catch (err) {
      console.error('Error al cargar detalle de conversación:', err);
    }
  };

  // Crear una nueva conversación
  const handleNewChat = () => {
    setConversacionActivaId(null);
    setMensajes([]);
    setStreamingContent('');
  };

  // Eliminar una conversación y limpiar la pantalla si es activa
  const handleDeleteConversacion = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta conversación del historial?')) return;
    try {
      await api.eliminarConversacion(id);
      if (conversacionActivaId === id) {
        handleNewChat();
      }
      await cargarHistorial();
    } catch (err) {
      console.error('Error al eliminar conversación:', err);
    }
  };

  // Envío del mensaje
  const handleSend = async (textoAEnviar = '') => {
    if (cargando) return;
    const texto = (textoAEnviar || input).trim();
    if (!texto) return;

    setInput('');
    let idConv = conversacionActivaId;

    // 1. Crear conversación si no hay una activa
    if (!idConv) {
      try {
        const titulo = texto.substring(0, 30) + (texto.length > 30 ? '...' : '');
        const nuevaConv = await api.crearConversacion(titulo);
        idConv = nuevaConv.id;
        setConversacionActivaId(idConv);
        await cargarHistorial(); // Refrescar historial
      } catch (err) {
        console.error('Error al iniciar conversación:', err);
        return;
      }
    }

    // 2. Agregar mensaje del usuario a la interfaz
    const nuevoMsgUsuario = { rol: 'usuario', contenido: texto };
    setMensajes(prev => [...prev, nuevoMsgUsuario]);
    setCargando(true);

    try {
      // 3. Guardar mensaje de usuario en BD
      await api.guardarMensaje(idConv, 'usuario', texto);

      // 4. Iniciar streaming de la respuesta del bot
      let fullResponse = '';
      setStreamingContent('');

      // Formatear historial para el backend
      const historialChat = mensajes.map(m => ({
        role: m.rol === 'usuario' ? 'user' : 'assistant',
        content: m.contenido
      }));

      await api.streamChat(
        texto,
        historialChat,
        (chunk, final) => {
          fullResponse += chunk;
          setStreamingContent(fullResponse);
        },
        async () => {
          // Streaming finalizado con éxito
          setCargando(false);
          setStreamingContent('');

          // 5. Guardar respuesta del bot en la BD
          const msgGuardado = await api.guardarMensaje(idConv, 'asistente', fullResponse, 'General');

          // 6. Recargar detalles del chat para obtener los IDs correctos (necesarios para feedback)
          if (msgGuardado) {
            const data = await api.getDetalleConversacion(idConv);
            setMensajes(data.mensajes || []);
          }

          // 7. Auto-reproducir audio si lo desea el flujo
          try {
            await api.generarAudio(fullResponse);
          } catch (e) {
            console.warn('Audio auto-generation failed or model not loaded:', e.message);
          }
        },
        (err) => {
          console.error('Error durante el streaming:', err);
          setCargando(false);
          setStreamingContent('');
          setMensajes(prev => [...prev, { rol: 'asistente', contenido: 'Error al conectar con el servidor.' }]);
        }
      );
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      setCargando(false);
    }
  };

  // Activar micrófono (Reconocimiento de Voz)
  const handleMicrophone = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta el reconocimiento de voz. Te recomendamos usar Google Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'es-PE';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => {
        const newVal = (prev + (prev ? ' ' : '') + transcript).trim();
        handleSend(newVal);
        return '';
      });
    };

    rec.onerror = (e) => {
      console.error('Error de reconocimiento de voz:', e);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  // Lista de preguntas sugeridas agrupadas por temas principales del reglamento
  const categoriasPreguntas = {
    'Tutorías': [
      '¿Cómo solicito una tutoría académica?',
      '¿La tutoría académica es obligatoria?',
      '¿Cómo solicito cambio de tutor académico?'
    ],
    'Reglamento': [
      '¿Qué regula el Reglamento de Tutoría Académica?',
      '¿A quiénes comprende el reglamento de tutoría académica?',
      '¿Cuál es la base legal de la tutoría académica?'
    ],
    'Funcionamiento': [
      '¿Cómo se realiza la tutoría académica?',
      '¿Cuáles son los momentos clave para realizar tutorías?',
      '¿Cuántos estudiantes puede tener un tutor académico?'
    ],
    'Tutores': [
      '¿Quiénes integran el Comité Tutorial de Escuela?',
      '¿Quiénes pueden ser tutores académicos?',
      '¿Qué debe elaborar cada tutor académico?'
    ]
  };

  return (
    <div className={`flex flex-col bg-white border-2 border-[#010080]/40 hover:border-[#010080] transition-all duration-300 h-full relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl ${isWidget ? 'w-[390px] max-w-full' : 'w-full'
      }`}>

      {/* Sidebar Historial */}
      <Sidebar
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        conversaciones={conversaciones}
        conversacionActivaId={conversacionActivaId}
        onSelectConversacion={handleSelectConversacion}
        onNewChat={handleNewChat}
        onDeleteConversacion={handleDeleteConversacion}
      />

      {/* Header */}
      <div className="bg-[#010080] text-white p-3.5 flex items-center justify-between shrink-0 shadow-md border-b border-[#DFB320]/30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHistoryOpen(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Ver Historial"
          >
            <Menu size={20} className="text-slate-300 hover:text-white" />
          </button>

          <div className="relative w-10 h-10 rounded-full border-2 border-[#DFB320] bg-white overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
            <img src={DinoBot02} alt="DinoBot Avatar" className="w-full h-full object-cover" />
          </div>

          <div>
            <h2 className="text-sm font-bold tracking-wide text-white">DinoBot</h2>
            <p className="text-[10px] text-slate-300 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Orientador disponible
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleNewChat}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Nueva Conversación"
          >
            <Plus size={20} className="text-slate-300 hover:text-white" />
          </button>
          {isWidget && onCloseWidget && (
            <button
              onClick={onCloseWidget}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Cerrar Chat"
            >
              <X size={20} className="text-slate-300 hover:text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Contenedor con scroll para la conversación actual */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 bg-slate-50 w-full">
        {mensajes.length === 0 && !streamingContent ? (
          /* Presentación inicial para guiar al estudiante sobre qué preguntar */
          <div className="flex flex-col min-h-full items-center justify-center text-center animate-fade-in px-4 py-2">
            {/* Estilos para lograr el desplazamiento continuo horizontal */}
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                display: flex;
                width: max-content;
                animation: marquee 20s linear infinite;
              }
              .animate-marquee:hover {
                animation-play-state: paused;
              }
              @media (max-width: 640px) {
                .marquee-container {
                  overflow-x: auto;
                  scrollbar-width: none;
                }
                .marquee-container::-webkit-scrollbar {
                  display: none;
                }
                .animate-marquee {
                  animation: none;
                  width: auto;
                  flex-wrap: nowrap;
                }
              }
            `}</style>

            <div className="w-20 h-20 aspect-square rounded-full border-3 border-[#DFB320] bg-white overflow-hidden shadow-md mb-3 relative flex items-center justify-center shrink-0">
              <img src={DinoBot02} alt="DinoBot" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">¡Hola! Soy DinoBot</h3>
            <p className="text-xs max-w-[280px] mb-4 font-semibold leading-relaxed" style={{ color: '#5C5CFF' }}>
              Estoy aquí para orientarte y resolver cualquier duda. ¡Pregúntame con toda confianza!
            </p>

            {/* Carrusel con los temas generales del reglamento */}
            <div className="w-full overflow-hidden border-y border-slate-200/85 py-2.5 bg-slate-50/80 relative mb-4 shrink-0 marquee-container">
              <div className="animate-marquee gap-2 flex items-center">
                {[...Object.keys(categoriasPreguntas), ...Object.keys(categoriasPreguntas), ...Object.keys(categoriasPreguntas)].map((cat, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold transition-all cursor-pointer border shrink-0 ${selectedCategory === cat
                      ? 'bg-[#2E2EFF] border-[#2E2EFF] text-white shadow-xs scale-102'
                      : 'bg-white border-slate-200 text-slate-650 hover:border-[#2E2EFF] hover:text-[#2E2EFF]'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de preguntas frecuentes asociadas al tema seleccionado */}
            <div className="w-full space-y-1.5 shrink-0">
              {categoriasPreguntas[selectedCategory].map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sug)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#2E2EFF] hover:bg-[#2E2EFF]/5 text-xs text-slate-705 font-medium transition-all flex items-center justify-between group cursor-pointer shadow-sm animate-fade-in"
                >
                  <span>{sug}</span>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-[#2E2EFF] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Burbujas de chat */
          <div className="space-y-1">
            {mensajes.map((msg, index) => (
              <MessageItem key={index} message={msg} />
            ))}

            {/* Mensaje en Streaming */}
            {streamingContent && (
              <MessageItem message={{ rol: 'asistente', contenido: streamingContent }} isStreaming={true} />
            )}

            {/* Burbuja escribiendo */}
            {cargando && !streamingContent && (
              <div className="flex items-start gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full border border-[#DFB320] bg-white overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
                  <img src={DinoBot02} alt="DinoBot" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-1.5 px-4 py-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-sm max-w-[80px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer / Input Container */}
      <div className="p-3 border-t border-slate-200 bg-white shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-1.5 bg-slate-50 rounded-xl px-2.5 py-1.5 border-2 border-[#061D6F]/40 hover:border-[#061D6F]/65 focus-within:border-[#061D6F] focus-within:bg-white transition-all shadow-sm"
        >
          {/* Input Text */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={cargando}
            placeholder="Haz una pregunta..."
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder-slate-500 text-slate-800 py-1 font-medium"
          />

          {/* Botón Micrófono */}
          <button
            type="button"
            onClick={handleMicrophone}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${isListening
              ? 'bg-red-100 text-red-600 animate-pulse'
              : 'text-[#061D6F] hover:bg-slate-200/60'
              }`}
            title={isListening ? "Detener grabación" : "Preguntar por voz"}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          {/* Botón Enviar */}
          <button
            type="submit"
            disabled={!input.trim() || cargando}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${input.trim() && !cargando
              ? 'text-[#061D6F] hover:bg-slate-200/60'
              : 'text-[#061D6F]/30'
              }`}
          >
            <Send size={16} />
          </button>
        </form>

        <p className="text-[9px] text-slate-400 text-center mt-1.5 leading-snug">
          Asistente Académico v1.0. Por favor valida la información importante del reglamento.
        </p>
      </div>
    </div>
  );
}
