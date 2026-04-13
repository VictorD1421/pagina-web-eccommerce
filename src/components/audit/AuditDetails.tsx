'use client';

import { useState } from 'react';

interface Props {
  oldData: any;
  newData: any;
  action: string;
}

export default function AuditDetails({ oldData, newData, action }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium border border-indigo-200 px-3 py-1 rounded-md hover:bg-indigo-50 transition-colors shadow-sm"
      >
        Ver cambios
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Detalles del Movimiento ({action})</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-slate-800 text-2xl transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
              <section>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Estado Anterior</p>
                <pre className="bg-slate-50 p-4 rounded-lg text-[11px] text-slate-700 overflow-x-auto border border-slate-200 font-mono leading-relaxed">
                  {oldData ? JSON.stringify(oldData, null, 2) : '// Sin datos previos (Creación)'}
                </pre>
              </section>
              <section>
                <p className="text-[10px] font-bold text-indigo-400 uppercase mb-2 tracking-wider">Estado Nuevo</p>
                <pre className="bg-indigo-50 p-4 rounded-lg text-[11px] text-indigo-900 overflow-x-auto border border-indigo-100 font-mono leading-relaxed">
                  {newData ? JSON.stringify(newData, null, 2) : '// Registro eliminado'}
                </pre>
              </section>
            </div>

            <div className="p-4 border-t bg-slate-50 text-right">
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all active:scale-95"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}