'use client'
import React, { useState } from 'react'
import { 
  ShoppingBag, Search, Loader2, 
  Box, X, Plus, Minus, CheckCircle2, 
  Sparkles, Layers, Zap, User, Menu
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/src/lib/supabase'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_bs?: number;
  stock: number;
  imagen_url: string;
  categoria: string;
}

export default function CatalogoPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showToast, setShowToast] = useState(false)

  // 1. QUERY: Usuario
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) { router.push('/login'); return null; }
      return user
    },
    staleTime: 1000 * 60 * 5,
  })

  // 2. QUERY: Tasa (Solución al error de componente controlado: valor por defecto 0)
  const { data: tasaDolar = 0 } = useQuery({
    queryKey: ['tasaDolar'],
    queryFn: async () => {
      const { data } = await supabase.from('datos_empresa').select('tasa_dolar').maybeSingle()
      return data?.tasa_dolar || 0
    }
  })

  // 3. QUERY: Productos
  const { data: productos = [], isLoading: prodsLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: async () => {
      const { data, error } = await supabase.from('productos').select('*').order('nombre', { ascending: true })
      if (error) throw error
      return data as Producto[]
    },
  })

  // 4. MUTATION: Carrito
  const addToCartMutation = useMutation({
    mutationFn: async ({ producto, cant }: { producto: Producto, cant: number }) => {
      const { data: pedido } = await supabase.from('pedidos').select('id').eq('usuario_id', user?.id).eq('estado', 'carrito').maybeSingle()
      let pedidoId = pedido?.id
      if (!pedidoId) {
        const { data: newP } = await supabase.from('pedidos').insert([{ usuario_id: user?.id, estado: 'carrito', total: 0 }]).select().single()
        pedidoId = newP.id
      }
      const { data: existing } = await supabase.from('items_pedido').select('id, cantidad').eq('pedido_id', pedidoId).eq('producto_id', producto.id).maybeSingle()
      if (existing) {
        await supabase.from('items_pedido').update({ cantidad: existing.cantidad + cant, precio_unitario: producto.precio }).eq('id', existing.id)
      } else {
        await supabase.from('items_pedido').insert([{ pedido_id: pedidoId, producto_id: producto.id, cantidad: cant, precio_unitario: producto.precio }])
      }
    },
    onSuccess: () => {
      setShowToast(true)
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
      setTimeout(() => setShowToast(false), 3000)
      setSelectedProduct(null)
    }
  })

  const getPrecioBs = (prod: Producto, q: number = 1) => {
    const precioBase = prod.precio_bs && prod.precio_bs > 0 ? prod.precio_bs : (prod.precio * tasaDolar);
    return (precioBase * q).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  const categorias = ['Todos', ...Array.from(new Set(productos.map(p => p.categoria)))]
  const filteredProducts = productos.filter(p => (activeCategory === 'Todos' || p.categoria === activeCategory) && p.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  if (userLoading || prodsLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCF9]">
      <motion.div animate={{ scale: [1, 1.2, 1], rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }} className="relative">
        <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full" />
        <Zap className="absolute inset-0 m-auto text-orange-500" size={20} />
      </motion.div>
      <p className="mt-4 font-black text-xs uppercase tracking-[0.5em] text-orange-900/40">Cargando Inventario</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#3D1A14]">
      {/* Notificación de Carrito */}
      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-white/80 backdrop-blur-2xl border border-white px-8 py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-4"
          >
            <div className="bg-orange-500 p-2 rounded-full text-white shadow-lg shadow-orange-200"><CheckCircle2 size={18}/></div>
            <span className="text-sm font-black tracking-tight uppercase">¡Agregado al Carrito!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header con Navbar Integrado */}
      <header className="relative pt-6 pb-44 px-6 overflow-hidden bg-[#3D1A14]">
        {/* Navbar Superior */}
        <nav className="max-w-7xl mx-auto mb-16 flex items-center justify-between relative z-20">
          <div className="flex items-center gap-3">
             <div className="bg-orange-500 p-2 rounded-xl text-white">
                <ShoppingBag size={24} />
             </div>
             <span className="text-white font-black text-xl tracking-tighter uppercase italic">Duri <span className="text-orange-500">Shop</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 bg-white/5 backdrop-blur-md px-8 py-3 rounded-full border border-white/10">
            {['Inicio', 'Catálogo', 'Nosotros', 'Contacto'].map((item) => (
              <button key={item} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${item === 'Catálogo' ? 'text-orange-500' : 'text-white/60 hover:text-white'}`}>
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/10">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <span className="text-white text-[10px] font-black uppercase tracking-tight hidden sm:block">
                {user?.user_metadata?.full_name || 'Usuario'}
              </span>
            </div>
            <button className="md:hidden text-white"><Menu /></button>
          </div>
        </nav>

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="text-orange-500" size={16} />
            <span className="text-orange-500/80 font-black uppercase tracking-[0.4em] text-[9px]">Colección Premium 2026</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.8] tracking-tighter uppercase italic">
            COMPRA <br />
            <span className="text-orange-500 not-italic">ESTILO.</span>
          </h1>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-20 relative z-40">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Buscador */}
            <div className="md:col-span-7 lg:col-span-8 bg-white/90 backdrop-blur-md p-2 rounded-[2.5rem] shadow-[0_15px_35px_rgba(61,26,20,0.05)] border border-white flex items-center group transition-all focus-within:shadow-orange-100">
              <div className="pl-6 text-[#A0A0A0] group-focus-within:text-orange-500 transition-colors">
                <Search size={22}/>
              </div>
              <input 
                type="text" 
                placeholder="¿Qué buscas hoy?" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none py-4 px-4 outline-none font-bold text-[#3D1A14] placeholder:text-[#808080] placeholder:font-medium"
              />
            </div>
            
            {/* Tasa del día (Corregido para evitar NaN) */}
            <div className="md:col-span-5 lg:col-span-4 bg-[#FF5C00] p-4 rounded-[2.5rem] flex items-center justify-between px-8 shadow-xl shadow-orange-200 border-2 border-white/20">
               <span className="text-white/60 font-black text-[10px] uppercase tracking-widest">Tasa BCV</span>
               <span className="text-white font-black text-xl italic">
                 {tasaDolar ? tasaDolar.toFixed(2) : "0.00"} <small className="text-[10px] opacity-60">BS</small>
               </span>
            </div>
          </div>

          {/* Categorías */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
            {categorias.map(cat => (
              <button 
                key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shrink-0 border-2
                  ${activeCategory === cat 
                    ? 'bg-[#3D1A14] text-white border-[#3D1A14] shadow-lg' 
                    : 'bg-white text-gray-400 border-gray-100 hover:border-orange-500 hover:text-orange-500'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Productos */}
        <section className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((producto, i) => (
            <motion.div 
              key={producto.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => { setSelectedProduct(producto); setQuantity(1); }}
              className="group bg-white rounded-[3rem] p-5 border border-gray-100 hover:border-orange-200 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(255,92,0,0.12)] cursor-pointer relative flex flex-col"
            >
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[#FDFCF9] relative mb-6">
                <img 
                  src={producto.imagen_url || '/placeholder.png'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  alt={producto.nombre} 
                />
                
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-2xl shadow-xl border border-gray-50 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-tighter">Precio Total</p>
                    <p className="text-xl font-black text-[#3D1A14]">${producto.precio.toFixed(2)}</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-300 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <Plus size={24} />
                  </div>
                </div>
              </div>

              <div className="flex-1 px-2">
                <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em] bg-orange-50 px-3 py-1 rounded-lg inline-block mb-3">
                  {producto.categoria}
                </span>
                <h3 className="text-xl font-black text-[#3D1A14] leading-none mb-4 group-hover:text-orange-500 transition-colors line-clamp-2">
                  {producto.nombre}
                </h3>
              </div>

              <div className="pt-4 border-t border-dashed border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="text-[9px] font-bold text-blue-500 uppercase tracking-tight">Referencial</span>
                   <span className="text-sm font-black text-blue-600">{getPrecioBs(producto)} Bs</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300 font-bold text-[9px] uppercase">
                   <Box size={10}/> {producto.stock} ud.
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      </main>

      {/* Modal de Detalle */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-[#3D1A14]/80 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, rotateY: 20 }} animate={{ scale: 1, opacity: 1, rotateY: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-6xl rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col lg:flex-row"
            >
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-8 right-8 h-14 w-14 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-xl border border-gray-100 hover:bg-red-500 hover:text-white transition-all z-50 group"
              >
                <X className="group-hover:rotate-90 transition-transform" />
              </button>

              <div className="w-full lg:w-1/2 bg-[#FDFCF9] p-8 lg:p-20 flex items-center justify-center relative">
                <div className="absolute top-10 left-10"><Sparkles className="text-orange-200" size={40}/></div>
                <img 
                  src={selectedProduct.imagen_url} 
                  className="max-h-[500px] object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.1)]" 
                  alt={selectedProduct.nombre} 
                />
              </div>

              <div className="w-full lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center">
                <span className="text-orange-500 font-black text-xs uppercase tracking-[0.5em] mb-4">{selectedProduct.categoria}</span>
                <h2 className="text-5xl lg:text-7xl font-black text-[#3D1A14] tracking-tighter leading-[0.9] mb-8">{selectedProduct.nombre}</h2>
                
                <div className="flex flex-col md:flex-row md:items-center gap-8 mb-12">
                   <div>
                      <p className="text-6xl font-black text-[#3D1A14] tracking-tight">${(selectedProduct.precio * quantity).toFixed(2)}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Precio Final USD</p>
                   </div>
                   <div className="h-16 w-[2px] bg-gray-100 hidden md:block" />
                   <div>
                      <p className="text-3xl font-black text-blue-600 tracking-tight">{getPrecioBs(selectedProduct, quantity)} <small className="text-xs uppercase">Bs</small></p>
                      <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mt-1">Total en Bolívares</p>
                   </div>
                </div>

                <p className="text-gray-400 font-medium text-lg mb-12 italic leading-relaxed">
                  "{selectedProduct.descripcion || 'Este producto no tiene una descripción detallada.'}"
                </p>

                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-[#FDFCF9] p-2 rounded-[2rem] border-2 border-gray-100 gap-4">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-12 w-12 bg-white rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-md active:scale-90"><Minus size={18}/></button>
                      <span className="w-10 text-center font-black text-2xl">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))} className="h-12 w-12 bg-white rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-md active:scale-90"><Plus size={18}/></button>
                    </div>
                    <span className="text-[10px] font-black text-orange-900/40 uppercase tracking-widest">{selectedProduct.stock} Unidades disponibles</span>
                  </div>

                  <button 
                    onClick={() => addToCartMutation.mutate({ producto: selectedProduct, cant: quantity })}
                    disabled={selectedProduct.stock === 0 || addToCartMutation.isPending}
                    className="group relative w-full bg-[#3D1A14] text-white py-8 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] overflow-hidden transition-all hover:bg-orange-600 disabled:bg-gray-200"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-4">
                      {addToCartMutation.isPending ? <Loader2 className="animate-spin" /> : <><ShoppingBag size={20}/> Añadir al Carrito</>}
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}