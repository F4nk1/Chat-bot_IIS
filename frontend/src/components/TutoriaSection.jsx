import React, { useState, useEffect } from 'react';
import {
  Info, Clock, BookOpen, Users, HelpCircle, Sparkles, CheckCircle2,
  ShieldAlert, Compass, GraduationCap, Award, Calendar, ChevronRight,
  ChevronLeft, Copy, AlertCircle, MessageSquare, Mail, ExternalLink, Search
} from 'lucide-react';

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

// Lista de docentes tutores oficiales de Ingeniería Informática y de Sistemas (docentes.csv)
const docentesOficiales = [
  { id: "D001", nombre: "Nila Acurio Usca", correo: "nila.acurio@unsaac.edu.pe", cubiculo: "200", iniciales: "NA" },
  { id: "D002", nombre: "Doris Aguirre Carbajal", correo: "doris.aguirre@unsaac.edu.pe", cubiculo: "201", iniciales: "DA" },
  { id: "D003", nombre: "Robert Alzamora Paredes", correo: "robert.alzamora@unsaac.edu.pe", cubiculo: "202", iniciales: "RA" },
  { id: "D004", nombre: "Lino Baca Cardenas", correo: "lino.baca@unsaac.edu.pe", cubiculo: "203", iniciales: "LB" },
  { id: "D005", nombre: "Dennis Candia Oviedo", correo: "dennis.candia@unsaac.edu.pe", cubiculo: "204", iniciales: "DC" },
  { id: "D006", nombre: "Julio Carbajal Luna", correo: "julio.carbajal@unsaac.edu.pe", cubiculo: "205", iniciales: "JC" },
  { id: "D007", nombre: "Edwin Carrasco Poblete", correo: "edwin.carrasco@unsaac.edu.pe", cubiculo: "206", iniciales: "EC" },
  { id: "D008", nombre: "Hans Ccacyahuillca Bejar", correo: "hans.ccacyahuillca@unsaac.edu.pe", cubiculo: "207", iniciales: "HC" },
  { id: "D009", nombre: "Javier Chavez Centeno", correo: "javier.chavez@unsaac.edu.pe", cubiculo: "208", iniciales: "JC" },
  { id: "D010", nombre: "Vanessa Choque Soto", correo: "vanessa.choque@unsaac.edu.pe", cubiculo: "209", iniciales: "VC" },
  { id: "D011", nombre: "Boris Chullo Llave", correo: "boris.chullo@unsaac.edu.pe", cubiculo: "210", iniciales: "BC" },
  { id: "D012", nombre: "Stephan Cosio Loaiza", correo: "stephan.cosio@unsaac.edu.pe", cubiculo: "211", iniciales: "SC" },
  { id: "D013", nombre: "Efraina Cutipa Arapa", correo: "efraina.cutipa@unsaac.edu.pe", cubiculo: "212", iniciales: "EC" },
  { id: "D014", nombre: "Lisha Diaz Caceres", correo: "lisha.diaz@unsaac.edu.pe", cubiculo: "213", iniciales: "LD" },
  { id: "D015", nombre: "Dario Dueñas Bustinza", correo: "dario.duenas@unsaac.edu.pe", cubiculo: "214", iniciales: "DD" },
  { id: "D016", nombre: "Henry Dueñas De La Cruz", correo: "henry.duenas@unsaac.edu.pe", cubiculo: "215", iniciales: "HD" },
  { id: "D017", nombre: "Ray Dueñas Jimenez", correo: "ray.duenas@unsaac.edu.pe", cubiculo: "216", iniciales: "RD" },
  { id: "D018", nombre: "Elida Falcon Huallpa", correo: "elida.falcon@unsaac.edu.pe", cubiculo: "217", iniciales: "EF" },
  { id: "D019", nombre: "Lino Flores Pacheco", correo: "lino.flores@unsaac.edu.pe", cubiculo: "218", iniciales: "LF" },
  { id: "D020", nombre: "Jisbaj Gamarra Salas", correo: "jisbaj.gamarra@unsaac.edu.pe", cubiculo: "219", iniciales: "JG" },
  { id: "D021", nombre: "Raul Huillca Huallparimachi", correo: "raul.huillca@unsaac.edu.pe", cubiculo: "220", iniciales: "RH" },
  { id: "D022", nombre: "Waldo Ibarra Zambrano", correo: "waldo.ibarra@unsaac.edu.pe", cubiculo: "221", iniciales: "WI" },
  { id: "D023", nombre: "Maritza Irpanoca Cusimayta", correo: "maritza.irpanoca@unsaac.edu.pe", cubiculo: "222", iniciales: "MI" },
  { id: "D024", nombre: "Karelia Medina Miranda", correo: "karelia.medina@unsaac.edu.pe", cubiculo: "223", iniciales: "KM" },
  { id: "D025", nombre: "Ivan Medrano Valencia", correo: "ivan.medrano@unsaac.edu.pe", cubiculo: "224", iniciales: "IM" },
  { id: "D026", nombre: "Carlos Montoya Cubas", correo: "carlos.montoya@unsaac.edu.pe", cubiculo: "225", iniciales: "CM" },
  { id: "D027", nombre: "Luis Monzon Condori", correo: "luis.monzon@unsaac.edu.pe", cubiculo: "226", iniciales: "LM" },
  { id: "D028", nombre: "Yeshica Ormeño Ayala", correo: "yeshica.ormeno@unsaac.edu.pe", cubiculo: "227", iniciales: "YO" },
  { id: "D029", nombre: "Esther Pacheco Vasquez", correo: "esther.pacheco@unsaac.edu.pe", cubiculo: "228", iniciales: "EP" },
  { id: "D030", nombre: "Luis Palma Ttito", correo: "luis.palma@unsaac.edu.pe", cubiculo: "229", iniciales: "LP" },
  { id: "D031", nombre: "Emilio Palomino Olivera", correo: "emilio.palomino@unsaac.edu.pe", cubiculo: "230", iniciales: "EP" },
  { id: "D032", nombre: "Manuel Aurelio Peñaloza Figueroa", correo: "manuel.penaloza@unsaac.edu.pe", cubiculo: "231", iniciales: "MP" },
  { id: "D033", nombre: "Jose Pillco Quispe", correo: "jose.pillco@unsaac.edu.pe", cubiculo: "232", iniciales: "JP" },
  { id: "D034", nombre: "Carlos Quispe Onofre", correo: "carlos.quispe@unsaac.edu.pe", cubiculo: "233", iniciales: "CQ" },
  { id: "D035", nombre: "Julio Quispe Sota", correo: "julio.quispe@unsaac.edu.pe", cubiculo: "234", iniciales: "JQ" },
  { id: "D036", nombre: "Javier Rozas Huacho", correo: "javier.rozas@unsaac.edu.pe", cubiculo: "235", iniciales: "JR" },
  { id: "D037", nombre: "Liseth Segundo Carpio", correo: "liseth.segundo@unsaac.edu.pe", cubiculo: "236", iniciales: "LS" },
  { id: "D038", nombre: "Jose Soncco Alvarez", correo: "jose.soncco@unsaac.edu.pe", cubiculo: "237", iniciales: "JS" },
  { id: "D039", nombre: "Victor Sosa Jauregui", correo: "victor.sosa@unsaac.edu.pe", cubiculo: "238", iniciales: "VS" },
  { id: "D040", nombre: "Guzman Ticona Pari", correo: "guzman.ticona@unsaac.edu.pe", cubiculo: "239", iniciales: "GT" },
  { id: "D041", nombre: "Hector Ugarte Rojas", correo: "hector.ugarte@unsaac.edu.pe", cubiculo: "240", iniciales: "HU" },
  { id: "D042", nombre: "Maria Venegas Vergara", correo: "maria.venegas@unsaac.edu.pe", cubiculo: "241", iniciales: "MV" },
  { id: "D043", nombre: "Harley Vera Olivera", correo: "harley.vera@unsaac.edu.pe", cubiculo: "242", iniciales: "HV" },
  { id: "D044", nombre: "Rony Villafuerte Serna", correo: "rony.villafuerte@unsaac.edu.pe", cubiculo: "243", iniciales: "RV" },
  { id: "D045", nombre: "Tany Villalba Villalba", correo: "tany.villalba@unsaac.edu.pe", cubiculo: "244", iniciales: "TV" },
  { id: "D046", nombre: "Willian Zamalloa Paro", correo: "willian.zamalloa@unsaac.edu.pe", cubiculo: "245", iniciales: "WZ" },
  { id: "D047", nombre: "Gabriela Zuñiga Rojas", correo: "gabriela.zuniga@unsaac.edu.pe", cubiculo: "246", iniciales: "GZ" }
];


