import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Plus, Send, Mic, MicOff, Menu, X, HelpCircle, ChevronRight, AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import MessageItem from './MessageItem';
import Sidebar from './Sidebar';
import DinoBot02 from '../assets/DinoBot02.png';

export default function Chatbot({ isWidget = false, onCloseWidget = null, onNavigateTab = null }) {
  const [conversaciones, setConversaciones] = useState([]);
  const [conversacionActivaId, setConversacionActivaId] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tutorías');
  const [deleteModalId, setDeleteModalId] = useState(null);

  const messagesContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  // Mapeador Inteligente Co-Pilot de categorías y texto a pestañas principales y sub-pestañas
  const mapCategoryAndQueryToTab = (categoria, queryTexto = '') => {
    if (!categoria && !queryTexto) return { mainTab: 'tutoria', subTab: 'inicio' };
    
    const cat = (categoria || '').toLowerCase();
    const text = (queryTexto || '').toLowerCase();

    // 1. FORMACIÓN PROFESIONAL (Malla, Prácticas PPP, Egreso y Titulación)
    if (cat.includes('practica') || cat.includes('práctica') || cat.includes('curso') || cat.includes('formacion') || cat.includes('formación') || cat.includes('malla') || cat.includes('titulacion') || cat.includes('bachiller')) {
      let subTab = 'malla';
      if (text.includes('practica') || text.includes('práctica') || text.includes('ppp') || text.includes('empresa') || text.includes('horas')) {
        subTab = 'practicas';
      } else if (text.includes('egreso') || text.includes('titula') || text.includes('título') || text.includes('bachiller') || text.includes('tesis') || text.includes('grado')) {
        subTab = 'titulacion';
      } else {
        subTab = 'malla';
      }
      return { mainTab: 'formacion', subTab };
    }

    // 2. BIENESTAR UNIVERSITARIO (Comedor, CUS Salud, Psicología, Vivienda, Deportes)
    if (cat.includes('bienestar') || text.includes('comedor') || text.includes('salud') || text.includes('vivienda') || text.includes('deporte')) {
      let subTab = 'comedor';
      if (text.includes('salud') || text.includes('posta') || text.includes('médic')) {
        subTab = 'salud';
      } else if (text.includes('psicolog') || text.includes('psicológ') || text.includes('mental')) {
        subTab = 'psicologia';
      } else if (text.includes('vivienda') || text.includes('residencia') || text.includes('cuarto') || text.includes('alojamiento')) {
        subTab = 'vivienda';
      } else if (text.includes('deporte') || text.includes('cultura') || text.includes('gimnasio')) {
        subTab = 'deportes';
      } else {
        subTab = 'comedor';
      }
      return { mainTab: 'bienestar', subTab };
    }

    // 3. TRÁMITES ACADÉMICOS (Mesa Virtual, Pagos TUPA, Matrícula, Constancias)
    if (cat.includes('tramite') || cat.includes('trámite') || text.includes('pago') || text.includes('recaud') || text.includes('matricula') || text.includes('matrícula') || text.includes('constancia') || text.includes('certificado')) {
      let subTab = 'tramite_virtual';
      if (text.includes('pago') || text.includes('pagar') || text.includes('recaudac') || text.includes('caja') || text.includes('costo') || text.includes('monto') || text.includes('tarifa')) {
        subTab = 'pagos';
      } else if (text.includes('matricul') || text.includes('matrícul') || text.includes('reserva') || text.includes('desaprob')) {
        subTab = 'matricula';
      } else if (text.includes('constancia') || text.includes('certificado') || text.includes('notas') || text.includes('documento')) {
        subTab = 'constancias';
      } else {
        subTab = 'tramite_virtual';
      }
      return { mainTab: 'tramites', subTab };
    }

    // 4. MOVILIDAD ESTUDIANTIL (Modalidades, Postulación, Convalidación, Convenios)
    if (cat.includes('movilidad') || text.includes('intercambio') || text.includes('convenio') || text.includes('saliente')) {
      let subTab = 'modalidades';
      if (text.includes('requisito') || text.includes('postul') || text.includes('documento')) {
        subTab = 'postulacion';
      } else if (text.includes('convalid') || text.includes('reconoc')) {
        subTab = 'convalidacion';
      } else if (text.includes('convenio') || text.includes('país') || text.includes('universidad')) {
        subTab = 'convenios';
      } else {
        subTab = 'modalidades';
      }
      return { mainTab: 'movilidad', subTab };
    }

    // 5. TUTORÍAS ACADÉMICAS (Inicio, Momentos, Reglamento, Tutores, FAQ)
    let subTab = 'inicio';
    if (text.includes('tutor') || text.includes('docente') || text.includes('profesor') || text.includes('quién es mi')) {
      subTab = 'tutores';
    } else if (text.includes('reglamento') || text.includes('art') || text.includes('artículo') || text.includes('norma')) {
      subTab = 'reglamento';
    } else if (text.includes('momento') || text.includes('cuándo') || text.includes('fecha') || text.includes('calendario')) {
      subTab = 'momentos';
    }
    return { mainTab: 'tutoria', subTab };
  };

  // Cargar conversaciones al montar
  useEffect(() => {
    cargarHistorial();
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

  // Abrir modal de confirmación de eliminación
  const handleDeleteConversacion = (id) => {
    setDeleteModalId(id);
  };

  // Confirmar eliminación de la conversación
  const confirmDelete = async () => {
    if (!deleteModalId) return;
    const id = deleteModalId;
    setDeleteModalId(null);
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
    // Forzar foco inmediato en la caja de texto
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

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
        (chunk, final, catStream) => {
          fullResponse += chunk;
          setStreamingContent(fullResponse);

          // NAVEGACIÓN CO-PILOT INMEDIATA: Al recibir el streaming
          if (catStream && onNavigateTab) {
            const targetNav = mapCategoryAndQueryToTab(catStream, texto);
            if (targetNav && targetNav.mainTab) {
              onNavigateTab(targetNav.mainTab, targetNav.subTab);
            }
          }
        },
        async (catFinal) => {
          // Streaming finalizado con éxito
          setCargando(false);
          setStreamingContent('');

          const catGuardar = catFinal || selectedCategory || 'General';

          // 5. Guardar respuesta del bot en la BD con la categoría real
          const msgGuardado = await api.guardarMensaje(idConv, 'asistente', fullResponse, catGuardar);

          // 6. Recargar detalles del chat para obtener los IDs correctos (necesarios para feedback)
          if (msgGuardado) {
            const data = await api.getDetalleConversacion(idConv);
            setMensajes(data.mensajes || []);
          }

          // NAVEGACIÓN CO-PILOT CONFIRMACIÓN
          if (onNavigateTab && catGuardar) {
            const targetNav = mapCategoryAndQueryToTab(catGuardar, texto);
            if (targetNav && targetNav.mainTab) {
              onNavigateTab(targetNav.mainTab, targetNav.subTab);
            }
          }

          // 7. Auto-reproducir audio si lo desea el flujo
          try {
            await api.generarAudio(fullResponse);
          } catch (e) {
            console.warn('Audio auto-generation failed or model not loaded:', e.message);
          }

          // Mantener el cursor activo enfocado
          requestAnimationFrame(() => {
            inputRef.current?.focus();
          });
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
      const transcript = event.results[0][0]?.transcript;
      if (transcript) {
        setInput('');
        handleSend(transcript.trim());
      }
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

  // Lista de preguntas sugeridas agrupadas por los 5 módulos principales del sistema
  const categoriasPreguntas = {
    'Tutorías': [
      '¿La tutoría académica es obligatoria?',
      '¿Cómo solicito una cita de tutoría académica?',
      '¿Cómo solicito cambio de tutor académico?'
    ],
    'Bienestar': [
      '¿Cómo obtengo un cupo para el Comedor Universitario?',
      '¿Dónde se realiza el pago del Comedor Universitario?',
      '¿Qué servicios ofrece el Centro de Salud UNSAAC?'
    ],
    'Movilidad': [
      '¿Cuáles son los requisitos para movilidad estudiantil?',
      '¿Cuál es la regla del 75% para convalidación de cursos?',
      '¿Dónde reviso las convocatorias de movilidad y becas?'
    ],
    'Formación': [
      '¿Cuáles son los requisitos para Prácticas Preprofesionales (PPP)?',
      '¿Dónde descargo la Malla Curricular 2025 de EPIIS?',
      '¿Cuáles son los requisitos para obtener el Bachillerato?'
    ],
    'Trámites': [
      '¿Cómo presento un expediente en la Mesa de Partes Virtual?',
      '¿Cómo hago seguimiento a un trámite en la UNSAAC?',
      '¿Dónde realizo el pago de tasas y certificados (TUPA)?'
    ]
  };

  return (
    <div className={`flex flex-col bg-white border-2 border-[#010080]/40 hover:border-[#010080] transition-all duration-300 h-full relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl ${isWidget ? 'w-[390px] max-w-full' : 'w-full'
      }`}>

      {/* Modal Personalizado de Confirmación de Eliminación */}
      {deleteModalId && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-11 h-11 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shrink-0">
              <AlertCircle size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">Eliminar Conversación</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                ¿Estás seguro de que deseas eliminar esta conversación del historial?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setDeleteModalId(null)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

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
                  onClick={() => {
                    if (onNavigateTab) {
                      const tab = mapCategoryToTab(selectedCategory);
                      if (tab) onNavigateTab(tab);
                    }
                    handleSend(sug);
                  }}
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
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
