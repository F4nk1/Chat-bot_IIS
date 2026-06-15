import React, { useState } from 'react';
import {
  BookOpen, Users, Clock, ShieldAlert, ChevronRight, HelpCircle,
  MessageSquare, Compass, Info, Award, Calendar, GraduationCap,
  Sparkles, CheckCircle2, Copy, AlertCircle, ArrowUpRight, Mail
} from 'lucide-react';
import Chatbot from './components/Chatbot';
import DinoBot01 from './assets/DinoBot01.png';
import logoInfo from './assets/logo_info.jpg';

// Datos del reglamento estructurado
const articulosReglamento = [
  {
    id: "Art. 1°",
    titulo: "Naturaleza y alcance del reglamento",
    contenido: "Regula la actividad tutorial académica en la UNSAAC brindada a los estudiantes universitarios. Comprende a autoridades, funcionarios académicos, profesores, estudiantes y personal administrativo.",
    capitulo: "Capítulo I: Normas Generales",
    roles: ["estudiante", "tutor", "comite"]
  },
  {
    id: "Art. 2°",
    titulo: "Base Legal",
    contenido: "Se fundamenta legalmente en la Ley Universitaria 30220, Art. 87.5 y el Estatuto de la UNSAAC, Art. 195.5.",
    capitulo: "Capítulo I: Normas Generales",
    roles: ["comite"]
  },
  {
    id: "Art. 3°",
    titulo: "Definición de tutoría",
    contenido: "La Tutoría Académica es un proceso permanente de acompañamiento durante la formación de los estudiantes, que se concreta mediante la atención personalizada o grupal que se les brinde por parte de docentes. Busca orientar y proporcionar seguimiento a su trayectoria académica, en los aspectos psicosociales, cognitivos y afectivos del aprendizaje, para fortalecer su formación integral y asegurar su permanencia y culminación de la carrera.",
    capitulo: "Capítulo I: Normas Generales",
    roles: ["estudiante", "tutor"]
  },
  {
    id: "Art. 4°",
    titulo: "Fines de la tutoría",
    contenido: "Tiene como finalidad constituirse en un medio para hacer auténticos los fines señalados por la Ley Universitaria. Se centra en cuidar que la enseñanza-aprendizaje, profesionalización e investigación científica se realicen en el pregrado bajo un marco de excelencia integral y sostenible, basado en inclusión social y respeto al derecho. Es una actividad de responsabilidad social reconocida como carga académica no lectiva, siendo obligatoria para estudiantes con matrícula condicionada.",
    capitulo: "Capítulo I: Normas Generales",
    roles: ["estudiante", "tutor", "comite"]
  },
  {
    id: "Art. 5°",
    titulo: "Objetivos primordiales de la actividad tutorial",
    contenido: "Implementar un sistema de tutoría con calidad educativa, mejorar permanentemente la formación del estudiante en cada semestre, dar apoyo integral según necesidades individuales, favorecer la reflexión personal, contribuir a elevar el aprovechamiento académico, fomentar autoaprendizaje, abatir la deserción y derivar a instancias especializadas cuando el rendimiento se afecte por causas no académicas.",
    capitulo: "Capítulo I: Normas Generales",
    roles: ["tutor", "comite"]
  },
  {
    id: "Art. 6°",
    titulo: "Sujetos del proceso",
    contenido: "Son sujetos del proceso: El Tutor (docente universitario con régimen de tiempo completo o dedicación exclusiva acreditado para promover la formación integral en conocimientos, habilidades y valores éticos) y el Tutorado (el estudiante universitario).",
    capitulo: "Capítulo I: Normas Generales",
    roles: ["estudiante", "tutor"]
  },
  {
    id: "Art. 7°",
    titulo: "Carácter y Dimensiones de la tutoría",
    contenido: "Consiste en el trabajo extra clase del docente con el estudiante durante toda su carrera. Se realiza de forma personalizada y en horarios organizados. Abarca tres dimensiones: Académica (exigencias académicas, habilidades de estudio, pensamiento crítico), Personal (aceptación propia, responsabilidad, comunicación) y Profesional (intereses, aptitudes, mercado laboral).",
    capitulo: "Capítulo I: Normas Generales",
    roles: ["estudiante", "tutor"]
  },
  {
    id: "Art. 8°",
    titulo: "Organización por unidad académica",
    contenido: "Cada Escuela organiza su sistema tutorial bajo la siguiente estructura: a) Comité Tutorial de Escuela (Decano, Director de Escuela y un docente elegido). b) Los Tutores (docentes adscritos a la Escuela).",
    capitulo: "Capítulo II: Estructura Tutorial",
    roles: ["comite"]
  },
  {
    id: "Art. 9°",
    titulo: "Funciones del Comité Tutorial",
    contenido: "Encargado de la adecuada y eficaz actividad tutorial en la Escuela. Propone tutores nombrados por resolución, administra información, deriva casos a bienestar y aprueba la directiva de funcionamiento específica para la carrera.",
    capitulo: "Capítulo II: Estructura Tutorial",
    roles: ["comite"]
  },
  {
    id: "Art. 10°",
    titulo: "Actividad de los tutores (Expediente)",
    contenido: "El tutor debe elaborar un expediente del tutorado que incluya: Diagnóstico inicial por desempeño, implementación de estrategias tutoriales, verificación de la mejora académica sistemática y sistematización semestral de resultados en un informe. La UNSAAC provee los materiales.",
    capitulo: "Capítulo II: Estructura Tutorial",
    roles: ["tutor"]
  },
  {
    id: "Art. 11°",
    titulo: "Supervisión del programa",
    contenido: "Las actividades de tutores y comités son supervisadas directamente por el Vicerrectorado Académico, el cual emite directivas obligatorias de mejora.",
    capitulo: "Capítulo II: Estructura Tutorial",
    roles: ["comite"]
  },
  {
    id: "Art. 12°",
    titulo: "Periodicidad de las tutorías",
    contenido: "Se realiza en entrevistas programadas. Se determinan frecuencias mínimas, siendo fundamental realizarlas en tres momentos clave del semestre lectivo: 1) Al comenzar el semestre, 2) Después de la primera evaluación parcial y 3) Una semana antes de la finalización del semestre.",
    capitulo: "Capítulo III: Ejecución y Funcionamiento",
    roles: ["estudiante", "tutor"]
  },
  {
    id: "Art. 13°",
    titulo: "Funciones del Tutor Académico",
    contenido: "Recibe información de docentes, coordina por inasistencias de estudiantes, comunica indicadores críticos al Comité, orienta en la adaptación universitaria (estudios generales), fomenta hábitos de estudio y ayuda en la inserción laboral al final de la carrera.",
    capitulo: "Capítulo III: Ejecución y Funcionamiento",
    roles: ["tutor"]
  },
  {
    id: "Art. 14°",
    titulo: "Asignación de Tutores",
    contenido: "Los estudiantes tienen un tutor asignado desde el inicio hasta el fin de su plan curricular. El número máximo de tutorados por docente no debe superar los 25. Es posible solicitar cambio de tutor con justificación ante el Comité.",
    capitulo: "Capítulo III: Ejecución y Funcionamiento",
    roles: ["estudiante", "tutor"]
  },
  {
    id: "Art. 15°",
    titulo: "Deber de confidencialidad y protección de datos",
    contenido: "Los Tutores tienen el deber estricto de confidencialidad sobre la información personal recibida de los estudiantes. El tratamiento de los datos debe respetar rigurosamente la normativa de Protección de Datos de Carácter Personal.",
    capitulo: "Capítulo III: Ejecución y Funcionamiento",
    roles: ["estudiante", "tutor"]
  },
  {
    id: "Art. 16°",
    titulo: "Evaluación del programa tutorial",
    contenido: "Al finalizar el año académico, el Comité evalúa el cumplimiento de objetivos analizando: Cantidad de docentes y estudiantes participantes, impacto en tasas de deserción y satisfacción global del programa.",
    capitulo: "Capítulo III: Ejecución y Funcionamiento",
    roles: ["comite"]
  }
];

