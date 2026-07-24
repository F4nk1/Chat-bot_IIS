import React, { useState, useEffect } from 'react';
import {
  Utensils, HeartPulse, Brain, Home, Trophy, ExternalLink,
  CheckCircle2, FileText, MapPin, Calendar, Users, ShieldCheck,
  Sparkles, HelpCircle, ArrowRight, Clock, Award, AlertCircle,
  CreditCard, XCircle
} from 'lucide-react';

export default function BienestarSection({ subTab = 'comedor', onSubTabChange = null }) {
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
      {/* Hero Banner Bienestar */}
      <section className="bg-gradient-to-r from-[#010080] via-[#000066] to-[#00004c] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border-l-8 border-yellow-500">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 mb-4 border border-yellow-500/30">
            <Sparkles size={14} /> Dirección de Bienestar Universitario
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            Servicios y Beneficios para el Desarrollo Estudiantil
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
            La Dirección de Bienestar Universitario de la UNSAAC brinda atención integral en salud, alimentación, apoyo psicológico, programas de becas y residencia estudiantil para garantizar tu permanencia y éxito académico.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://bienestar.unsaac.edu.pe/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-500 hover:bg-[#DFB320] text-[#010080] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 hover:scale-105"
            >
              <ExternalLink size={15} /> Portal Oficial de Bienestar
            </a>
            <a
              href="http://bienestar.unsaac.edu.pe/ManualComedor_.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border border-white/20 flex items-center gap-2"
            >
              <FileText size={15} /> Manual del Comedor (PDF)
            </a>
          </div>
        </div>

        {/* Fondo decorativo de icono */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none transform rotate-12">
          <HeartPulse size={300} />
        </div>
      </section>

      {/* Navegación rápida por subtemas de Bienestar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => handleSelectSubTab('comedor')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === 'comedor'
            ? 'bg-[#010080] text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <Utensils size={16} /> Comedor Universitario
        </button>
        <button
          onClick={() => handleSelectSubTab('salud')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === 'salud'
            ? 'bg-[#010080] text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <HeartPulse size={16} /> Centro de Salud (CUS)
        </button>
        <button
          onClick={() => handleSelectSubTab('psicologia')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === 'psicologia'
            ? 'bg-[#010080] text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <Brain size={16} /> Salud Mental y Psicología
        </button>
        <button
          onClick={() => handleSelectSubTab('vivienda')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === 'vivienda'
            ? 'bg-[#010080] text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <Home size={16} /> Residencia y Asistencia Social
        </button>
        <button
          onClick={() => handleSelectSubTab('deportes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSubTab === 'deportes'
            ? 'bg-[#010080] text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <Trophy size={16} /> Deportes y Recreación
        </button>
      </div>

      {/* CONTENIDO 1: COMEDOR UNIVERSITARIO */}
      {activeSubTab === 'comedor' && (
        <div key="comedor" className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#010080]/30 space-y-4 animate-highlight hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Utensils size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#010080]">Comedor Universitario UNSAAC</h3>
                <p className="text-xs text-slate-500 font-medium">Reserva de cupos y Becas Alimentarias</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              El servicio de Comedor Universitario está orientado especialmente a estudiantes que presentan condiciones socioeconómicas que requieren apoyo institucional. Su finalidad es favorecer la alimentación adecuada, la permanencia académica y el bienestar del estudiante antoniano.
            </p>

            {/* Condición Previa Importante */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                <strong className="text-amber-950">Nota:</strong> Solo podrás obtener vacante y realizar el pago si existe un <strong>calendario activo</strong> publicado por la Dirección de Bienestar Universitario y si hay <strong>cupos disponibles</strong>.
              </p>
            </div>

            {/* Pasos para conseguir comedor */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-[#010080] uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={16} className="text-yellow-600" /> Pasos para obtener tu cupo en el comedor
              </h4>
              <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-700 font-medium">
                {/* Paso 1 */}
                <li className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="w-6 h-6 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center mb-2">1</span>
                    <strong className="block text-slate-900 mb-1">Ir al Portal Web</strong>
                    Ingresa a la plataforma oficial de Bienestar Universitario.
                  </div>
                  <a
                    href="http://bienestar.unsaac.edu.pe/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#010080] hover:underline flex items-center gap-1 mt-3"
                  >
                    Ir al portal <ArrowRight size={12} />
                  </a>
                </li>

                {/* Paso 2 */}
                <li className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center mb-2">2</span>
                  <strong className="block text-slate-900 mb-1">Autenticación</strong>
                  Ingresa tu Código de Estudiante y la clave del voucher de matrícula vigente.
                </li>

                {/* Paso 3 */}
                <li className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="w-6 h-6 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center mb-2">3</span>
                    <strong className="block text-slate-900 mb-1">Verificación</strong>
                    Comprueba la respuesta arrojada por el sistema:
                  </div>
                  <div className="mt-2 space-y-1.5 text-[10px]">
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      <CheckCircle2 size={12} /> ÉXITO (Cupo reservado)
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-red-50 text-red-700 border border-red-200 font-bold">
                      <XCircle size={12} /> ERROR (Sin cupos/fuera de fecha)
                    </div>
                  </div>
                </li>

                {/* Paso 4 */}
                <li className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="w-6 h-6 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center mb-2">4</span>
                    <strong className="block text-slate-900 mb-1">Pago</strong>
                    Paga en la <strong>Caja Central UNSAAC</strong> o por internet en <strong>Centro de Cómputo</strong>:
                  </div>
                  <a
                    href="https://servicios.unsaac.edu.pe/recaudacion/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#010080] hover:underline flex items-center gap-1 mt-3"
                  >
                    Pago en línea <ExternalLink size={12} />
                  </a>
                </li>
              </ol>
            </div>

            {/* Beca Comedor info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                <h4 className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <Award size={15} className="text-amber-600" /> Beca Comedor Permanente
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  Los requisitos para acceder a la beca fija se evalúan mediante la Unidad de Asistencia Social. Se consideran la situación socioeconómica, rendimiento y documentación en cada convocatoria.
                </p>
              </div>

              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#010080] mb-1 flex items-center gap-1.5">
                    <FileText size={15} className="text-[#010080]" /> Manual de Usuario
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Consulta el manual oficial publicado por la Dirección de Bienestar para resolver dudas sobre recargas, reservas y normas de convivencia.
                  </p>
                </div>
                <a
                  href="http://bienestar.unsaac.edu.pe/ManualComedor_.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#010080] hover:text-blue-900"
                >
                  Descargar Manual PDF <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO 2: CENTRO DE SALUD (CUS) */}
      {activeSubTab === 'salud' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#010080]/30 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <HeartPulse size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#010080]">Centro Universitario de Salud (CUS)</h3>
                <p className="text-xs text-slate-500 font-medium">Atención médica gratuita para estudiantes matriculados</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              El Centro Universitario de Salud ofrece atención médica preventiva y curativa en diversas especialidades para resguardar la salud integral de la comunidad universitaria.
            </p>

            {/* Especialidades médicas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 mx-auto mb-2 flex items-center justify-center font-bold text-xs">MD</div>
                <strong className="block text-xs text-slate-800">Medicina General</strong>
                <span className="text-[10px] text-slate-500">Consultas y diagnóstico</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 mx-auto mb-2 flex items-center justify-center font-bold text-xs">OD</div>
                <strong className="block text-xs text-slate-800">Odontología</strong>
                <span className="text-[10px] text-slate-500">Profilaxis y profilaxis dental</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 mx-auto mb-2 flex items-center justify-center font-bold text-xs">PS</div>
                <strong className="block text-xs text-slate-800">Psicología</strong>
                <span className="text-[10px] text-slate-500">Salud mental y consejería</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 mx-auto mb-2 flex items-center justify-center font-bold text-xs">EN</div>
                <strong className="block text-xs text-slate-800">Enfermería y Farmacia</strong>
                <span className="text-[10px] text-slate-500">Curaciones y medicamentos</span>
              </div>
            </div>

            {/* Ubicación y Requisitos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-[#010080] flex items-center gap-1.5">
                  <MapPin size={15} className="text-red-500" /> Sedes de Atención
                </h4>
                <ul className="text-xs text-slate-600 space-y-1 font-medium">
                  <li>• <strong>Sede Principal:</strong> Ciudad Universitaria Perayoc (Pabellón A).</li>
                  <li>• <strong>Sede Kayra:</strong> Atención médica descentralizada en el campus Kayra.</li>
                </ul>
              </div>

              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-2">
                <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-emerald-600" /> Requisito indispensable
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  Para acceder a cualquier consulta o atención médica gratuita debes presentar tu <strong>Carné Médico</strong> o tu <strong>Constancia de Matrícula vigente</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO 3: SALUD MENTAL Y PSICOLOGÍA */}
      {activeSubTab === 'psicologia' && (
        <div key="psicologia" className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#010080]/30 space-y-5 animate-highlight hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Brain size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#010080]">Consultorio de Psicología y Psicopedagogía</h3>
                <p className="text-xs text-slate-500 font-medium">Acompañamiento emocional, consejería y orientación académica</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              El servicio psicológico atiende a estudiantes que enfrentan retos emocionales, sobrecarga de exámenes, ansiedad o dificultades en su adaptación a la universidad.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200 space-y-2">
                <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Brain size={15} className="text-purple-600" /> Apoyo en Estrés Académico
                </h4>
                <p className="text-xs text-purple-800 leading-relaxed font-medium">
                  Si sientes que la carga de exámenes, trabajos o el rendimiento afecta tu bienestar emocional o físico, el consultorio brinda técnicas de afrontamiento, consejería y psicoterapia individual.
                </p>
              </div>

              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-200 space-y-2">
                <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Users size={15} className="text-indigo-600" /> Orientación Vocacional y Adaptación
                </h4>
                <p className="text-xs text-indigo-800 leading-relaxed font-medium">
                  Especialmente útil para alumnos de primeros semestres que buscan afianzar sus hábitos de estudio, clarificar su perfil profesional o superar procesos de adaptación universitaria.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO 4: VIVIENDA Y ASISTENCIA SOCIAL */}
      {activeSubTab === 'vivienda' && (
        <div key="vivienda" className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#010080]/30 space-y-5 animate-highlight hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Home size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#010080]">Vivienda Universitaria y Asistencia Social</h3>
                <p className="text-xs text-slate-500 font-medium">Residencia y evaluaciones socioeconómicas</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-[#010080] flex items-center gap-1.5">
                  <Home size={15} className="text-[#010080]" /> Residencia Universitaria
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Programa de alojamiento temporal destinado a estudiantes procedentes de provincias de la región que atraviesan condiciones de alta vulnerabilidad socioeconómica.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-[#010080] flex items-center gap-1.5">
                  <Users size={15} className="text-[#010080]" /> Evaluación Socioeconómica
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  La Unidad de Asistencia Social evalúa solicitudes para becas de estudio, apoyo solidario de emergencia y categorizaciones especiales de acuerdo con las convocatorias aprobadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO 5: DEPORTES Y RECREACIÓN */}
      {activeSubTab === 'deportes' && (
        <div key="deportes" className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#010080]/30 space-y-5 animate-highlight hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center font-bold">
                <Trophy size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#010080]">Deportes y Recreación</h3>
                <p className="text-xs text-slate-500 font-medium">Actividad física, campeonatos e integración</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              La Unidad de Deportes promueve un estilo de vida saludable mediante la práctica de disciplinas deportivas y actividades recreativas interfacultades durante todo el año lectivo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 font-medium">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Campeonatos Internos</strong>
                Participa en las olimpiadas universitarias en fútbol, básquet, vóley y ajedrez.
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Escuelas Deportivas</strong>
                Talleres de entrenamiento guiado para representar a la universidad.
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Uso de Instalaciones</strong>
                Acceso a la infraestructura deportiva de la Ciudad Universitaria.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
