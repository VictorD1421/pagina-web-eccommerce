'use client'
import { History, Target, Eye, Heart, Star, Sparkles, Package } from 'lucide-react'

export default function NosotrosPage() {
  return (
    <div className="bg-[#FFFBF0] min-h-screen pt-20 pb-20 overflow-hidden relative">
      {/* Decoraciones de fondo (Manchas de pintura abstractas) */}
      <div className="absolute top-20 left-[-5%] w-64 h-64 bg-[#FFB800] rounded-full blur-[100px] opacity-10 animate-pulse" />
      <div className="absolute bottom-20 right-[-5%] w-80 h-80 bg-[#FF5C00] rounded-full blur-[120px] opacity-10" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Encabezado Principal */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-[#FF5C00] px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest mb-4">
            <Sparkles size={16} />
            <span>Nuestra Historia</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#3D1A14] tracking-tighter mb-6">
            20 años impulsando <br /> 
            <span className="text-[#FF5C00]">tu creatividad</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 font-medium text-lg leading-relaxed">
            Desde el corazón de Maracay, hemos sido el aliado de generaciones de estudiantes, 
            padres y docentes que creen que <span className="text-[#3D1A14] font-bold italic">"imaginar es crear"</span>.
          </p>
        </div>

        {/* Sección de Antecedentes con Diseño de Tarjeta Grande */}
        <div className="bg-white rounded-[3.5rem] p-8 md:p-16 shadow-2xl shadow-orange-100/50 border border-orange-50 mb-20 relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-[#FFB800] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-100 rotate-3">
                <History className="text-[#3D1A14]" size={32} />
              </div>
              <h2 className="text-3xl font-black text-[#3D1A14] mb-6">Desde 2005 en Maracay</h2>
              <div className="space-y-4 text-gray-600 font-medium leading-relaxed">
                <p>
                  Iniciamos operaciones con un sueño claro: atender la demanda de artículos escolares y de oficina en el Estado Aragua. 
                  A lo largo de dos décadas, hemos transformado ese sueño en una trayectoria de estabilidad y confianza.
                </p>
                <p>
                  No solo vendemos útiles; organizamos ferias anuales y apoyamos a nuestra comunidad con donaciones a instituciones educativas. 
                  Hoy, somos una tienda integral que abarca desde papelería hasta ferretería y hogar.
                </p>
              </div>
              
              <div className="mt-8 flex gap-4">
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-[#FF5C00]">20+</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Años de Trayectoria</span>
                </div>
                <div className="w-[1px] bg-orange-100 h-12 self-center" />
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-[#3D1A14]">100%</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Compromiso Local</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-orange-50 rounded-[3rem] overflow-hidden rotate-2 shadow-inner border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1000&auto=format&fit=crop" 
                  alt="Creatividad e Historia"
                  className="object-cover w-full h-full opacity-90 hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Sticker decorativo */}
              <div className="absolute -bottom-6 -left-6 bg-[#3D1A14] text-white p-6 rounded-3xl -rotate-6 shadow-xl hidden md:block">
                <p className="text-sm font-bold">¡Donde imaginar... <br/> es crear! ✨</p>
              </div>
            </div>
          </div>
        </div>

        {/* Valores Rápidos en el pie */}
        <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-40">
          <div className="flex items-center gap-2 font-black text-[#3D1A14] grayscale hover:grayscale-0 transition-all">
            <Star size={20} /> <span>EXCELENCIA</span>
          </div>
          <div className="flex items-center gap-2 font-black text-[#3D1A14] grayscale hover:grayscale-0 transition-all">
            <Heart size={20} /> <span>CONFIANZA</span>
          </div>
          <div className="flex items-center gap-2 font-black text-[#3D1A14] grayscale hover:grayscale-0 transition-all">
            <Package size={20} /> <span>VARIEDAD</span>
          </div>
        </div>

      </div>
    </div>
  )
}