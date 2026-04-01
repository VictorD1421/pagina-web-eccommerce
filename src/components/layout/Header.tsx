'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Sparkles, Star, PackageCheck } from 'lucide-react'

export const Header = () => {
  return (
    <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
      {/* Fondo Decorativo Dinámico */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF5C00]/10 rounded-full blur-[120px] opacity-60" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 20, 0] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-[#FFB800]/20 rounded-full blur-[100px] opacity-40" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* BLOQUE DE TEXTO */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-bold tracking-wide text-[#FF5C00] uppercase bg-orange-50 rounded-full border border-orange-100">
              <Sparkles size={16} />
              <span>¡Donde imaginar, es crear!</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-[#3D1A14] mb-6 tracking-tighter leading-[0.95]">
              Todo para el <br />
              <span className="text-[#FF5C00]">Colegio y Oficina</span>
            </h1>
            
            <p className="max-w-xl text-lg md:text-xl text-gray-600 mb-10 leading-relaxed font-medium">
              Desde cuadernos y uniformes hasta combos escolares completos. En <span className="text-[#3D1A14] font-bold">Inversiones Durí</span> equipamos tu creatividad con la mayor variedad de Maracay.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                href="/catalogo" 
                className="w-full sm:w-auto px-10 py-5 bg-[#FF5C00] text-white rounded-2xl font-black flex items-center justify-center space-x-2 hover:bg-[#3D1A14] transition-all transform hover:-translate-y-1 shadow-2xl shadow-orange-200 group"
              >
                <span>VER CATÁLOGO</span>
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Ubicación y Logo Cashea */}
            <div className="mt-10 flex flex-wrap gap-8 items-center border-t border-gray-100 pt-8">
              <div className="flex items-center gap-4">
                <img 
                  src="/branding/Cashea-Logo.png" 
                  alt="Cashea" 
                  className="h-6 w-auto object-contain"
                />
                <span className="text-sm font-bold text-gray-500 border-l border-gray-200 pl-4">
                  Compra ahora y paga después
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={18} className="text-[#FFB800]" />
                <span className="text-sm font-medium">Av. Bolívar, Calle Junin, Maracay 2101, Aragua</span>
              </div>
            </div>
          </div>

          {/* BLOQUE DE MASCOTA CON DINAMISMO AVANZADO */}
          <div className="relative hidden lg:flex justify-center items-center">
            
            {/* Elementos Flotantes Decorativos */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 left-10 z-20 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-2 border border-orange-50"
            >
              <PackageCheck className="text-green-500" size={20} />
              <span className="text-xs font-black text-[#3D1A14]">CALIDAD</span>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-10 right-10 z-20 bg-[#3D1A14] p-3 rounded-2xl shadow-xl flex items-center gap-2 text-white"
            >
              <Star className="text-[#FFB800] fill-[#FFB800]" size={18} />
              <span className="text-xs font-black italic">VARIEDAD</span>
            </motion.div>

            {/* Círculo de fondo con efecto de ROTACIÓN CONTINUA */}
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute w-[480px] h-[480px] bg-gradient-to-tr from-[#FFB800] via-[#FFB800]/40 to-transparent rounded-full opacity-20 blur-sm" 
            />
            
            {/* Segundo círculo sólido para dar profundidad */}
            <div className="absolute w-[450px] h-[450px] bg-[#FFB800]/10 rounded-full" />

            {/* Mascota Durí con Flotación y Hover */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="relative z-10 transition-shadow duration-500"
            >
               <img 
                  src="/branding/Durí-Mascota.png" 
                  alt="Mascota Durí" 
                  className="w-[450px] h-auto drop-shadow-[0_45px_45px_rgba(0,0,0,0.2)]"
                />
            </motion.div>
          </div>

        </div>

        {/* Marcas / Categorías rápidas */}
        <div className="mt-20 pt-10 border-t border-gray-100 grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-40">
            {['PAPELERÍA', 'UNIFORMES', 'MORRALES', 'ARTE', 'OFICINA'].map((text) => (
              <span key={text} className="font-black text-xl text-[#3D1A14] hover:opacity-100 transition-all hover:text-[#FF5C00] cursor-default">
                {text}
              </span>
            ))}
        </div>
      </div>
    </header>
  )
}