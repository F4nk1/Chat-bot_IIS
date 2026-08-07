import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import Chatbot from './components/Chatbot';
import BienestarSection from './components/BienestarSection';
import TutoriaSection from './components/TutoriaSection';
import MovilidadSection from './components/MovilidadSection';
import FormacionSection from './components/FormacionSection';
import TramitesSection from './components/TramitesSection';
import DinoBot01 from './assets/DinoBot01.png';
import logoInfo from './assets/logo_info.jpg';

export default function App() {
  // Inicializar estado guardado en localStorage para persistir entre recargas
  const [activeMainTab, setActiveMainTab] = useState(() => {
    return localStorage.getItem('activeMainTab') || 'tutoria';
  });
  const [subTabs, setSubTabs] = useState({
    formacion: 'malla',
    bienestar: 'comedor',
    tramites: 'tramite_virtual',
    movilidad: 'modalidades',
    tutoria: 'inicio'
  });
  const [chatOpen, setChatOpen] = useState(false); // Widget flotante en móvil

  const mainContentRef = useRef(null);

  // Navegación Co-Pilot a nivel de Categoría Principal únicamente con scroll suave
  const handleNavigateTab = (mainTabKey) => {
    if (mainTabKey) {
      setActiveMainTab(mainTabKey);
      requestAnimationFrame(() => {
        mainContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  // Guardar cambio de pestaña activa en localStorage
  useEffect(() => {
    localStorage.setItem('activeMainTab', activeMainTab);
  }, [activeMainTab]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#c8c8ef]">

      {/* Encabezado Institucional Principal */}
      <header className="bg-[#010080] text-white border-b border-yellow-500 sticky top-0 z-40 shadow-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => handleNavigateTab('tutoria', 'inicio')}
          >
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

          {/* Navegación Principal por Pestañas */}
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavigateTab('tutoria')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all cursor-pointer ${
                activeMainTab === 'tutoria'
                  ? 'bg-yellow-500 text-[#010080] font-bold shadow-xs'
                  : 'hover:text-yellow-400 hover:bg-white/5'
              }`}
            >
              Tutorías Académicas
            </button>

            <button
              onClick={() => handleNavigateTab('bienestar')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all cursor-pointer ${
                activeMainTab === 'bienestar'
                  ? 'bg-yellow-500 text-[#010080] font-bold shadow-xs'
                  : 'hover:text-yellow-400 hover:bg-white/5'
              }`}
            >
              Bienestar Universitario
            </button>

            <button
              onClick={() => handleNavigateTab('movilidad')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all cursor-pointer ${
                activeMainTab === 'movilidad'
                  ? 'bg-yellow-500 text-[#010080] font-bold shadow-xs'
                  : 'hover:text-yellow-400 hover:bg-white/5'
              }`}
            >
              Movilidad Estudiantil
            </button>

            <button
              onClick={() => handleNavigateTab('formacion')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all cursor-pointer ${
                activeMainTab === 'formacion'
                  ? 'bg-yellow-500 text-[#010080] font-bold shadow-xs'
                  : 'hover:text-yellow-400 hover:bg-white/5'
              }`}
            >
              Formación Profesional
            </button>

            <button
              onClick={() => handleNavigateTab('tramites')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all cursor-pointer ${
                activeMainTab === 'tramites'
                  ? 'bg-yellow-500 text-[#010080] font-bold shadow-xs'
                  : 'hover:text-yellow-400 hover:bg-white/5'
              }`}
            >
              Trámites Académicos
            </button>
          </nav>
        </div>
      </header>

      {/* Grid Principal */}
      <div className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LADO IZQUIERDO Y CENTRAL: Portal Informativo Dinámico (75%) */}
        <main ref={mainContentRef} className="lg:col-span-3 space-y-10">
          {activeMainTab === 'bienestar' ? (
            <BienestarSection subTab={subTabs.bienestar} onSubTabChange={(st) => setSubTabs(prev => ({ ...prev, bienestar: st }))} />
          ) : activeMainTab === 'movilidad' ? (
            <MovilidadSection subTab={subTabs.movilidad} onSubTabChange={(st) => setSubTabs(prev => ({ ...prev, movilidad: st }))} />
          ) : activeMainTab === 'formacion' ? (
            <FormacionSection subTab={subTabs.formacion} onSubTabChange={(st) => setSubTabs(prev => ({ ...prev, formacion: st }))} />
          ) : activeMainTab === 'tramites' ? (
            <TramitesSection subTab={subTabs.tramites} onSubTabChange={(st) => setSubTabs(prev => ({ ...prev, tramites: st }))} />
          ) : (
            <TutoriaSection subTab={subTabs.tutoria} onSubTabChange={(st) => setSubTabs(prev => ({ ...prev, tutoria: st }))} />
          )}
        </main>

        {/* LADO DERECHO: Panel del Chatbot Integrado en Escritorio (25% - PERMANENTE) */}
        <aside className="hidden lg:block lg:col-span-1 h-[600px] sticky top-22">
          <Chatbot onNavigateTab={handleNavigateTab} />
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
          /* Botón Flotante con efecto sutil */
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
            <Chatbot isWidget={true} onCloseWidget={() => setChatOpen(false)} onNavigateTab={handleNavigateTab} />
          </div>
        )}
      </div>

    </div>
  );
}
