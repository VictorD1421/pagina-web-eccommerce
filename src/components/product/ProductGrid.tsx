'use client'

import React from 'react'
import Image from 'next/image'
import { Package, Tag, Circle, Landmark } from 'lucide-react'
import { Producto } from '@/types/products'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/src/lib/supabase'

interface ProductGridProps {
  productos: Producto[]
}

export const ProductGrid = ({ productos }: ProductGridProps) => {
  // Obtenemos la tasa del dólar de la base de datos
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

  // Función helper para formatear el precio en Bs
  const formatPrecioBs = (prod: Producto) => {
    // Si el producto tiene un precio_bs fijo, lo usamos; si no, calculamos por tasa
    const precioBase = prod.precio_bs && prod.precio_bs > 0 
      ? prod.precio_bs 
      : (prod.precio * tasaDolar);
    
    return precioBase.toLocaleString('es-VE', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }

  if (productos.length === 0) {
    return (
      <div className="text-center py-24 bg-[#FFFBF0] rounded-[3rem] border-4 border-dashed border-orange-100">
        <Package size={64} className="mx-auto text-orange-200 mb-4" />
        <h3 className="text-2xl font-black text-[#3D1A14]">¡Oh no! El estante está vacío</h3>
        <p className="text-gray-500 font-medium mt-2">Estamos reponiendo el inventario para que sigas creando.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      {productos.map((prod) => (
        <div 
          key={prod.id} 
          className="bg-white rounded-[2.5rem] border border-orange-50 overflow-hidden hover:shadow-[0_20px_50px_rgba(255,92,0,0.12)] transition-all duration-500 group flex flex-col relative"
        >
          {/* Badge de Categoría */}
          {prod.categoria && (
            <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-orange-100 shadow-sm flex items-center gap-1.5">
              <Tag size={12} className="text-[#FF5C00]" />
              <span className="text-[10px] font-black text-[#3D1A14] uppercase tracking-wider">
                {prod.categoria}
              </span>
            </div>
          )}

          {/* Contenedor de Imagen */}
          <div className="relative h-72 w-full bg-orange-50/20 overflow-hidden">
            <Image
              src={prod.imagen_url || 'https://via.placeholder.com/400'}
              alt={prod.nombre}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              priority={false}
            />
            
            {/* Overlay de Stock Bajo */}
            {prod.stock < 5 && prod.stock > 0 && (
              <div className="absolute bottom-4 left-4 right-4 bg-[#FFB800] text-[#3D1A14] text-[10px] font-black px-3 py-2 rounded-xl uppercase text-center shadow-lg border border-white/20 animate-pulse z-10">
                Últimas unidades
              </div>
            )}
            
            {/* Overlay de Agotado */}
            {prod.stock === 0 && (
              <div className="absolute inset-0 bg-[#3D1A14]/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                <span className="bg-white text-[#3D1A14] px-5 py-2 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl rotate-[-3deg]">
                  Agotado
                </span>
              </div>
            )}
          </div>

          {/* Cuerpo de la Tarjeta */}
          <div className="p-7 flex flex-col flex-1 relative bg-white">
            <div className="absolute top-6 right-6">
              <Circle 
                size={8} 
                className="fill-orange-100 text-orange-100 group-hover:fill-[#FFB800] group-hover:text-[#FFB800] transition-all duration-500 group-hover:scale-150" 
              />
            </div>

            <h2 className="text-xl font-black text-[#3D1A14] mb-2 line-clamp-1 group-hover:text-[#FF5C00] transition-colors tracking-tight">
              {prod.nombre}
            </h2>
            
            <p className="text-gray-400 text-sm mb-8 line-clamp-2 h-10 font-medium leading-relaxed group-hover:text-gray-500 transition-colors">
              {prod.descripcion || 'Calidad garantizada para tus proyectos escolares y de oficina.'}
            </p>

            {/* Footer con Precio Dual */}
            <div className="flex flex-col gap-3 mt-auto pt-5 border-t border-gray-50">
              <div className="flex items-center justify-between">
                
                {/* Bloque de Precios */}
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xs font-black text-[#FF5C00]">$</span>
                    <span className="text-2xl font-black text-[#3D1A14] tracking-tighter">
                      {prod.precio.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Precio en Bolívares */}
                  <div className="flex items-center gap-1 text-blue-600">
                    <Landmark size={10} className="mt-0.5" />
                    <span className="text-[11px] font-black tracking-tight">
                      {formatPrecioBs(prod)} <small className="text-[8px]">Bs</small>
                    </span>
                  </div>
                </div>

                {/* Badge de disponibilidad */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-[9px] uppercase tracking-wide border ${
                  prod.stock > 0 
                  ? 'bg-green-50/50 text-green-600 border-green-100' 
                  : 'bg-gray-50 text-gray-400 border-gray-100'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${prod.stock > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  {prod.stock > 0 ? 'En Stock' : 'Agotado'}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}