export default function TutoriaSection({ subTab = 'inicio', onSubTabChange = null }) {
  const [activeSubTab, setActiveSubTab] = useState(subTab); // 'inicio', 'momentos', 'reglamento', 'tutores', 'faq'

  useEffect(() => {
    if (subTab) setActiveSubTab(subTab);
  }, [subTab]);

  const handleSelectSubTab = (key) => {
    setActiveSubTab(key);
    if (onSubTabChange) onSubTabChange(key);
  };
  const [activeMoment, setActiveMoment] = useState(1);
  const [activeProfile, setActiveProfile] = useState('completo');
  const [selectedArtId, setSelectedArtId] = useState('Art. 1°');

  // Estado para el buscador y paginador de docentes
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Filtrar docentes por nombre, correo o cubículo
  const queryLower = (searchQuery || '').toLowerCase().trim();
  const tutoresFiltrados = docentesOficiales.filter(t => {
    if (!queryLower) return true;
    const nombre = (t.nombre || '').toLowerCase();
    const correo = (t.correo || '').toLowerCase();
    const cubiculo = String(t.cubiculo || '');
    return nombre.includes(queryLower) || correo.includes(queryLower) || cubiculo.includes(queryLower);
  });

  const totalPages = Math.ceil(tutoresFiltrados.length / pageSize) || 1;
  const currentPageValid = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (currentPageValid - 1) * pageSize;
  const tutoresPaginados = tutoresFiltrados.slice(startIndex, startIndex + pageSize);

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
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner Tutorías */}
      <section className="bg-gradient-to-r from-[#010080] via-[#000066] to-[#00004c] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border-l-8 border-yellow-500">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 mb-4 border border-yellow-500/30">
            <Sparkles size={14} /> Portal Oficial de Orientación
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            Orientación y Acompañamiento Académico para tu éxito
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            Descubre cómo funciona el programa de tutorías de Ingeniería Informática y de Sistemas de la UNSAAC. Encuentra reglamentos, fases del ciclo y la guía necesaria para tu desarrollo profesional.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveSubTab('reglamento')}
              className="bg-yellow-500 hover:bg-[#DFB320] text-[#061D6F] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 hover:scale-105"
            >
              <BookOpen size={15} /> Explorar Reglamento
            </button>
            <button
              onClick={() => setActiveSubTab('tutores')}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border border-white/20 flex items-center gap-2"
            >
              <Users size={15} /> Ver Docentes Tutores
            </button>
          </div>
        </div>
        {/* Fondo geométrico sutil */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4 translate-x-1/4">
          <GraduationCap size={350} />
        </div>
      </section>

      {/* Sub-navegador Interno de Tutorías con Íconos */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('inicio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'inicio'
              ? 'bg-[#010080] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Info size={16} /> ¿Qué es la Tutoría?
        </button>
        <button
          onClick={() => setActiveSubTab('momentos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'momentos'
              ? 'bg-[#010080] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock size={16} /> Momentos Clave
        </button>
        <button
          onClick={() => setActiveSubTab('reglamento')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'reglamento'
              ? 'bg-[#010080] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen size={16} /> Reglamento
        </button>
        <button
          onClick={() => setActiveSubTab('tutores')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'tutores'
              ? 'bg-[#010080] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users size={16} /> Docentes Tutores
        </button>
        <button
          onClick={() => setActiveSubTab('faq')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'faq'
              ? 'bg-[#010080] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HelpCircle size={16} /> Preguntas Frecuentes
        </button>
      </div>

      {/* PESTAÑA 1: ¿QUÉ ES Y DIMENSIONES? */}
      {activeSubTab === 'inicio' && (
        <div key="inicio" className="space-y-8 animate-fadeIn">
          {/* ¿Qué es la tutoría académica y Objetivos? */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#010080]/30 animate-highlight hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#010080] flex items-center justify-center mb-4 font-bold">
                  <Info size={20} />
                </div>
                <h3 className="text-lg font-bold text-[#010080] mb-3">¿Qué es la Tutoría Académica?</h3>
                <p className="text-xs text-slate-700 leading-relaxed mb-3 font-medium">
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

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#010080]/30 animate-highlight hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center mb-4 font-bold">
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

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-yellow-500/40 border-t-4 border-t-yellow-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <h4 className="text-sm font-bold text-[#010080] mb-2 flex items-center gap-1.5">
                  <Users size={16} className="text-yellow-600" /> Dimensión Personal
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Refuerzo de la autoconfianza, aceptación propia, desarrollo de la responsabilidad, habilidades de comunicación efectiva y manejo de situaciones socioafectivas durante tu trayectoria universitaria.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-500/40 border-t-4 border-t-emerald-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <h4 className="text-sm font-bold text-[#010080] mb-2 flex items-center gap-1.5">
                  <Award size={16} className="text-emerald-600" /> Dimensión Profesional
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Acompañamiento en la identificación de tus intereses y aptitudes vocacionales, orientación sobre campos laborales en informática y sistemas, prácticas preprofesionales e inserción profesional.
                </p>
              </div>

            </div>
          </section>
        </div>
      )}

      {/* PESTAÑA 2: MOMENTOS CLAVE (LÍNEA DE TIEMPO) */}
      {activeSubTab === 'momentos' && (
        <section key="momentos" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#010080]/30 space-y-6 animate-fadeIn animate-highlight transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#010080] flex items-center gap-2">
                <Calendar size={20} className="text-[#010080]" /> Línea de Tiempo del Semestre
              </h3>
              <p className="text-xs text-slate-500">Conoce cuándo se realizan las sesiones tutoriales obligatorias según el reglamento (Art. 12°)</p>
            </div>
            <span className="text-[11px] font-semibold text-[#010080] bg-blue-50 px-3 py-1 rounded-full border border-blue-100 self-start sm:self-auto">
              3 Momentos Clave por Semestre
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {momentosSemestre.map((moment) => {
              const isActive = activeMoment === moment.id;
              return (
                <button
                  key={moment.id}
                  onClick={() => setActiveMoment(moment.id)}
                  onMouseEnter={() => setActiveMoment(moment.id)}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 relative cursor-pointer hover:-translate-y-1 hover:shadow-md ${
                    isActive
                      ? 'border-[#010080] bg-[#010080]/5 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-[#010080]/40 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                      isActive ? 'bg-[#010080] text-white shadow-xs' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {moment.id}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold text-[#010080] bg-blue-100/80 px-2 py-0.5 rounded-full">
                        Seleccionado
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">{moment.titulo}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{moment.subtitulo}</p>
                </button>
              );
            })}
          </div>

          {/* Detalle del Momento Seleccionado */}
          {(() => {
            const current = momentosSemestre.find(m => m.id === activeMoment) || momentosSemestre[0];
            return (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#010080] uppercase tracking-wider">
                    {current.titulo} — {current.subtitulo}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">{current.baseLegal}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {current.descripcion}
                </p>
              </div>
            );
          })()}
        </section>
      )}

      {/* PESTAÑA 3: REGLAMENTO ESTRUCTURADO */}
      {activeSubTab === 'reglamento' && (
        <section key="reglamento" className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#010080]/30 space-y-6 animate-fadeIn animate-highlight transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#010080] flex items-center gap-2">
                <BookOpen size={20} className="text-[#010080]" /> Reglamento General de Tutoría UNSAAC
              </h3>
              <p className="text-xs text-slate-500">Resolución CU-0220-2017-UNSAAC — Consulta oficial de normas y artículos</p>
            </div>
            
            {/* Filtros por Perfil/Rol */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start md:self-auto">
              <button
                onClick={() => setActiveProfile('completo')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeProfile === 'completo' ? 'bg-[#010080] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveProfile('estudiante')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeProfile === 'estudiante' ? 'bg-[#010080] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Estudiante
              </button>
              <button
                onClick={() => setActiveProfile('tutor')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeProfile === 'tutor' ? 'bg-[#010080] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tutor
              </button>
              <button
                onClick={() => setActiveProfile('comite')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeProfile === 'comite' ? 'bg-[#010080] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Comité
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Lista de Artículos (Izquierda) */}
            <div className="lg:col-span-5 space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {articulosFiltrados.map((art) => {
                const isSelected = selectedArtId === art.id;
                return (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArtId(art.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between hover:-translate-x-0.5 ${
                      isSelected
                        ? 'border-[#010080] bg-[#010080]/5 font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:border-[#010080]/40 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-extrabold ${isSelected ? 'text-[#010080]' : 'text-slate-800'}`}>
                          {art.id}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{art.capitulo}</span>
                      </div>
                      <p className="text-xs font-mono text-slate-700 font-medium line-clamp-1 mt-0.5">{art.titulo}</p>
                    </div>
                    <ChevronRight size={16} className={`shrink-0 ${isSelected ? 'text-[#010080]' : 'text-slate-300'}`} />
                  </div>
                );
              })}
            </div>

            {/* Lectura Detallada del Artículo (Derecha - Tipografía Estilo Máquina de Escribir / Courier Monospace) */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {articuloSeleccionado.capitulo}
                    </span>
                    <h4 className="text-base font-mono font-bold text-[#010080] tracking-tight">
                      {articuloSeleccionado.id} — {articuloSeleccionado.titulo}
                    </h4>
                  </div>
                  <span className="text-[10px] bg-yellow-100 text-yellow-800 border border-yellow-300 px-2 py-0.5 rounded-full font-bold">
                    Res. CU-0220-2017
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <p className="text-xs font-mono text-slate-800 leading-relaxed font-normal tracking-tight">
                    {articuloSeleccionado.contenido}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Aplicable a: <strong className="text-slate-800 capitalize">{articuloSeleccionado.roles.join(", ")}</strong></span>
                <span className="text-[#010080] font-bold font-mono">EP-IIS UNSAAC</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PESTAÑA 4: DOCENTES TUTORES */}
      {activeSubTab === 'tutores' && (
        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#010080]/30 space-y-6 animate-fadeIn">
          {/* Cabecera y Buscador por Nombre */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#010080] flex items-center gap-2">
                <Users size={20} className="text-[#010080]" /> Planta de Docentes Tutores
              </h3>
              <p className="text-xs text-slate-500">
                Docentes adscritos a la Escuela Profesional de Ingeniería Informática y de Sistemas ({tutoresFiltrados.length} docentes)
              </p>
            </div>

            {/* Input Buscador */}
            <div className="relative min-w-[240px]">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar docente por nombre..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#010080] focus:bg-white transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Grid de Tarjetas (Máximo 6 por página) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tutoresPaginados.map((tutor) => (
              <div key={tutor.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-3 hover:shadow-md hover:border-[#010080]/30 transition-all">
                <div className="w-10 h-10 rounded-full bg-[#010080] text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs border border-yellow-500/30">
                  {tutor.iniciales}
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug truncate" title={tutor.nombre}>
                    {tutor.nombre}
                  </h4>
                  <span className="text-[10px] text-yellow-800 bg-yellow-100/80 border border-yellow-300/80 px-2 py-0.5 rounded font-extrabold inline-block">
                    Cubículo: {tutor.cubiculo}
                  </span>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(tutor.correo)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-[#010080] hover:text-blue-800 hover:underline flex items-center gap-1 pt-0.5 font-medium group"
                    title="Redactar correo en Gmail"
                  >
                    <Mail size={12} className="text-[#010080] shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="truncate">{tutor.correo}</span>
                    <ExternalLink size={10} className="opacity-60 shrink-0" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Mensaje de Sin Resultados */}
          {tutoresFiltrados.length === 0 && (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Users size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs text-slate-600 font-medium">No se encontraron docentes coincidentes con "{searchQuery}"</p>
            </div>
          )}

          {/* Paginador Inteligente (← 1 2 3 ... 8 →) */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Página <strong>{currentPageValid}</strong> de <strong>{totalPages}</strong> ({tutoresFiltrados.length} docentes encontrados)
              </span>

              <div className="flex items-center gap-1">
                {/* Flecha Anterior ← */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPageValid === 1}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>

                {/* Números de página */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentPageValid === page
                          ? 'bg-[#010080] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Flecha Siguiente → */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPageValid === totalPages}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* PESTAÑA 5: PREGUNTAS FRECUENTES (FAQ) */}
      {activeSubTab === 'faq' && (
        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#010080]/30 space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-[#010080] flex items-center gap-2">
              <HelpCircle size={20} className="text-[#010080]" /> Preguntas Frecuentes
            </h3>
            <p className="text-xs text-slate-500">Respuestas rápidas a las dudas comunes sobre el sistema tutorial</p>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <HelpCircle size={14} className="text-[#010080] shrink-0" />
                ¿La tutoría académica es obligatoria?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium pl-5">
                La tutoría es obligatoria para los estudiantes con <strong>matrícula condicionada</strong> (quienes hayan desaprobado una asignatura por segunda vez). Para los demás estudiantes es un derecho formativo altamente recomendado.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <HelpCircle size={14} className="text-[#010080] shrink-0" />
                ¿Puedo solicitar cambio de tutor académico?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium pl-5">
                Sí. De acuerdo con el Art. 14° del reglamento, si existen motivos justificados puedes presentar una solicitud fundamentada ante el Comité Tutorial de la Escuela Profesional.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <HelpCircle size={14} className="text-[#010080] shrink-0" />
                ¿Qué pasa si tengo problemas personales graves que afectan mis estudios?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium pl-5">
                El reglamento (Art. 10.4 & Art. 13.9) faculta al tutor a derivarte formalmente a la Unidad de Bienestar Universitario de la UNSAAC para brindarte atención psicopedagógica o social especializada.
              </p>
            </div>
          </div>

          {/* Aviso de Confidencialidad */}
          <div className="bg-yellow-50/60 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
            <ShieldAlert size={20} className="text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#010080] mb-1">Aviso de Confidencialidad (Reglamento Art. 15°)</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Toda información compartida entre tutor y estudiante en las sesiones es estrictamente confidencial. Se encuentra protegida bajo la Ley de Protección de Datos Personales.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
