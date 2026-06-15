import React from 'react';
import { X, MessageSquare, Plus, Calendar, Trash2 } from 'lucide-react';

export default function Sidebar({ 
  isOpen, 
  onClose, 
  conversaciones, 
  conversacionActivaId, 
  onSelectConversacion,
  onNewChat,
  onDeleteConversacion
}) {
  return (
    <div className={`absolute inset-0 z-30 flex transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Panel lateral con el historial de conversaciones */}
      <div className="w-4/5 max-w-[280px] bg-white text-slate-800 flex flex-col h-full shadow-2xl border-r border-slate-200/80">
        {/* Cabecera del panel del historial */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm tracking-wide uppercase text-slate-500">Conversaciones</h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
 
        {/* Botón para iniciar un nuevo chat y cerrar el panel */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#2E2EFF] hover:bg-[#2E2EFF]/90 text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm border-none"
          >
            <Plus size={16} />
            Nueva conversación
          </button>
        </div>

        {/* Listado de conversaciones cargadas desde la base de datos */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5">
            <Calendar size={12} />
            Recientes
          </div>
          
          {conversaciones.length === 0 ? (
            <div className="p-4 text-xs text-slate-500 text-center">
              No hay chats anteriores.
            </div>
          ) : (
            conversaciones.map((conv) => {
              const isActive = conv.id === conversacionActivaId;
              return (
                <div
                  key={conv.id}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors group ${
                    isActive 
                      ? 'bg-[#2E2EFF] text-white font-bold border-l-4 border-[#DFB320] shadow-sm' 
                      : 'bg-slate-50 text-slate-600 hover:bg-[#2E2EFF]/10 hover:text-[#2E2EFF] border border-slate-200/50'
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectConversacion(conv.id);
                      onClose();
                    }}
                    className="flex-1 flex items-center gap-2.5 text-left text-xs text-inherit bg-transparent border-none p-0 cursor-pointer overflow-hidden font-medium"
                  >
                    <MessageSquare size={14} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#2E2EFF]'}`} />
                    <span className="truncate flex-1">{conv.titulo || `Conversación #${conv.id}`}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversacion(conv.id);
                    }}
                    className={`p-1 rounded transition-opacity cursor-pointer ml-1 flex items-center justify-center ${
                      isActive 
                        ? 'text-white/80 hover:text-white hover:bg-white/15' 
                        : 'text-slate-400 hover:text-red-500 hover:bg-slate-200/50'
                    } opacity-0 group-hover:opacity-100`}
                    title="Eliminar conversación"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Overlay backdrop to close drawer */}
      <div 
        onClick={onClose}
        className="flex-1 bg-black/40 backdrop-blur-sm cursor-pointer"
      />
    </div>
  );
}
