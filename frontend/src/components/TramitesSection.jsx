import React, { useState, useEffect } from 'react';
import {
  FileText, CreditCard, CalendarCheck, Award, ExternalLink, Sparkles,
  CheckCircle2, Search, ShieldCheck, Compass, Receipt, HelpCircle,
  FileCheck, Landmark, ArrowRight
} from 'lucide-react';

export default function TramitesSection({ subTab = 'tramite_virtual', onSubTabChange = null }) {
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
      {/* Hero Banner Trámites Académicos */}
      <section className="bg-gradient-to-r from-[#010080] via-[#000066] to-[#00004c] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border-l-8 border-yellow-500">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 mb-4 border border-yellow-500/30">
            <Sparkles size={14} /> Servicios Digitales e Institucionales UNSAAC
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            Guía de Trámites Académicos y Administrativos
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
            Orientación paso a paso para la gestión de expedientes, mesa de partes virtual, pagos en línea, rectificación de matrícula y emisión de certificados oficiales.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://tramite.unsaac.edu.pe/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-500 hover:bg-[#DFB320] text-[#010080] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 hover:scale-105"
            >
              <ExternalLink size={15} /> Mesa de Partes Virtual
            </a>
            <a
              href="https://servicios.unsaac.edu.pe/recaudacion/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border border-white/20 flex items-center gap-2"
            >
              <CreditCard size={15} /> Plataforma de Pagos en Línea
            </a>
          </div>
        </div>

        {/* Fondo gráfico decorativo */}
        <div className="absolute -right-6 -bottom-14 opacity-15 pointer-events-none transform -rotate-12">
          <Landmark size={320} />
        </div>
      </section>

      {/* Sub-navegador Interno de Trámites */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => handleSelectSubTab('tramite_virtual')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'tramite_virtual'
              ? 'bg-[#010080] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText size={16} /> Mesa de Partes Virtual
        </button>
        <button
          onClick={() => handleSelectSubTab('pagos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'pagos'
              ? 'bg-[#010080] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard size={16} /> Pagos y Tasas TUPA
        </button>
        <button
          onClick={() => handleSelectSubTab('matricula')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'matricula'
              ? 'bg-[#010080] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CalendarCheck size={16} /> Matrícula y Registros
        </button>
        <button
          onClick={() => handleSelectSubTab('constancias')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'constancias'
              ? 'bg-[#010080] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award size={16} /> Constancias y Certificados
        </button>
      </div>

      {/* PESTAÑA 1: MESA DE PARTES VIRTUAL */}
      {activeSubTab === 'tramite_virtual' && (
        <div key="tramite_virtual" className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#010080]/30 space-y-6 animate-highlight hover:shadow-md transition-all duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#010080]">Mesa de Partes Virtual y Seguimiento de Expedientes</h3>
              <p className="text-xs text-slate-500 font-medium">Plataforma institucional para el ingreso de FUT (Formulario Único de Trámite) y solicitudes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Presentar Solicitud */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#010080] flex items-center justify-center font-bold">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#010080]">Ingreso de FUT Virtual</h4>
                    <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold">Plataforma Oficial</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ingresa tus solicitudes dirigidas a la Decanatura, Dirección de Escuela o Comité Tutorial mediante el portal oficial de Trámite Documentario.
                </p>
                <div className="pt-2">
                  <a
                    href="https://tramite.unsaac.edu.pe/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#010080] hover:underline"
                  >
                    Acceder a Trámite Virtual <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Seguimiento de Expediente */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Search size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Seguimiento de Expedientes</h4>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">Consulta en Línea</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verifica el estado del trámite en tiempo real ingresando tu código de estudiante, DNI o número de expediente asignado al registrar el documento.
                </p>
                <div className="pt-2">
                  <a
                    href="https://tramite.unsaac.edu.pe/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline"
                  >
                    Consultar Estado de Expediente <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>

            {/* Pasos para Presentar una Solicitud */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-[#010080] uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={16} className="text-yellow-600" /> Pasos para Ingresar tu Trámite
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-700 font-medium">
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center mb-2">1</span>
                  <strong className="block text-slate-900 mb-1">Descargar/Llenar FUT</strong>
                  Completa los datos personales, código de alumno y fundamenta claramente tu pedido.
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center mb-2">2</span>
                  <strong className="block text-slate-900 mb-1">Adjuntar Requisitos</strong>
                  Adjunta en formato PDF tu FUT firmando y los requisitos exigidos según el TUPA.
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center mb-2">3</span>
                  <strong className="block text-slate-900 mb-1">Generar Expediente</strong>
                  Al enviar la solicitud, guarda el número de expediente y código de verificación generado.
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-[#010080] text-white text-[11px] font-bold flex items-center justify-center mb-2">4</span>
                  <strong className="block text-slate-900 mb-1">Monitorear Estado</strong>
                  Revisa el recorrido del documento por las dependencias correspondientes de la UNSAAC.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: PAGOS Y TASAS TUPA */}
      {activeSubTab === 'pagos' && (
        <div key="pagos" className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#010080]/30 space-y-6 animate-highlight hover:shadow-md transition-all duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#010080]">Pagos y Tasas Académicas (TUPA UNSAAC)</h3>
              <p className="text-xs text-slate-500 font-medium">Plataformas de pago en línea y consulta del Texto Único de Procedimientos Administrativos</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-[#010080] font-bold text-sm">
                  <CreditCard size={18} className="text-yellow-600" />
                  Plataforma de Pagos Virtuales
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Realiza el pago de tasas de matrícula, certificados de estudio, carné universitario y derechos administrativos de forma virtual.
                </p>
                <a
                  href="https://servicios.unsaac.edu.pe/recaudacion/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#010080] hover:underline pt-1"
                >
                  Ir a Portal Recaudación UNSAAC <ExternalLink size={13} />
                </a>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-[#010080] font-bold text-sm">
                  <Receipt size={18} className="text-yellow-600" />
                  Consulta del TUPA Vigente
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verifica las tasas oficiales, costos, plazos de atención y requisitos aprobados en la Resolución CU-520-2024-UNSAAC.
                </p>
                <a
                  href="https://transparencia.unsaac.edu.pe/links/planeamiento/documentos/TUPAUNSAAC_NuevoFormato2021.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#010080] hover:underline pt-1"
                >
                  Descargar TUPA UNSAAC (PDF) <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: MATRÍCULA Y REGISTRO ACADÉMICO */}
      {activeSubTab === 'matricula' && (
        <div key="matricula" className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#010080]/30 space-y-6 animate-highlight hover:shadow-md transition-all duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#010080]">Procedimientos de Matrícula y Registros</h3>
              <p className="text-xs text-slate-500 font-medium">Normativa sobre matrícula regular, rectificación, reserva y condición académica</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <strong className="block text-[#010080] font-bold text-sm">Matrícula Regular</strong>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Se efectúa dentro del cronograma oficial del semestre. Exige estar en condición de estudiante regular y no mantener deudas pendienetes.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <strong className="block text-[#010080] font-bold text-sm">Rectificación de Matrícula</strong>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Permite la adición o retiro de asignaturas dentro de las fechas fijadas por el calendario universitario del semestre lectivo.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <strong className="block text-[#010080] font-bold text-sm">Reserva de Matrícula</strong>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Trámite presentado ante el Decanato para suspender temporalmente los estudios por causas justificadas hasta por un plazo máximo normado.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 4: CONSTANCIAS Y CERTIFICADOS */}
      {activeSubTab === 'constancias' && (
        <div key="constancias" className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#010080]/30 space-y-6 animate-highlight hover:shadow-md transition-all duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#010080]">Emisión de Certificados y Constancias Oficiales</h3>
              <p className="text-xs text-slate-500 font-medium">Documentos académicos frecuentemente tramitados por los estudiantes y egresados de EPIIS</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 mb-0.5">Certificado Oficial de Estudios</strong>
                  Documento formal que acredita las asignaturas cursadas, créditos y calificaciones obtenidas.
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 mb-0.5">Constancia de Egresado</strong>
                  Acredita haber completado satisfactoriamente el 100% del plan de estudios de la carrera.
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 mb-0.5">Récord Académico de Notas</strong>
                  Resumen de calificaciones y promedio ponderado acumulado para postulaciones y movilidad.
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 mb-0.5">Carta de Presentación para Prácticas</strong>
                  Documento expedido por la Dirección de Escuela para presentar al estudiante ante la empresa receptora.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
