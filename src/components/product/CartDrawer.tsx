'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X, Loader2, CreditCard, Minus, Plus, Trash2, Eraser, Landmark } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/src/lib/supabase'
import { useState } from 'react'

interface CartDrawerProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  items: any[]
  loading: boolean
  onUpdateQty: (id: string, qty: number) => void
  onRemoveItem: (id: string) => void
  onClearCart: () => void
  onCheckout: (total: number) => Promise<any>
}

export const CartDrawer = ({ 
  isOpen, setIsOpen, items, loading, 
  onUpdateQty, onRemoveItem, onClearCart, onCheckout 
}: CartDrawerProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isProcessing, setIsProcessing] = useState(false)

  // 1. Obtener la tasa del dólar desde la base de datos
  const { data: tasaDolar = 0 } = useQuery({
    queryKey: ['tasaDolar'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('datos_empresa')
        .select('tasa_dolar')
        .maybeSingle()
      if (error) throw error
      return data?.tasa_dolar || 0
    }
  })

  const totalUSD = items.reduce((acc, item) => acc + (item.precio_unitario * item.cantidad), 0)
  const totalBS = totalUSD * tasaDolar

  // Función para procesar el pago y guardar en la tabla 'pedidos'
  const handleFinalizar = async () => {
    if (isProcessing) return
    setIsProcessing(true)

    try {
      // A. Verificar sesión del usuario
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert("Debes iniciar sesión para completar la compra.")
        setIsProcessing(false)
        return
      }

      // B. Insertar el registro en la tabla 'pedidos'
      // Se asume que 'perfil_id' o 'usuario_id' es la clave foránea
      const { data: nuevoPedido, error: errorInsert } = await supabase
        .from('pedidos')
        .insert({
          total: totalUSD,
          estado: 'pendiente',
          usuario_id: user.id,
          perfil_id: user.id 
        })
        .select()
        .single()

      if (errorInsert) throw errorInsert

      // C. Ejecutar lógica de checkout (limpiar carrito, etc.)
      const { error: checkoutError } = await onCheckout(totalUSD)
      
      if (!checkoutError) {
        setIsOpen(false)
        // Invalidamos consultas para reflejar el nuevo pedido si es necesario
        queryClient.invalidateQueries({ queryKey: ['pedidos'] })
        router.push('/comprar')
      }
    } catch (err) {
      console.error("Error al procesar el pedido:", err)
      alert("No se pudo registrar el pedido. Intenta de nuevo.")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatBs = (monto: number) => 
    monto.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 md:w-[450px] bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Cabecera del Carrito */}
            <div className="p-8 bg-[#3D1A14] text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10">
                <h3 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-3">
                  <ShoppingCart size={24} className="text-orange-500"/> Mi Carrito
                </h3>
                <p className="text-[10px] text-orange-200/60 font-black uppercase tracking-[0.2em] mt-1">
                  {items.length === 1 ? '1 Producto' : `${items.length} Productos`} seleccionado(s)
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all hover:rotate-90 relative z-10"
              >
                <X size={20}/>
              </button>
            </div>

            {/* Listado de Productos */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FDFCF9]">
              {loading || isProcessing ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-orange-500" size={40} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {isProcessing ? 'Procesando pedido...' : 'Actualizando bolsa...'}
                  </p>
                </div>
              ) : items.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Detalle de orden</span>
                    <button 
                      onClick={onClearCart} 
                      className="flex items-center gap-2 text-[10px] font-black text-red-400 hover:text-red-600 transition-colors uppercase"
                    >
                      <Eraser size={14}/> Vaciar
                    </button>
                  </div>
                  
                  {items.map((item) => (
                    <motion.div 
                      layout
                      key={item.id} 
                      className="flex gap-4 items-center bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img 
                        src={item.productos?.imagen_url || '/placeholder.png'} 
                        className="w-16 h-16 object-cover rounded-2xl bg-[#FDFCF9] border border-gray-50" 
                        alt={item.productos?.nombre} 
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-black text-[#3D1A14] truncate uppercase tracking-tight w-4/5">
                            {item.productos?.nombre}
                          </p>
                          <button 
                            onClick={() => onRemoveItem(item.id)} 
                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={16}/>
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-end mt-3">
                          <div className="flex items-center gap-3 bg-[#FDFCF9] rounded-full border border-gray-100 px-3 py-1">
                            <button 
                              onClick={() => onUpdateQty(item.id, item.cantidad - 1)} 
                              className="text-orange-500 disabled:opacity-30"
                              disabled={item.cantidad <= 1}
                            >
                              <Minus size={14} strokeWidth={3}/>
                            </button>
                            <span className="text-sm font-black text-[#3D1A14]">{item.cantidad}</span>
                            <button 
                              onClick={() => onUpdateQty(item.id, item.cantidad + 1)} 
                              className="text-orange-500"
                            >
                              <Plus size={14} strokeWidth={3}/>
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-black text-[#3D1A14]">
                              ${(item.precio_unitario * item.cantidad).toFixed(2)}
                            </p>
                            <p className="text-[8px] font-bold text-blue-500 uppercase">
                              {formatBs(item.precio_unitario * item.cantidad * tasaDolar)} Bs
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-300 space-y-6">
                  <ShoppingCart size={40} className="opacity-20"/>
                  <p className="font-black text-sm uppercase tracking-widest text-gray-400">Tu carrito está vacío</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-orange-500 font-black text-[10px] uppercase border-b-2 border-orange-500 pb-1"
                  >
                    Volver a la tienda
                  </button>
                </div>
              )}
            </div>

            {/* Footer con Totales y Botón de Pago */}
            {items.length > 0 && (
              <div className="p-8 border-t border-gray-100 bg-white shadow-2xl space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] font-black text-gray-400 uppercase">Subtotal (USD)</p>
                    <p className="text-2xl font-black text-[#3D1A14] tracking-tighter">${totalUSD.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex justify-between items-center bg-blue-50/70 px-5 py-3 rounded-[1.5rem] border border-blue-100/50">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Landmark size={14}/>
                      <p className="text-[10px] font-black uppercase">Total Estimado Bs</p>
                    </div>
                    <p className="text-xl font-black text-blue-700">
                      {formatBs(totalBS)} <small className="text-[10px]">Bs</small>
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleFinalizar} 
                  disabled={isProcessing}
                  className="group w-full bg-[#FF5C00] hover:bg-[#3D1A14] text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl shadow-orange-200/50 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin" size={20}/>
                  ) : (
                    <>
                      <CreditCard size={20} className="group-hover:animate-pulse"/> 
                      Ir a pagar pedido
                    </>
                  )}
                </button>
                
                <p className="text-[9px] text-center text-gray-400 font-medium">
                  Al confirmar, se registrará tu orden en nuestro sistema <br /> 
                  para proceder con el pago y envío.
                </p>
              </div>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[65] bg-[#3D1A14]/40 backdrop-blur-md" 
            onClick={() => setIsOpen(false)} 
          />
        </>
      )}
    </AnimatePresence>
  )
}