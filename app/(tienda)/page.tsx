
import { Header } from '@/src/components/layout/Header'
import { ProductGrid } from '@/src/components/product/ProductGrid'
import NosotrosPage from '@/src/components/sections/Nosotros' 
import { Why } from '@/src/components/sections/Why'
import { Contacto } from '@/src/components/sections/Contacto' 
import { supabase } from '@/src/lib/supabase'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default async function LandingPage() {
  // Traemos los últimos 4 productos para la vista previa
  const { data: productosPreview } = await supabase
    .from('productos')
    .select('*')
    .limit(4)
    .order('created_at', { ascending: false })

  return (
    <>
      <Header />

      {/* 1. SECCIÓN DE PRODUCTOS CON ACABADO PROFESIONAL */}
      <section id="productos" className="relative py-32 scroll-mt-24 overflow-hidden bg-[#3D1A14]">

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Encabezado de la Sección */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#FFB800] font-black">
                <Sparkles size={20} className="animate-pulse" />
                <span className="uppercase tracking-[0.3em] text-xs">Novedades Creativas</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                Lo más <span className="text-[#FFB800] drop-shadow-md">reciente</span>
              </h2>
            </div>
            
            <Link 
              href="/catalogo" 
              className="group flex items-center gap-3 bg-white/10 hover:bg-[#FF5C00] backdrop-blur-md text-white px-8 py-4 rounded-2xl font-black transition-all border border-white/10 mt-8 md:mt-0 shadow-xl"
            >
              Explorar catálogo completo 
              <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {/* Grid de Productos con sombra proyectada para dar volumen */}
          <div className="drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)]">
            <ProductGrid productos={productosPreview || []} />
          </div>
          
          {/* Contador/Info Inferior */}
          <div className="mt-20 text-center">
             <div className="inline-block px-8 py-3 bg-black/30 backdrop-blur-lg rounded-full border border-white/10">
                <p className="text-orange-100/80 font-bold text-xs uppercase tracking-[0.4em]">
                  Más de 500 artículos disponibles para tu creatividad
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN NOSOTROS */}
      <div id="nosotros" className="scroll-mt-24">
        <NosotrosPage />
        <Why />
      </div>

      {/* 3. SECCIÓN CONTACTO */}
      <Contacto />

      {/* 4. SECCIÓN FINAL / LLAMADO A LA ACCIÓN */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="bg-[#3D1A14] rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl border border-white/5">
            {/* Decoración Durí */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5C00]/10 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10 tracking-tighter uppercase">
              ¿Listo para <span className="text-[#FFB800]">comprar?</span>
            </h2>
            <p className="text-orange-50/60 text-lg mb-10 max-w-xl mx-auto relative z-10 font-medium leading-relaxed">
              Regístrate para gestionar tus pedidos de forma más rápida y acceder a precios exclusivos para empresas y emprendedores.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 relative z-10">
              <Link 
                href="/registro" 
                className="w-full sm:w-auto px-12 py-5 bg-[#FF5C00] text-white rounded-2xl font-black text-lg hover:bg-[#FF7A33] transition-all shadow-xl shadow-orange-900/20 active:scale-95"
              >
                Crear mi cuenta
              </Link>
              <Link 
                href="/login" 
                className="w-full sm:w-auto px-12 py-5 bg-transparent text-white border-2 border-white/20 rounded-2xl font-black text-lg hover:bg-white/10 transition-all"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}