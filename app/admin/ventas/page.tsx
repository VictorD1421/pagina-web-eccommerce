'use client'

import React, { useEffect, useState } from 'react'
import { 
  ShoppingBag, Search, Calendar, 
  MapPin, DollarSign, Clock, ArrowUpRight, 
  Loader2, Image as ImageIcon, X, ExternalLink,
  Phone, Hash, Info, BookOpen, CheckCircle2,
  AlertCircle, MousePointer2, HelpCircle
} from 'lucide-react'
import { supabase } from '@/src/lib/supabase'

// Interfaz de datos sincronizada
interface Venta {
  id: string;
  nombre_completo: string;
  telefono: string;
  monto_pagado: number;
  referencia_pago: string;
  fecha_pago: string;
  created_at: string;
  comprobante_url: string;
  direccion_envio: string;
}

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedImg, setSelectedImg] = useState<string | null>(null)
  const [showManual, setShowManual] = useState(false)

  useEffect(() => {
    fetchVentas()
  }, [])

  async function fetchVentas() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('ventas')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setVentas(data || [])
    } catch (error) {
      console.error('Error al cargar ventas:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredVentas = ventas.filter(venta => 
    venta.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.referencia_pago?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.direccion_envio?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <Loader2 className="animate-spin text-[#FF5C00]" size={64} />
        <ShoppingBag className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#3D1A14]" size={24} />
      </div>
      <p className="text-[#3D1A14] font-black italic tracking-widest animate-pulse uppercase text-xs">Sincronizando Base de Datos...</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header Premium con Botón de Ayuda tipo Inventario */}
      <div className="bg-[#3D1A14] rounded-[3.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="space-y-4 text-center lg:text-left">
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              <div className="inline-flex items-center gap-2 bg-[#FF5C00] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                Panel Administrativo
              </div>
              
              {/* BOTÓN DE AYUDA (Estilo Inventario) */}
              <button 
                onClick={() => setShowManual(!showManual)}
                className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${
                  showManual 
                  ? 'bg-[#FF5C00] text-white border-[#FF5C00]' 
                  : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
                }`}
              >
                {showManual ? <X size={12} /> : <HelpCircle size={12} />}
                <span>{showManual ? 'Cerrar' : 'Ayuda'}</span>
              </button>
            </div>

            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
              Ventas <span className="text-[#FF5C00]">Realizadas</span>
            </h2>
            <p className="text-orange-100/40 font-medium text-lg max-w-md italic">
              Monitoreo en tiempo real de transacciones y logística de entregas.
            </p>
          </div>
          
          <div className="w-full lg:w-auto">
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem] flex items-center px-6 focus-within:border-[#FF5C00] transition-all group">
              <Search className="text-[#FF5C00] mr-4 transition-transform group-focus-within:scale-110" size={24} />
              <input 
                type="text" 
                placeholder="Buscar cliente, ref o destino..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder:text-white/20 font-bold py-4 w-full lg:w-80 text-lg"
              />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5C00] rounded-full blur-[150px] opacity-10 -mr-32 -mt-32"></div>
      </div>

      {/* SECCIÓN MANUAL DE USUARIO (Igual que en Inventario) */}
      {showManual && (
        <section className="animate-in fade-in slide-in-from-top-4 duration-300 bg-gradient-to-br from-white to-orange-50/30 p-8 rounded-[3rem] border-2 border-orange-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <BookOpen size={120} className="text-[#FF5C00]" />
          </div>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="text-[#FF5C00]" size={20} />
            <h3 className="font-black text-[#3D1A14] uppercase tracking-wider text-sm">Guía de Operaciones Rápidas</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-[#FF5C00] font-bold text-xs">1</div>
              <p className="text-xs text-[#3D1A14]/70 leading-relaxed">
                <strong className="text-[#3D1A14] block">Búsqueda:</strong> Filtre instantáneamente por <strong className="text-[#3D1A14]">nombre, referencia o dirección</strong>.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-[#FF5C00] font-bold text-xs">2</div>
              <p className="text-xs text-[#3D1A14]/70 leading-relaxed">
                <strong className="text-[#3D1A14] block">Validación:</strong> Haga clic en la miniatura para verificar que el capture coincida con el monto.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-[#FF5C00] font-bold text-xs">3</div>
              <p className="text-xs text-[#3D1A14]/70 leading-relaxed">
                <strong className="text-[#3D1A14] block">Logística:</strong> Revise si es <strong className="text-[#3D1A14]">Envío o Retiro</strong> para preparar el paquete.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-[#FF5C00] font-bold text-xs">4</div>
              <p className="text-xs text-[#3D1A14]/70 leading-relaxed">
                <strong className="text-[#3D1A14] block">Confirmación:</strong> Cruce el código de <strong className="text-[#3D1A14]">REF</strong> con su estado de cuenta bancario.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Tabla de Registros */}
      <div className="bg-white rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(61,26,20,0.1)] border border-orange-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FDFCF9] border-b border-orange-50">
                <th className="p-10 text-[11px] font-black uppercase tracking-[0.2em] text-[#3D1A14]/30">Información del Cliente</th>
                <th className="p-10 text-[11px] font-black uppercase tracking-[0.2em] text-[#3D1A14]/30 text-center">Logística</th>
                <th className="p-10 text-[11px] font-black uppercase tracking-[0.2em] text-[#3D1A14]/30">Detalle de Pago</th>
                <th className="p-10 text-[11px] font-black uppercase tracking-[0.2em] text-[#3D1A14]/30 text-right">Total</th>
                <th className="p-10 text-[11px] font-black uppercase tracking-[0.2em] text-[#3D1A14]/30 text-center">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50/50">
              {filteredVentas.length > 0 ? (
                filteredVentas.map((venta) => (
                  <tr key={venta.id} className="hover:bg-[#FFFBF7] transition-all duration-300 group">
                    <td className="p-10">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-[#3D1A14] rounded-[1.5rem] flex items-center justify-center text-[#FF5C00] text-2xl font-black shadow-lg transform group-hover:rotate-6 transition-transform">
                          {venta.nombre_completo?.[0].toUpperCase()}
                        </div>
                        <div className="space-y-1">
                          <p className="font-black text-[#3D1A14] text-xl tracking-tight">{venta.nombre_completo}</p>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Phone size={12} className="text-[#FF5C00]" />
                            <span className="text-xs font-bold">{venta.telefono}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-10 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="bg-orange-50 p-3 rounded-2xl group-hover:bg-[#FF5C00] transition-colors">
                          <MapPin size={20} className="text-[#FF5C00] group-hover:text-white" />
                        </div>
                        <p className="text-[10px] font-black text-[#3D1A14] leading-tight max-w-[150px] uppercase tracking-tighter">
                          {venta.direccion_envio || 'Retiro en Tienda'}
                        </p>
                      </div>
                    </td>

                    <td className="p-10">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 bg-[#FDFCF9] px-3 py-1 rounded-lg border border-orange-50 w-fit">
                          <Hash size={12} className="text-[#FF5C00]" />
                          <span className="font-mono text-xs font-black text-[#3D1A14] uppercase">Ref: {venta.referencia_pago}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px]">
                          <Calendar size={12} /> {venta.fecha_pago ? new Date(venta.fecha_pago).toLocaleDateString() : 'Pendiente'}
                        </div>
                      </div>
                    </td>

                    <td className="p-10 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-[#3D1A14] tracking-tighter">
                          ${Number(venta.monto_pagado).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] font-black text-[#FF5C00]/50 uppercase tracking-widest">Cobrado</span>
                      </div>
                    </td>

                    <td className="p-10">
                      <div className="flex justify-center">
                        {venta.comprobante_url ? (
                          <button 
                            onClick={() => setSelectedImg(venta.comprobante_url)}
                            className="group relative w-16 h-16 rounded-[1.2rem] overflow-hidden border-2 border-transparent hover:border-[#FF5C00] transition-all shadow-md active:scale-90"
                          >
                            <img 
                              src={venta.comprobante_url} 
                              alt="Ticket" 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-[#3D1A14]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <ImageIcon className="text-white" size={24} />
                            </div>
                          </button>
                        ) : (
                          <div className="w-16 h-16 rounded-[1.2rem] bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                            <Info size={20} />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-32 text-center">
                    <div className="flex flex-col items-center space-y-4 opacity-10">
                      <ShoppingBag size={120} />
                      <p className="text-3xl font-black italic text-[#3D1A14]">Bóveda vacía</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Lightbox Comprobante */}
      {selectedImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#3D1A14]/95 backdrop-blur-xl" onClick={() => setSelectedImg(null)}></div>
          
          <div className="relative max-w-4xl w-full bg-white rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row h-full max-h-[85vh]">
            <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
              <img 
                src={selectedImg} 
                alt="Ticket de Pago" 
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              />
            </div>
            
            <div className="w-full md:w-80 bg-[#FDFCF9] p-8 md:p-10 flex flex-col justify-between">
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="bg-[#FF5C00]/10 p-3 rounded-2xl">
                    <ImageIcon className="text-[#FF5C00]" size={28} />
                  </div>
                  <button 
                    onClick={() => setSelectedImg(null)}
                    className="p-3 bg-white text-[#3D1A14] rounded-2xl hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div>
                  <h4 className="text-2xl font-black text-[#3D1A14] leading-tight italic">Comprobante Digital</h4>
                  <p className="text-gray-400 text-sm font-bold mt-2 italic leading-relaxed">Verifique que el número de referencia coincida con el banco.</p>
                </div>
              </div>

              <div className="space-y-3">
                <a 
                  href={selectedImg} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-5 bg-[#3D1A14] text-white rounded-[1.5rem] font-black text-[10px] tracking-widest hover:bg-[#FF5C00] transition-all shadow-lg active:scale-95"
                >
                  <ExternalLink size={18} /> VER PANTALLA COMPLETA
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}