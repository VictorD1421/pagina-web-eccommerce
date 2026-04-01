'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, User, MapPin, Phone, 
  CheckCircle2, Loader2, ArrowRight, Landmark, Upload, 
  Hash, ShieldCheck, Globe, Lock
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export default function ComprarPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  const [formData, setFormData] = useState({
    nombre_completo: '',
    telefono: '',
    referencia_pago: '',
    direccion_envio: ''
  })

  // 1. Obtener datos del perfil del usuario
  const { data: perfil, isLoading: loadingPerfil } = useQuery({
    queryKey: ['perfilUsuario'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Sesión no iniciada")
      const { data } = await supabase
        .from('perfiles')
        .select('nombre, telefono')
        .eq('id', user.id)
        .single()
      return data
    }
  })

  // 2. Precargar datos en el formulario
  useEffect(() => {
    if (perfil) {
      setFormData(prev => ({
        ...prev,
        nombre_completo: perfil.nombre || '',
        telefono: perfil.telefono || ''
      }))
    }
  }, [perfil])

  // Obtener el último pedido pendiente
  const { data: pedido, isLoading: loadingPedido } = useQuery({
    queryKey: ['pedidoCheckout'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Sesión no iniciada")
      const { data } = await supabase
        .from('pedidos')
        .select('*')
        .eq('perfil_id', user.id)
        .eq('estado', 'pendiente')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      return data
    }
  })

  // Obtener datos de la empresa
  const { data: empresa, isLoading: loadingEmpresa } = useQuery({
    queryKey: ['datosEmpresa'],
    queryFn: async () => {
      const { data } = await supabase.from('datos_empresa').select('*').eq('active', true).maybeSingle()
      return data
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFinalizarCompra = async () => {
    if (!pedido || !empresa || !imageFile) return
    setLoading(true)
    
    try {
      // 1. Subir Comprobante al Storage
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${pedido.id}-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('comprobantes') // Nombre del bucket en minúsculas según tus políticas SQL
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) {
        throw new Error(`Error en Storage: ${uploadError.message}. Revisa las políticas RLS del bucket 'comprobantes'.`)
      }

      // 2. Obtener URL Pública
      const { data: urlData } = supabase.storage
        .from('comprobantes')
        .getPublicUrl(fileName)

      // 3. Insertar en la tabla 'ventas'
      // IMPORTANTE: Asegúrate de que la columna 'pedido_id' exista físicamente en Supabase
      const { error: ventaError } = await supabase.from('ventas').insert({
        pedido_id: pedido.id,
        nombre_completo: formData.nombre_completo,
        telefono: formData.telefono,
        monto_pagado: pedido.total,
        referencia_pago: formData.referencia_pago,
        comprobante_url: urlData.publicUrl, 
        direccion_envio: formData.direccion_envio, 
        fecha_pago: new Date().toISOString()
      })

      if (ventaError) {
        console.error("Error al insertar venta:", ventaError)
        throw new Error(`Error en tabla ventas: ${ventaError.message}`)
      }

      // 4. Actualizar estado del pedido a 'pagado'
      const { error: updateError } = await supabase
        .from('pedidos')
        .update({ estado: 'pagado' })
        .eq('id', pedido.id)

      if (updateError) throw updateError
      
      // Limpiar cachés de React Query para reflejar cambios
      queryClient.invalidateQueries({ queryKey: ['pedidoCheckout'] })
      
      setStep(2)
      setTimeout(() => router.push('/'), 4000)

    } catch (err: any) {
      console.error("Detalles completos del error:", err)
      alert(err.message || "Ocurrió un error inesperado.")
    } finally { 
      setLoading(false) 
    }
  }

  if (loadingPedido || loadingEmpresa || loadingPerfil) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-orange-500" size={40} />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1A1A1A]">
      <nav className="fixed top-0 inset-x-0 z-50 px-6 py-4 flex items-center justify-between bg-white/60 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-all">
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center text-center">
            <h1 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-900 leading-none mb-1">Checkout</h1>
            <div className="flex items-center gap-1">
                <ShieldCheck size={10} className="text-green-500" />
                <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Transacción Segura</span>
            </div>
        </div>
        <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
            <Globe size={18} className="text-orange-600 animate-pulse" />
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-24 pb-12">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-12 gap-10">
              
              {/* Columna Izquierda: Tarjeta de Pago */}
              <div className="lg:col-span-5 space-y-6">
                <section className="bg-zinc-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-600/20 blur-[100px] group-hover:bg-orange-600/30 transition-all duration-700" />
                  <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-center">
                        <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                            <Landmark size={20} className="text-orange-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Pago Móvil</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] uppercase font-bold text-white/30 mb-1">Banco Destino</p>
                        <p className="text-xl font-black">{empresa?.nombre_banco} <span className="text-orange-500">({empresa?.codigo_banco})</span></p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] uppercase font-bold text-white/30 mb-1">Cédula / RIF</p>
                          <p className="text-sm font-bold">{empresa?.identificacion}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase font-bold text-white/30 mb-1">Teléfono Destino</p>
                          <p className="text-sm font-bold">{empresa?.telefono_pago}</p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                      <div>
                        <p className="text-[9px] uppercase font-bold text-white/30 mb-1">Total a transferir</p>
                        <h2 className="text-4xl font-black tracking-tighter">${pedido?.total?.toFixed(2)}</h2>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-orange-500">
                          {(pedido?.total * (empresa?.tasa_dolar || 0)).toLocaleString('es-VE')} BS
                        </p>
                        <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Tasa BCV: {empresa?.tasa_dolar}</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Columna Derecha: Formulario */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-5">
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-gray-400 ml-2 flex items-center gap-1">
                                  Nombre del Titular <Lock size={8} />
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                    <input 
                                      type="text" 
                                      name="nombre_completo" 
                                      value={formData.nombre_completo}
                                      readOnly 
                                      className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed outline-none text-sm font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-gray-400 ml-2">Teléfono de contacto</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                    <input 
                                      type="text" 
                                      name="telefono" 
                                      value={formData.telefono}
                                      placeholder="Ej: 04121234567" 
                                      className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-100 focus:border-orange-500 outline-none text-sm font-bold transition-colors" 
                                      onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-gray-400 ml-2">Número de Referencia</label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input 
                                  type="text" 
                                  name="referencia_pago" 
                                  placeholder="Últimos 4 o 6 dígitos" 
                                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-100 focus:border-orange-500 outline-none text-sm font-bold transition-colors" 
                                  onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-gray-400 ml-2">Dirección Detallada de Envío</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-5 text-gray-300" size={16} />
                                <textarea 
                                  name="direccion_envio" 
                                  placeholder="Calle, número de casa, punto de referencia..." 
                                  rows={3} 
                                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-100 focus:border-orange-500 text-sm font-bold outline-none transition-colors" 
                                  onChange={handleInputChange} 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase text-gray-400 ml-2">Comprobante (Captura)</label>
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-100 rounded-3xl cursor-pointer hover:bg-orange-50/50 transition-colors">
                                {imageFile ? (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="text-green-500" size={18} />
                                        <p className="text-xs font-bold text-gray-700">{imageFile.name}</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="text-gray-300 mb-2" size={24}/>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Click para subir imagen</p>
                                    </>
                                )}
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*" 
                                  onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
                                />
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={handleFinalizarCompra}
                        disabled={loading || !formData.referencia_pago || !formData.direccion_envio || !imageFile}
                        className="w-full bg-[#1A1A1A] hover:bg-orange-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all disabled:opacity-30"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Notificar Pago <ArrowRight size={18} /></>}
                    </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-20">
              <div className="w-24 h-24 bg-green-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-100">
                <CheckCircle2 size={48} strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-black uppercase mb-2">¡Pago Recibido!</h2>
              <p className="text-gray-400 text-sm mb-10 max-w-xs mx-auto">Tu pedido está siendo procesado. Te redireccionaremos en unos segundos.</p>
              <Loader2 className="animate-spin text-gray-200 mx-auto" />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}