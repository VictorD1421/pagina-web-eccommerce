'use client'

import React from 'react'
import { Sparkles, ShoppingBag, HeartHandshake, Target, Eye } from 'lucide-react'

export const Why = () => {
  const pilares = [
    {
      t: 'Papelería de Excelencia',
      d: 'Seleccionamos cuidadosamente cada artículo escolar y de oficina para asegurar calidad en cada etapa del aprendizaje.',
      icon: <Sparkles size={40} />,
      color: 'bg-[#FFB800]' // Amarillo Durí
    },
    {
      t: 'Variedad para Crear',
      d: 'Encuentra desde cuadernos y uniformes hasta ferretería y hogar. ¡Todo para el colegio y tu día a día en Maracay!',
      icon: <ShoppingBag size={40} />,
      color: 'bg-[#FF5C00]' // Naranja Durí
    },
    {
      t: 'Atención Cercana',
      d: 'Mantenemos la confianza de nuestra comunidad con un servicio personalizado para estudiantes, padres y docentes.',
      icon: <HeartHandshake size={40} />,
      color: 'bg-[#3D1A14]' // Marrón Chocolate Durí
    }
  ]

  return (
    <section id="why-us" className="bg-white py-24 relative overflow-hidden">
      {/* Decoración de fondo lúdica sutil */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFB800]/5 rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FF5C00]/5 rounded-full -ml-36 -mb-36 blur-2xl" />
      
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Encabezado más Amigable y Humano */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 text-[#FF5C00] font-black mb-4">
            <HeartHandshake size={20} />
            <span className="uppercase tracking-widest text-xs">Nuestro Compromiso</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-[#3D1A14] tracking-tighter leading-tight">
            ¿Por qué <br className="hidden md:block"/> <span className="text-[#FF5C00]">Inversiones Durí</span>?
          </h2>
          <p className="text-gray-600 mt-6 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
            Veinte años apoyando la creatividad en Maracay. Somos la tienda integral donde <span className="italic text-[#3D1A14] font-bold">"imaginar es crear"</span>.
          </p>
        </div>

        {/* Grid de Pilares con Tono Escolar */}
        <div className="grid md:grid-cols-3 gap-10 mb-24">
          {pilares.map((item, i) => (
            <div 
              key={i} 
              className="group bg-[#FFFBF0] p-10 rounded-[3.5rem] border border-orange-50 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 transform hover:-translate-y-2 active:scale-95"
            >
              <div className={`${item.color} text-white w-20 h-20 rounded-3xl flex items-center justify-center mb-10 shadow-lg group-hover:rotate-6 transition-transform rotate-[-3deg]`}>
                {item.icon}
              </div>
              <h3 className="text-2xl font-black text-[#3D1A14] mb-4 group-hover:text-[#FF5C00] transition-colors">
                {item.t}
              </h3>
              <p className="text-gray-600 leading-relaxed font-medium text-sm md:text-base ">
                {item.d}
              </p>
            </div>
          ))}
        </div>

        {/* Misión y Visión Compactas con Toque de Lápiz */}
        <div className="grid md:grid-cols-2 gap-8 relative">
          {/* Misión */}
          <div className="group bg-[#3D1A14] p-12 rounded-[4rem] shadow-2xl relative overflow-hidden transition-all hover:bg-[#4E2A22]">
            <div className="absolute -right-12 -bottom-12 text-white/5 group-hover:scale-110 transition-transform duration-500">
              <Target size={220} />
            </div>
            <div className="flex items-center gap-3 mb-8 text-[#FFB800]">
              <Target size={36} />
              <h4 className="text-3xl font-black uppercase tracking-tighter">Misión</h4>
            </div>
            <p className="text-orange-50/90 font-bold leading-relaxed relative z-10 text-base md:text-lg">
              Ofrecer a estudiantes, padres y docentes una amplia gama de artículos escolares y de oficina, 
              garantizando productos de excelencia, precios competitivos y atención cercana para mantener la 
              confianza de nuestra comunidad.
            </p>
          </div>

          {/* Visión */}
          <div className="group bg-white p-12 rounded-[4rem] border-4 border-orange-50/50 shadow-2xl shadow-orange-100/30 relative overflow-hidden transition-all hover:border-[#FFB800]">
            <div className="absolute -right-12 -bottom-12 text-orange-50 group-hover:scale-110 transition-transform duration-500">
              <Eye size={220} />
            </div>
            <div className="flex items-center gap-3 mb-8 text-[#FF5C00]">
              <Eye size={36} />
              <h4 className="text-3xl font-black uppercase tracking-tighter text-[#3D1A14]">Visión</h4>
            </div>
            <p className="text-gray-600 font-bold leading-relaxed relative z-10 text-base md:text-lg">
              Ser la tienda líder y referente en artículos escolares en la región, reconocida por nuestra calidad, 
              variedad y servicio personalizado, contribuyendo al desarrollo educativo y adaptándonos a las 
              nuevas tendencias pedagógicas.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}