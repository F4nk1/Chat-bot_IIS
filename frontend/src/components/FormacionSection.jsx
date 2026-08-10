import React, { useState, useEffect } from 'react';
import {
  BookOpen, Briefcase, GraduationCap, ExternalLink, Sparkles,
  CheckCircle2, FileText, Award, ShieldCheck, Download, Code,
  Cpu, Layers, FileCheck, School
} from 'lucide-react';

export default function FormacionSection({ subTab = 'malla', onSubTabChange = null }) {
  const [activeSubTab, setActiveSubTab] = useState(subTab);

  useEffect(() => {
    if (subTab) setActiveSubTab(subTab);
  }, [subTab]);

  const handleSelectSubTab = (key) => {
    setActiveSubTab(key);
    if (onSubTabChange) onSubTabChange(key);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner Formación Profesional */}
      <section className="bg-gradient-to-r from-[#010080] via-[#000066] to-[#00004c] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border-l-8 border-yellow-500">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 mb-4 border border-yellow-500/30">
            <Sparkles size={14} /> Escuela Profesional de Ingeniería Informática y de Sistemas
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            Formación Profesional y Plan Académico
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
            Estructura curricular de la carrera, requisitos para el desarrollo de tus Prácticas Preprofesionales y los hitos fundamentales para la obtención de tu Grado de Bachiller y Título Profesional.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://in.unsaac.edu.pe/malla-curricular/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-500 hover:bg-[#DFB320] text-[#010080] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 hover:scale-105"
            >
              <ExternalLink size={15} /> Portal de Malla Curricular EPIIS
            </a>
            <a
              href="https://in.unsaac.edu.pe/wp-content/uploads/2025/03/plan-estudios-ing-informatica-2025.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border border-white/20 flex items-center gap-2"
            >
              <Download size={15} /> Descargar Plan de Estudios 2025 (PDF)
            </a>
          </div>
        </div>

        {/* Fondo gráfico decorativo */}
        <div className="absolute -right-6 -bottom-14 opacity-15 pointer-events-none transform -rotate-12">
          <GraduationCap size={320} />
        </div>
      </section>

      {/* Sub-navegador Interno de Formación Profesional */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => handleSelectSubTab('malla')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === 'malla'
            ? 'bg-[#010080] text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <BookOpen size={16} /> Plan de Estudios y Malla
        </button>
        <button
          onClick={() => handleSelectSubTab('practicas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === 'practicas'
            ? 'bg-[#010080] text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <Briefcase size={16} /> Prácticas Preprofesionales (PPP)
        </button>
        <button
          onClick={() => handleSelectSubTab('titulacion')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === 'titulacion'
            ? 'bg-[#010080] text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <GraduationCap size={16} /> Egreso y Titulación
        </button>
      </div>

      {/* PESTAÑA 1: PLAN DE ESTUDIOS Y MALLA */}
      {activeSubTab === 'malla' && (
        <div key="malla" className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#010080]/30 space-y-6 animate-highlight hover:shadow-md transition-all duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#010080]">Estructura Curricular y Malla Académica</h3>
              <p className="text-xs text-slate-500 font-medium">Planes de estudio vigentes para la formación de Ingenieros Informáticos y de Sistemas</p>
            </div>

            {/* Tarjetas de Mallas Oficiales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 hover:shadow-md transition-all">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">Plan Vigente</span>
                <h4 className="text-sm font-bold text-[#010080]">Plan de Estudios 2025</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Currículo oficial aprobado mediante Res. CU-031-2025-UNSAAC. Incorpora asignaturas actualizadas en IA, Computación en la Nube y Ciberseguridad.
                </p>
                <a
                  href="https://in.unsaac.edu.pe/wp-content/uploads/2025/03/plan-estudios-ing-informatica-2025.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#010080] hover:underline pt-1"
                >
                  Descargar Malla 2025 (PDF) <ExternalLink size={13} />
                </a>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 hover:shadow-md transition-all">
                <span className="text-[10px] font-bold text-slate-700 bg-slate-200 border border-slate-300 px-2 py-0.5 rounded">Plan 2017</span>
                <h4 className="text-sm font-bold text-slate-900">Plan de Estudios 2017</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Plan curricular estructurado por competencias profesionales. Aplicable a estudiantes ingresantes entre los periodos 2017 y 2024.
                </p>
                <a
                  href="https://in.unsaac.edu.pe/wp-content/uploads/2025/03/malla-curricular-ing-informatica-2017.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:underline pt-1"
                >
                  Consultar Plan 2017 <ExternalLink size={13} />
                </a>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 hover:shadow-md transition-all">
                <span className="text-[10px] font-bold text-slate-700 bg-slate-200 border border-slate-300 px-2 py-0.5 rounded">Plan 1997</span>
                <h4 className="text-sm font-bold text-slate-900">Plan de Estudios 1997</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Plan de formación histórico para estudiantes adscritos bajo la normativa previa.
                </p>
                <a
                  href="https://in.unsaac.edu.pe/wp-content/uploads/2025/05/5.-MallaCurricular-1997.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:underline pt-1"
                >
                  Consultar Plan 1997 <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* Áreas de Especialización Curricular */}
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-5 rounded-xl border border-blue-200 space-y-3">
              <h4 className="text-xs font-bold text-[#010080] uppercase tracking-wider flex items-center gap-2">
                <Layers size={16} className="text-[#010080]" /> Áreas de Formación Profesional EPIIS
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-medium">
                  <strong className="block text-[#010080] mb-0.5">Ingeniería de Software</strong>
                  Desarrollo Web, Móvil, Arquitectura de Software y DevOps.
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-medium">
                  <strong className="block text-[#010080] mb-0.5">Ciencias de la Computación</strong>
                  Algoritmos, Estructuras de Datos y Computación Gráfica.
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-medium">
                  <strong className="block text-[#010080] mb-0.5">Inteligencia Artificial</strong>
                  Machine Learning, Deep Learning y Minería de Datos.
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-medium">
                  <strong className="block text-[#010080] mb-0.5">Redes y Ciberseguridad</strong>
                  Sistemas Operativos, Redes de Computadoras y Seguridad Digital.
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-medium">
                  <strong className="block text-[#010080] mb-0.5">Gestión de TI y Sistemas</strong>
                  Gestión de Proyectos, Inteligencia de Negocios y Auditoría de Sistemas.
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-medium">
                  <strong className="block text-[#010080] mb-0.5">Ciencias Básicas</strong>
                  Matemáticas Discretas, Cálculo, Física y Estadística.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: PRÁCTICAS PREPROFESIONALES (PPP) */}
      {activeSubTab === 'practicas' && (
        <div key="practicas" className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#010080]/30 space-y-6 animate-highlight hover:shadow-md transition-all duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#010080]">Prácticas Preprofesionales (PPP)</h3>
              <p className="text-xs text-slate-500 font-medium">Requisitos y trámites para la inserción laboral y validación académica de tus prácticas</p>
            </div>

            {/* Cuadro de Requisitos Clave */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-[#010080] font-bold text-sm">
                <ShieldCheck size={20} className="text-[#010080]" /> Requisitos Obligatorios (Plan 2025 - Art. 112°)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-medium">
                <div className="bg-white p-3 rounded-lg border border-blue-100 flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Semestre Académico:</strong> Ubicadas oficialmente en el <strong>10° semestre</strong> del plan de estudios.
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-blue-100 flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Créditos Mínimos:</strong> Requisito de haber acumulado como mínimo <strong>180 créditos</strong> aprobados.
                  </div>
                </div>
              </div>
            </div>

            {/* Pasos para el Trámite de PPP */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-[#010080] uppercase tracking-wider flex items-center gap-2">
                <FileCheck size={16} className="text-yellow-600" /> Pasos del Trámite de Prácticas
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-700 font-medium">
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center mb-2">1</span>
                  <strong className="block text-slate-900 mb-1">Solicitud de Carta</strong>
                  Solicitar ante la Dirección de Escuela la Carta de Presentación dirigida a la empresa receptora.
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center mb-2">2</span>
                  <strong className="block text-slate-900 mb-1">Plan de Trabajo</strong>
                  Presentar el Plan de Trabajo de Prácticas detallando las actividades a desarrollar en el área de TI.
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center mb-2">3</span>
                  <strong className="block text-slate-900 mb-1">Ejecución</strong>
                  Realizar las horas de práctica reglamentarias en la entidad pública o privada acreditada.
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center mb-2">4</span>
                  <strong className="block text-slate-900 mb-1">Informe Final</strong>
                  Presentar el Informe Final de Prácticas adjuntando la Constancia emitida por la empresa para su evaluación.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: EGRESO Y TITULACIÓN */}
      {activeSubTab === 'titulacion' && (
        <div key="titulacion" className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#010080]/30 space-y-6 animate-highlight hover:shadow-md transition-all duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#010080]">Hitos de Egreso y Titulación Profesional</h3>
              <p className="text-xs text-slate-500 font-medium">Requisitos para la obtención del Grado Académico de Bachiller y Título Profesional</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Grado de Bachiller */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#010080] flex items-center justify-center font-bold">
                    <School size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#010080]">Grado de Bachiller</h4>
                    <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold">Primer Grado Académico</span>
                  </div>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 font-medium pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> Aprobar la totalidad de asignaturas y créditos del Plan de Estudios.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> Acreditar el nivel Intermedio de un idioma extranjero (o lengua nativa).
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> Elaboración y aprobación del Trabajo de Investigación.
                  </li>
                </ul>
              </div>

              {/* Título Profesional */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    <Award size={22} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Título Profesional de Ingeniero(a)</h4>
                    <span className="text-[10px] text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded font-bold">Ingeniero(a) Informático(a) y de Sistemas</span>
                  </div>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 font-medium pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> Poseer el Grado Académico de Bachiller registrado en SUNEDU.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> Aprobación y sustentación de Tesis Profesional en acto público.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> O Trabajo de Suficiencia Profesional (según modalidad habilitada).
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
