'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { 
  Package, Plus, Search, Edit3, Trash2, 
  Filter, ChevronDown, Tag, AlertCircle, Loader2, DollarSign
} from 'lucide-react'
import { supabase } from '@/src/lib/supabase'
import ModalProducto from './components/ModalProduct'
import ModalCategoria from './components/ModalCategory'

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number; 
  stock: number;
  imagen_url: string;
  categoria: string;
}

export default function ProductosAdminPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [tasaDolar, setTasaDolar] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState('Todas')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCatModalOpen, setIsCatModalOpen] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      
      const { data: prods, error: pError } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: cats, error: cError } = await supabase
        .from('categorias')
        .select('nombre')
        .order('nombre', { ascending: true })

      const { data: empresa, error: eError } = await supabase
        .from('datos_empresa')
        .select('tasa_dolar')
        .maybeSingle()

      if (pError || cError || eError) throw pError || cError || eError

      setProductos(prods || [])
      
      setCategorias(cats?.map((c: { nombre: string }) => c.nombre) || [])
      
      if (empresa) setTasaDolar(empresa.tasa_dolar)

    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async (id: string, nombre: string) => {
    const confirmar = confirm(`¿Estás seguro de eliminar "${nombre}"?`)
    if (!confirmar) return

    try {
      const { error } = await supabase.from('productos').delete().eq('id', id)
      if (error) throw error
      setProductos(productos.filter(p => p.id !== id))
    } catch (error) {
      alert('Error al eliminar')
    }
  }

  const abrirModalEdicion = (producto: Producto) => {
    setSelectedProducto(producto)
    setIsModalOpen(true)
  }

  const filteredProductos = useMemo(() => {
    return productos.filter(p => {
      const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (p.categoria && p.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = filterCategoria === 'Todas' || p.categoria === filterCategoria
      return matchesSearch && matchesCategory
    })
  }, [productos, searchTerm, filterCategoria])


  const formatBs = (precioUsd: number) => {
    const total = precioUsd * tasaDolar
    return total.toLocaleString('es-VE', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-orange-100/50 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#FF5C00]/10 rounded-lg">
              <Package className="text-[#FF5C00]" size={24} />
            </div>
            <span className="text-sm font-bold text-[#FF5C00] uppercase tracking-widest">Panel de Control</span>
          </div>
          <h2 className="text-5xl font-black text-[#3D1A14] tracking-tight">Inventario</h2>
          <div className="flex items-center mt-3 bg-orange-50 border border-orange-100 w-fit px-4 py-2 rounded-2xl shadow-sm">
            <DollarSign size={16} className="text-[#FF5C00] mr-2" />
            <p className="text-[#3D1A14] text-sm font-bold">
              Tasa del día: <span className="text-[#FF5C00] font-black">{tasaDolar > 0 ? `${tasaDolar.toFixed(2)} Bs` : 'Cargando...'}</span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setIsCatModalOpen(true)}
            className="group bg-white border-2 border-orange-100 hover:border-[#FFB800] text-[#3D1A14] px-6 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-sm"
          >
            <Tag size={18} className="text-[#FFB800] group-hover:rotate-12 transition-transform" />
            <span>Gestionar Categorías</span>
          </button>

          <button 
            onClick={() => { setSelectedProducto(null); setIsModalOpen(true); }}
            className="bg-[#3D1A14] hover:bg-[#25100c] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl shadow-[#3D1A14]/10 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D1A14]/40 group-focus-within:text-[#FF5C00] transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Buscar por nombre, descripción o categoría..."
            className="w-full pl-14 pr-6 py-5 bg-white border-2 border-orange-100 rounded-[1.5rem] focus:outline-none focus:border-[#FF5C00] transition-all shadow-sm text-[#3D1A14] font-semibold placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3D1A14]/40" size={18} />
          <select 
            className="w-full pl-14 pr-12 py-5 bg-white border-2 border-orange-100 rounded-[1.5rem] focus:outline-none focus:border-[#FF5C00] appearance-none font-bold text-[#3D1A14] cursor-pointer shadow-sm transition-all"
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
          >
            <option value="Todas">Todas las Categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[#3D1A14]/40 pointer-events-none" size={18} />
        </div>
      </div>
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,92,0,0.05)] border border-orange-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFFBF0]/50 text-[#3D1A14]/50 text-xs uppercase tracking-[0.2em] font-black">
                <th className="px-10 py-7">Detalle de Producto</th>
                <th className="px-6 py-7">Categoría</th>
                <th className="px-6 py-7 text-center">Precio (USD / BS)</th>
                <th className="px-6 py-7 text-center">Stock</th>
                <th className="px-10 py-7 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-32">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <Loader2 className="animate-spin text-[#FF5C00]" size={40} />
                      <p className="text-[#3D1A14] font-bold animate-pulse">Sincronizando inventario...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProductos.length > 0 ? (
                filteredProductos.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FFFBF0]/40 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-5">
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl overflow-hidden border border-orange-100 shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
                          {prod.imagen_url ? (
                            <img src={prod.imagen_url} alt={prod.nombre} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-orange-200">
                              <Package size={28} />
                            </div>
                          )}
                        </div>
                        <div className="max-w-xs">
                          <p className="font-black text-lg text-[#3D1A14] group-hover:text-[#FF5C00] transition-colors truncate">
                            {prod.nombre}
                          </p>
                          <p className="text-sm text-gray-400 font-medium line-clamp-1 italic">
                            {prod.descripcion || 'Sin descripción detallada'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="inline-flex items-center px-4 py-1.5 bg-white border border-orange-100 text-[#3D1A14] text-[11px] font-black rounded-full shadow-sm">
                        <Tag size={10} className="mr-2 text-[#FFB800]" />
                        {prod.categoria?.toUpperCase() || 'S/C'}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-black text-[#3D1A14]">
                          <span className="text-[#FF5C00] text-sm mr-0.5">$</span>
                          {prod.precio.toFixed(2)}
                        </span>
                        <div className="mt-1 px-2.5 py-0.5 bg-blue-50 border border-blue-100 rounded-lg">
                           <span className="text-[10px] font-black text-blue-600 whitespace-nowrap">
                            {tasaDolar > 0 
                              ? `${formatBs(prod.precio)} Bs` 
                              : '--- Bs'
                            }
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col items-center justify-center">
                        <span className={`text-sm font-black mb-1 ${prod.stock <= 5 ? 'text-red-600' : 'text-[#3D1A14]'}`}>
                          {prod.stock} unids.
                        </span>
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full transition-all duration-1000 ${prod.stock <= 5 ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min((prod.stock / 50) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end space-x-3">
                        <button 
                          onClick={() => abrirModalEdicion(prod)} 
                          className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                          title="Editar producto"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleEliminar(prod.id, prod.nombre)} 
                          className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                          title="Eliminar de inventario"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                      <AlertCircle size={48} className="text-gray-400" />
                      <p className="text-xl font-bold text-gray-500">No se encontraron resultados</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ModalCategoria 
        isOpen={isCatModalOpen} 
        onClose={() => setIsCatModalOpen(false)} 
        onSuccess={fetchData} 
      />
      <ModalProducto 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
        productoEditar={selectedProducto} 
      />
    </div>
  )
}