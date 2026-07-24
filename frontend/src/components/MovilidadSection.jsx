import React, { useState, useEffect } from 'react';
import {
  Globe, FileCheck, Award, Handshake, ExternalLink, Sparkles,
  CheckCircle2, ArrowRight, ShieldCheck, FileText, Compass,
  BookOpen, HelpCircle, AlertCircle, Building2, PlaneTakeoff,
  PlaneLanding, Mail, Plane
} from 'lucide-react';

export default function MovilidadSection({ subTab = 'modalidades', onSubTabChange = null }) {
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
      {/* Hero Banner Movilidad Estudiantil */}
      <section className="bg-gradient-to-r from-[#010080] via-[#000066] to-[#00004c] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border-l-8 border-yellow-500">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 mb-4 border border-yellow-500/30">
            <Sparkles size={14} /> Oficina de Cooperación y Relaciones Internacionales (OCTI)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            Movilidad Estudiantil e Internacionalización
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
            Realiza estancias académicas temporales en universidades nacionales y del extranjero. Desarrolla tus estudios de Ingeniería Informática y de Sistemas con reconocimiento académico mediante convenios institucionales.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://octi.unsaac.edu.pe/movilidad-saliente-outgoing/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-500 hover:bg-[#DFB320] text-[#010080] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 hover:scale-105"
            >
              <ExternalLink size={15} /> Ver Convocatorias Salientes (OCTI)
            </a>
            <a
              href="https://octi.unsaac.edu.pe/informacion-de-convenios-2025/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border border-white/20 flex items-center gap-2"
            >
              <Handshake size={15} /> Convenios Vigentes 2025
            </a>
          </div>
        </div>

        {/* Fondo gráfico decorativo de avión */}
        <div className="absolute -right-6 -bottom-14 opacity-15 pointer-events-none transform -rotate-12">
          <Plane size={320} />
        </div>
      </section>

      {/* Sub-navegador Interno de Movilidad */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => handleSelectSubTab('modalidades')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'modalidades'
              ? 'bg-[#010080] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Globe size={16} /> Modalidades de Movilidad
        </button>
        <button
          onClick={() => handleSelectSubTab('postulacion')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'postulacion'
              ? 'bg-[#010080] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileCheck size={16} /> Requisitos y Postulación
        </button>
        <button
          onClick={() => handleSelectSubTab('convalidacion')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'convalidacion'
              ? 'bg-[#010080] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award size={16} /> Convalidación de Cursos
        </button>
        <button
          onClick={() => handleSelectSubTab('convenios')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'convenios'
              ? 'bg-[#010080] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Handshake size={16} /> Convenios y Becas
        </button>
      </div>

      {/* PESTAÑA 1: MODALIDADES DE MOVILIDAD */}
      {activeSubTab === 'modalidades' && (
        <div key="modalidades" className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#010080]/30 space-y-6 animate-highlight hover:shadow-md transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#010080]">Modalidades del Programa de Movilidad Estudiantil</h3>
                <p className="text-xs text-slate-500 font-medium">Conoce las opciones de intercambio académico habilitadas para los estudiantes de la UNSAAC</p>
              </div>
            </div>

            {/* Aviso Institucional de Correo en Tiempo Real */}
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
              <Mail size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-950">
                  Canal Prioritario: Revisa tu Correo Institucional
                </h4>
                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                  El lanzamiento de nuevas convocatorias, pasantías e intercambios con plazos inmediatos de postulación se notifica de forma <strong>directa y prioritaria a tu correo institucional (@unsaac.edu.pe)</strong>. Se recomienda mantener una revisión frecuente de tu bandeja de entrada para postular a tiempo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Movilidad Saliente */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#010080] flex items-center justify-center font-bold">
                    <PlaneTakeoff size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#010080]">Movilidad Saliente (Outgoing)</h4>
                    <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold">Estudiantes UNSAAC</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Corresponde al estudiante regular de la UNSAAC que realiza un semestre o periodo lectivo temporal en otra universidad del Perú o del extranjero, de acuerdo con los convenios vigentes.
                </p>
                <div className="pt-2">
                  <a
                    href="https://octi.unsaac.edu.pe/movilidad-saliente-outgoing/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#010080] hover:underline"
                  >
                    Ver convocatorias salientes <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Movilidad Entrante */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <PlaneLanding size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Movilidad Entrante (Incoming)</h4>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">Estudiantes Visitantes</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Corresponde al estudiante de otra universidad nacional o extranjera que realiza estudios temporales en la UNSAAC. Su matrícula se efectúa como estudiante especial en virtud de un convenio.
                </p>
                <div className="pt-2">
                  <a
                    href="https://octi.unsaac.edu.pe/movilidad-entrante-2/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline"
                  >
                    Ver información para entrantes <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>

            {/* Clasificación por Ámbito Geográfico */}
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-5 rounded-xl border border-blue-200 space-y-3">
              <h4 className="text-xs font-bold text-[#010080] uppercase tracking-wider flex items-center gap-2">
                <Globe size={16} className="text-[#010080]" /> Ámbito del Intercambio
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 font-medium">
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                  <strong className="block text-slate-900 mb-1 text-xs">Movilidad Nacional</strong>
                  Estancias académicas en universidades peruanas en convenio (ejemplo: Universidad Peruana Cayetano Heredia, PUCP, UNMSM).
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                  <strong className="block text-slate-900 mb-1 text-xs">Movilidad Internacional</strong>
                  Intercambios académicos con instituciones de América Latina, Europa, Asia y Norteamérica amparadas por redes y convenios bilaterales.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: REQUISITOS Y POSTULACIÓN */}
      {activeSubTab === 'postulacion' && (
        <div key="postulacion" className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#010080]/30 space-y-6 animate-highlight hover:shadow-md transition-all duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#010080]">Guía de Postulación y Requisitos</h3>
              <p className="text-xs text-slate-500 font-medium">Pasos esenciales para preparar tu expediente de movilidad académica</p>
            </div>

            {/* Pasos de Postulación */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-[#010080] uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={16} className="text-yellow-600" /> Pasos para Postular
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-700 font-medium">
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center mb-2">1</span>
                  <strong className="block text-slate-900 mb-1">Revisar Convocatoria</strong>
                  Verifica que tu carrera (Ingeniería Informática / Sistemas) esté comprendida en la convocatoria activa.
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center mb-2">2</span>
                  <strong className="block text-slate-900 mb-1">Validar Cursos</strong>
                  Compara los sílabos de la universidad de destino con tu plan de estudios en la EPIIS para la convalidación.
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center mb-2">3</span>
                  <strong className="block text-slate-900 mb-1">Reunir Expediente</strong>
                  Prepara tu carta de motivación, historial de notas, seguro médico y documentos solicitados.
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center mb-2">4</span>
                  <strong className="block text-slate-900 mb-1">Presentar a la OCTI</strong>
                  Envía tu postulación mediante el canal oficial habilitado por la Oficina de Cooperación Internacional.
                </div>
              </div>
            </div>

            {/* Documentación Frecuentemente Solicitada */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#010080] uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-[#010080]" /> Documentos Frecuentes del Expediente
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 mb-0.5">Carta de Presentación Institucional</strong>
                    Emitida por la Oficina de Cooperación Internacional de la UNSAAC indicando los cursos a llevar.
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 mb-0.5">Ficha de Notas y Récord Académico</strong>
                    Constancia de rendimiento académico y promedio ponderado sin asignaturas pendientes.
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 mb-0.5">Carta de Motivación del Estudiante</strong>
                    Documento personal donde expones tus motivos académicos y profesionales para realizar la estancia.
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 mb-0.5">Seguro Médico Coberturado</strong>
                    Seguro de salud estatal o privado según el nivel de cobertura exigido por la institución receptora.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: CONVALIDACIÓN DE CURSOS */}
      {activeSubTab === 'convalidacion' && (
        <div key="convalidacion" className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#010080]/30 space-y-6 animate-highlight hover:shadow-md transition-all duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#010080]">Convalidación y Reconocimiento Académico</h3>
              <p className="text-xs text-slate-500 font-medium">Normativa del Reglamento Académico de la UNSAAC (Arts. 97 al 101)</p>
            </div>

            {/* Regla del 75% Destacada */}
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Award size={20} className="text-amber-600" />
                Criterio del 75% de Equivalencia Silábica
              </div>
              <p className="text-xs text-amber-950 leading-relaxed font-mono">
                De acuerdo con el Reglamento Académico (Art. 97°), para que una asignatura cursada en movilidad sea convalidada en la UNSAAC, sus contenidos analíticos silábicos deben ser equivalentes en <strong>no menos del 75%</strong> y contar con la misma o mayor equivalencia de créditos.
              </p>
            </div>

            {/* Procedimiento de Convalidación */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-[#010080] uppercase tracking-wider flex items-center gap-2">
                <Compass size={16} className="text-[#010080]" /> Procedimiento al Retornar
              </h4>
              <ol className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-2.5 bg-white p-3 rounded-lg border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span><strong>Mesa de Partes:</strong> Presentar la solicitud formal de convalidación adjuntando certificados originales de estudios, sílabos visados y plan de estudios de la universidad de destino.</span>
                </li>
                <li className="flex items-start gap-2.5 bg-white p-3 rounded-lg border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span><strong>Evaluación por la Comisión:</strong> La Comisión Académica de la Escuela Profesional de Ingeniería Informática y de Sistemas evalúa los contenidos y emite el dictamen correspondiente.</span>
                </li>
                <li className="flex items-start gap-2.5 bg-white p-3 rounded-lg border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span><strong>Resolución Decanal:</strong> El Decano de la Facultad emite la Resolución Decanal de convalidación que registra oficialmente tus notas en tu historial académico antoniano.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 4: CONVENIOS Y BECAS */}
      {activeSubTab === 'convenios' && (
        <div key="convenios" className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#010080]/30 space-y-6 animate-highlight hover:shadow-md transition-all duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#010080]">Convenios Marco y Becas de Internacionalización</h3>
              <p className="text-xs text-slate-500 font-medium">Oportunidades de cooperación interinstitucional gestionadas por la OCTI UNSAAC</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-[#010080] font-bold text-sm">
                  <Handshake size={18} className="text-yellow-600" />
                  Convenios Académicos Activos
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  La UNSAAC mantiene alianzas con redes de universidades en Latinoamérica, España y el resto del mundo para intercambio estudiantil, proyectos de investigación y pasantías.
                </p>
                <a
                  href="https://octi.unsaac.edu.pe/informacion-de-convenios-2025/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#010080] hover:underline pt-1"
                >
                  Consultar Registro de Convenios <ExternalLink size={13} />
                </a>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-[#010080] font-bold text-sm">
                  <Sparkles size={18} className="text-yellow-600" />
                  Becas y Financiamiento
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dependiendo del programa (Alianza del Pacífico, Erasmus+, Movilidad AUIP), las convocatorias pueden subvencionar costos de pasajes, manutención, seguro o exención de matrícula.
                </p>
                <a
                  href="https://octi.unsaac.edu.pe/redes-de-cooperacion/becas/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#010080] hover:underline pt-1"
                >
                  Ver Oportunidades de Becas <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