// Lista de tutores simulados oficiales de Ingeniería Informática y Sistemas
const listaTutores = [
  { nombre: "Ing. Boris Chullo Ch.", rol: "Coordinador / Comité Tutorial", correo: "boris.chullo@unsaac.edu.pe", iniciales: "BC" },
  { nombre: "Ing. Gladys Flores C.", rol: "Docente Tutor / Comité", correo: "gladys.flores@unsaac.edu.pe", iniciales: "GF" },
  { nombre: "Mgt. Carlos Medina R.", rol: "Docente Tutor Especialista", correo: "carlos.medina@unsaac.edu.pe", iniciales: "CM" },
  { nombre: "Ing. Roger Ruiz V.", rol: "Docente Tutor / Consejero", correo: "roger.ruiz@unsaac.edu.pe", iniciales: "RR" },
  { nombre: "Dra. Roxana Pérez M.", rol: "Docente Tutora Académica", correo: "roxana.perez@unsaac.edu.pe", iniciales: "RP" }
];

export default function App() {
  const [activeMoment, setActiveMoment] = useState(1);
  const [activeProfile, setActiveProfile] = useState('completo');
  const [selectedArtId, setSelectedArtId] = useState('Art. 1°');
  const [chatOpen, setChatOpen] = useState(false); // Widget flotante en móvil

  // Filtrar artículos por perfil
  const articulosFiltrados = activeProfile === 'completo'
    ? articulosReglamento
    : articulosReglamento.filter(art => art.roles.includes(activeProfile));

  // Obtener artículo seleccionado para la vista detallada
  const articuloSeleccionado = articulosReglamento.find(art => art.id === selectedArtId) || articulosReglamento[0];

  // Momentos de la línea de tiempo
  const momentosSemestre = [
    {
      id: 1,
      titulo: "Fase de Inicio",
      subtitulo: "Primeros Pasos",
      descripcion: "¡Comenzamos el semestre con el pie derecho! En esta primera reunión conocerás a tu tutor académico. Conversarán sobre tus metas del ciclo, las expectativas de tus cursos y definirán las primeras pautas de apoyo.",
      baseLegal: "Reglamento UNSAAC - Art. 12.3 & Art. 10.1"
    },
    {
      id: 2,
      titulo: "Fase de Seguimiento",
      subtitulo: "Revisión a Medio Camino",
      descripcion: "Luego de tus primeros exámenes parciales, nos reunimos para analizar cómo te fue. Si todo va genial, te motivamos a seguir; si hay algún curso difícil, buscamos juntos estrategias y soluciones oportunas.",
      baseLegal: "Reglamento UNSAAC - Art. 12.3 & Art. 13.1"
    },
    {
      id: 3,
      titulo: "Fase de Finalización",
      subtitulo: "Balance y Cierre",
      descripcion: "Cerramos el ciclo con una última reunión para evaluar tus logros, reflexionar sobre lo aprendido y registrar los avances en tu plan académico, preparándote para el éxito del siguiente semestre.",
      baseLegal: "Reglamento UNSAAC - Art. 12.3 & Art. 10.4"
    }
  ];

  const infoMoment = momentosSemestre.find(m => m.id === activeMoment);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#c8c8ef]">

      {/* Encabezado Institucional */}
      <header className="bg-[#010080] text-white border-b border-yellow-500 sticky top-0 z-40 shadow-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logotipo oficial de la EPIIS */}
            <div className="w-10 h-10 rounded-lg bg-white overflow-hidden flex items-center justify-center border border-yellow-500 shrink-0">
              <img src={logoInfo} alt="EPIIS Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight m-0 text-white flex items-center gap-1.5">
                EPIIS <span className="text-yellow-500">|</span> UNSAAC
              </h1>
              <p className="text-[10px] text-slate-200 leading-none">Sistema de Orientación de Tutorías Académicas</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#que-es" className="hover:text-yellow-400 transition-colors">¿Qué es?</a>
            <a href="#timeline" className="hover:text-yellow-400 transition-colors">Momentos Clave</a>
            <a href="#reglamento" className="hover:text-yellow-400 transition-colors">Reglamento</a>
            <a href="#tutores" className="hover:text-yellow-400 transition-colors">Docentes Tutores</a>
            <a href="#faq" className="hover:text-yellow-400 transition-colors">Preguntas Frecuentes</a>
          </nav>
        </div>
      </header>

      {/* Grid Principal */}
      <div className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LADO IZQUIERDO Y CENTRAL: Portal Informativo (75%) */}
        <main className="lg:col-span-3 space-y-10">

          {/* Bienvenida / Hero */}
          <section className="bg-gradient-to-r from-[#010080] to-[#00004c] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border-l-8 border-yellow-500 transition-all duration-300 hover:shadow-xl">
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 mb-4 border border-yellow-500/30">
                <Sparkles size={12} /> Portal Oficial de Orientación
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
                Orientación y Acompañamiento Académico para tu éxito
              </h2>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Descubre cómo funciona el programa de tutorías de Ingeniería Informática y de Sistemas de la UNSAAC. Encuentra reglamentos, fases del ciclo y chatea con nuestro asistente inteligente para resolver dudas sobre trámites, tutorías y bienestar.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#reglamento"
                  className="bg-yellow-500 hover:bg-[#DFB320] text-[#061D6F] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-102"
                >
                  <BookOpen size={14} /> Explorar Reglamento
                </a>
                <button
                  onClick={() => setChatOpen(true)}
                  className="lg:hidden bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border border-white/20 flex items-center gap-1.5"
                >
                  <MessageSquare size={14} /> Abrir Chatbot
                </button>
              </div>
            </div>
            {/* Fondo geométrico sutil */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4 translate-x-1/4">
              <GraduationCap size={350} />
            </div>
          </section>

          {/* ¿Qué es la tutoría académica y Objetivos? */}
          <section id="que-es" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#010080]/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#010080] flex items-center justify-center mb-4">
                  <Info size={20} />
                </div>
                <h3 className="text-lg font-bold text-[#010080] mb-3">¿Qué es la Tutoría Académica?</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3 font-medium text-slate-700">
                  Es un espacio de acompañamiento continuo y personalizado que te brindan los docentes de nuestra escuela. Nuestro propósito es guiarte en tu vida universitaria para potenciar tus habilidades académicas y personales.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Queremos ayudarte a superar cualquier dificultad de aprendizaje y brindarte la orientación necesaria en los aspectos psicosociales y afectivos para asegurar tu bienestar y el éxito en tu carrera profesional.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#010080] font-semibold">
                <span>Orientación Académica EPIIS</span>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[10px] font-bold">Apoyo al Estudiante</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#010080]/30 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center mb-4">
                <Award size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#010080] mb-3">Acompañamiento y Compromiso</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Buscamos que tu paso por la universidad sea una experiencia integral y enriquecedora. Por ello, el programa está estructurado para brindarte el respaldo que necesitas en momentos clave:
              </p>
              <ul className="space-y-3.5 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-yellow-600 shrink-0 mt-0.5" />
                  <span><strong>Apoyo en Rendimiento:</strong> Si tienes matrícula condicionada o estás en observación, este programa es tu principal aliado para recuperar tu ritmo académico, ayudándote de forma prioritaria.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-yellow-600 shrink-0 mt-0.5" />
                  <span><strong>Atención Dedicada:</strong> Para garantizar un trato cercano y de calidad, cada docente atiende a un grupo máximo de 25 estudiantes, asegurando tiempo suficiente para tus consultas.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Dimensiones de la Tutoría */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-[#010080] flex items-center gap-2">
              <Compass size={20} className="text-[#010080]" /> Dimensiones de la Actividad Tutorial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#010080]/40 border-t-4 border-t-[#010080] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <h4 className="text-sm font-bold text-[#010080] mb-2 flex items-center gap-1.5">
                  <GraduationCap size={16} className="text-[#010080]" /> Dimensión Académica
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Orientación enfocada en las exigencias curriculares de los cursos, desarrollo de técnicas y hábitos de estudio eficaces, diagnóstico de estilos de aprendizaje y toma de decisiones sobre tu plan de estudios.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-yellow-500 border-x border-b border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <h4 className="text-sm font-bold text-[#010080] mb-2 flex items-center gap-1.5">
                  <Users size={16} className="text-yellow-600" /> Dimensión Personal
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fomenta el autoconocimiento, la aceptación personal, habilidades sociales, comunicación interpersonal, la resiliencia y el trabajo en equipo con tus compañeros de clase.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-slate-700 border-x border-b border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <h4 className="text-sm font-bold text-[#010080] mb-2 flex items-center gap-1.5">
                  <Clock size={16} className="text-slate-700" /> Dimensión Profesional
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Apoyo para descubrir tus intereses y aptitudes profesionales, orientación en inserción laboral, prácticas preprofesionales y compresión del impacto académico en tu futuro desarrollo en el sector informático.
                </p>
              </div>

            </div>
          </section>

          {/* Línea de Tiempo de Procesos Clave (RF-02) - Rediseño Premium */}
          <section id="timeline" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6 hover:shadow-md transition-shadow duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#010080] mb-1">Momentos Clave en el Semestre</h3>
              <p className="text-xs text-slate-500">De acuerdo al Reglamento (Art. 12.3), se establecen tres fases de interacción obligatoria durante cada periodo lectivo.</p>
            </div>

            {/* Grid de Pasos Interactivo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              {momentosSemestre.map((moment) => {
                const isActive = moment.id === activeMoment;
                const getIcon = (id) => {
                  switch (id) {
                    case 1: return <Sparkles size={16} />;
                    case 2: return <Clock size={16} />;
                    case 3: return <Award size={16} />;
                    default: return <Calendar size={16} />;
                  }
                };
                return (
                  <button
                    key={moment.id}
                    onClick={() => setActiveMoment(moment.id)}
                    onMouseEnter={() => setActiveMoment(moment.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${isActive
                      ? 'bg-gradient-to-br from-white to-blue-50/20 border-[#010080] shadow-md ring-2 ring-blue-100'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors shrink-0 ${isActive ? 'bg-[#010080] text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                        {getIcon(moment.id)}
                      </div>
                      <div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider block ${isActive ? 'text-[#010080]' : 'text-slate-400'
                          }`}>
                          Fase 0{moment.id}
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-800 -mt-0.5">{moment.titulo}</h4>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{moment.subtitulo}</p>
                  </button>
                );
              })}
            </div>

            {/* Detalle del Momento seleccionado */}
            {infoMoment && (
              <div className="p-5 bg-gradient-to-br from-slate-50 to-blue-50/10 rounded-2xl border-2 border-slate-100 animate-fade-in space-y-3 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase text-[#010080] tracking-wider bg-blue-50 px-2.5 py-1 rounded-md self-start">
                    Hito #{infoMoment.id}: {infoMoment.titulo}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm self-start">
                    <Calendar size={11} className="text-amber-700" /> {infoMoment.baseLegal}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800">{infoMoment.subtitulo}</h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{infoMoment.descripcion}</p>

                {/* Indicador visual de progreso */}
                <div className="pt-2">
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#010080] to-[#8f791f] h-full rounded-full transition-all duration-500"
                      style={{ width: `${(infoMoment.id / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Reglamento Navegable por Perfiles (RF-01) */}
          <section id="reglamento" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#010080] mb-1">Reglamento Navegable de Tutoría</h3>
                <p className="text-xs text-slate-500">Consulta los artículos oficiales filtrados según tu rol en el programa tutorial.</p>
              </div>

              {/* Selectores de Perfil (Filtro Mejorado) */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Filtrar reglamento por:</span>
                <div className="flex flex-wrap gap-1 bg-slate-150 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => { setActiveProfile('completo'); setSelectedArtId('Art. 1°'); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeProfile === 'completo'
                      ? 'bg-[#010080] text-white shadow-sm hover:bg-[#010080]/90'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-800'
                      }`}
                  >
                    <BookOpen size={12} />
                    Completo
                  </button>
                  <button
                    onClick={() => { setActiveProfile('estudiante'); setSelectedArtId('Art. 3°'); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeProfile === 'estudiante'
                      ? 'bg-[#010080] text-white shadow-sm hover:bg-[#010080]/90'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-800'
                      }`}
                  >
                    <GraduationCap size={12} />
                    Estudiantes
                  </button>
                  <button
                    onClick={() => { setActiveProfile('tutor'); setSelectedArtId('Art. 3°'); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeProfile === 'tutor'
                      ? 'bg-[#010080] text-white shadow-sm hover:bg-[#010080]/90'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-800'
                      }`}
                  >
                    <Users size={12} />
                    Tutores
                  </button>
                  <button
                    onClick={() => { setActiveProfile('comite'); setSelectedArtId('Art. 1°'); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeProfile === 'comite'
                      ? 'bg-[#010080] text-white shadow-sm hover:bg-[#010080]/90'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-800'
                      }`}
                  >
                    <Award size={12} />
                    Comité/Dir.
                  </button>
                </div>
              </div>
            </div>

            {/* Vista Escritorio: Dos columnas */}
            <div className="hidden md:grid grid-cols-3 gap-6">
              {/* Columna lateral: Listado de Artículos */}
              <div className="col-span-1 max-h-[350px] overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1 bg-white">
                {articulosFiltrados.map((art) => {
                  const isSelected = art.id === selectedArtId;
                  return (
                    <button
                      key={art.id}
                      onClick={() => setSelectedArtId(art.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all flex items-center justify-between group cursor-pointer ${isSelected
                        ? 'bg-blue-50 text-[#010080] font-extrabold border-l-3 border-yellow-500 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                      <span className="truncate">{art.id} - {art.titulo}</span>
                      <ChevronRight size={12} className={`shrink-0 transition-transform ${isSelected ? 'text-[#010080] translate-x-0.5' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Columna principal: Detalle del artículo seleccionado */}
              <div className="col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-sm transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                    <span className="text-xs font-extrabold text-[#010080] uppercase tracking-wide">
                      {articuloSeleccionado.capitulo}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-[10px] font-bold border border-yellow-200">
                      {articuloSeleccionado.id}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#010080] mb-2">{articuloSeleccionado.titulo}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                    {articuloSeleccionado.contenido}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Relevancia: {articuloSeleccionado.roles.map(r => r.toUpperCase()).join(' | ')}</span>
                  <a href="#timeline" className="text-[#010080] hover:underline flex items-center gap-0.5 font-bold transition-colors">
                    Ver procesos <ArrowUpRight size={11} />
                  </a>
                </div>
              </div>
            </div>

            {/* Vista Celular: Acordeón Adaptativo */}
            <div className="block md:hidden space-y-2">
              {articulosFiltrados.map((art) => {
                const isExpanded = art.id === selectedArtId;
                return (
                  <div
                    key={art.id}
                    className={`border rounded-xl overflow-hidden bg-white transition-all duration-200 ${isExpanded ? 'border-[#010080] shadow-sm' : 'border-slate-200'
                      }`}
                  >
                    <button
                      onClick={() => setSelectedArtId(isExpanded ? null : art.id)}
                      className={`w-full text-left px-4 py-3.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${isExpanded ? 'bg-blue-50/50 text-[#010080] border-b border-slate-200' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      <span className="truncate pr-2">{art.id} - {art.titulo}</span>
                      <ChevronRight size={14} className={`shrink-0 transition-transform ${isExpanded ? 'rotate-90 text-[#010080]' : 'text-slate-400'}`} />
                    </button>
                    {isExpanded && (
                      <div className="p-4 bg-slate-50/80 space-y-3 animate-fade-in">
                        <span className="text-[10px] font-extrabold text-[#010080] uppercase tracking-wide block">
                          {art.capitulo}
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                          {art.contenido}
                        </p>
                        <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400">
                          <span>Relevancia: {art.roles.map(r => r.toUpperCase()).join(' | ')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Docentes Tutores del Programa */}
          <section id="tutores" className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[#010080] mb-1">Docentes Tutores de la Carrera</h3>
              <p className="text-xs text-slate-500">Miembros acreditados para la tutoría en Ingeniería Informática y de Sistemas de la UNSAAC.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {listaTutores.map((tut, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-[#010080]/20 hover:border-[#010080] hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    {/* Initials Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#010080]/10 to-[#010080]/20 text-[#010080] font-extrabold text-sm flex items-center justify-center border border-[#010080]/15 shrink-0 shadow-inner">
                      {tut.iniciales}
                    </div>
                    {/* Name and Role */}
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-extrabold text-[#010080] leading-tight">{tut.nombre}</h4>
                      <span className="text-[10px] text-slate-500 font-medium block">
                        Docente Tutor
                      </span>
                    </div>
                  </div>
                  {/* Enlace para enviar un correo de consulta directa al docente tutor */}
                  <div className="flex items-center gap-2 text-[11px] border-t border-slate-100 pt-3 mt-4">
                    <Mail size={14} className="text-[#061D6F] shrink-0" />
                    <a href={`mailto:${tut.correo}`} className="text-[#010080] hover:text-[#061D6F] hover:underline font-bold transition-colors">
                      {tut.correo}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Preguntas Frecuentes (FAQ) */}
          <section id="faq" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-bold text-[#010080] mb-1">Preguntas Frecuentes</h3>

            <div className="space-y-3">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-[#010080] shrink-0" />
                  ¿Tengo tutoría si no estoy en matrícula condicionada?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-5 font-medium">
                  Sí. De acuerdo con el reglamento, todos los estudiantes de pregrado tienen un tutor asignado desde el inicio de sus estudios hasta el fin de la carrera (Art. 14°). Es obligatorio reunirse al menos en los 3 momentos clave.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-[#010080] shrink-0" />
                  ¿Puedo cambiar de tutor académico asignado?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-5 font-medium">
                  Sí. Puedes solicitar el cambio de forma razonada y sustentada ante el Comité Tutorial de tu Escuela Profesional (Art. 14.3). El Comité resolverá previa audiencia con el docente implicado.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-[#010080] shrink-0" />
                  ¿Qué pasa si tengo problemas personales graves que afectan mis estudios?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-5 font-medium">
                  El reglamento (Art. 10.4 & Art. 13.9) faculta al tutor a derivarte formalmente a la Unidad de Bienestar Universitario de la UNSAAC para brindarte atención psicopedagógica o social especializada.
                </p>
              </div>
            </div>
          </section>

          {/* Aviso de Confidencialidad y Protección de Datos */}
          <section className="bg-yellow-50/50 border border-yellow-200 rounded-2xl p-5 flex items-start gap-3.5 hover:shadow-sm transition-shadow">
            <ShieldAlert size={24} className="text-yellow-600 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h4 className="text-xs font-bold text-[#010080] mb-1">Aviso de Confidencialidad (Reglamento Art. 15°)</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Toda información compartida entre tutor y estudiante en las sesiones es estrictamente confidencial. Se encuentra protegida bajo la Ley de Protección de Datos Personales, asegurando la privacidad del expediente y la confianza del estudiante en todo el proceso.
              </p>
            </div>
          </section>

        </main>

        {/* LADO DERECHO: Panel del Chatbot Integrado en Escritorio (25%) */}
        <aside className="hidden lg:block lg:col-span-1 h-[600px] sticky top-22">
          <Chatbot />
        </aside>

      </div>

      {/* FOOTER INSTITUCIONAL */}
      <footer className="bg-[#010080] text-slate-200 border-t border-yellow-500 py-6 mt-12 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-white uppercase text-[10px] tracking-widest">
            Escuela Profesional de Ingeniería Informática y de Sistemas
          </p>
          <p>
            Universidad Nacional de San Antonio Abad del Cusco (UNSAAC) — Cusco, Perú
          </p>
          <p className="text-slate-300 text-[10px]">
            &copy; {new Date().getFullYear()} Facultad de Ingeniería Eléctrica, Electrónica, Informática y Mecánica.
          </p>
        </div>
      </footer>

      {/* WIDGET FLOTANTE / CHAT BOTÓN EN MÓVIL */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          /* Botón Flotante con efecto sutil (Píldora con Texto "DinoBot") */
          <button
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full border-3 border-[#DFB320] bg-white shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all relative"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
              <img src={DinoBot01} alt="DinoBot" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-extrabold text-[#010080] tracking-wide">DinoBot</span>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
            </span>
          </button>
        ) : (
          /* Overlay del chatbot flotante */
          <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[385px] h-full sm:h-[550px] z-50 flex flex-col bg-white rounded-none sm:rounded-2xl shadow-2xl border border-slate-200">
            <Chatbot isWidget={true} onCloseWidget={() => setChatOpen(false)} />
          </div>
        )}
      </div>

    </div>
  );
}
