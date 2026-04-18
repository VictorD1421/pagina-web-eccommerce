'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Save, Package, DollarSign, Hash, Edit3, Upload, Loader2, Trash2, ChevronDown, Calculator } from 'lucide-react'
import { supabase } from '@/src/lib/supabase'

interface Producto {
  id?: string
  nombre: string
  descripcion: string
  precio: number | string
  precio_bs?: number | string
  stock: number | string
  categoria: string
  imagen_url: string
}

interface CategoriaDB {
  nombre: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  productoEditar?: Producto | null
}

export default function ModalProducto({ isOpen, onClose, onSuccess, productoEditar }: Props) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loadingTasa, setLoadingTasa] = useState(false)
  const [categoriasDB, setCategoriasDB] = useState<string[]>([])
  const [tasaDolar, setTasaDolar] = useState<number>(0) 
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    precio_bs: '',
    stock: '',
    categoria: '', 
    imagen_url: ''
  })

  const stockNum = parseInt(formData.stock)
  const isStockInvalid = formData.stock !== '' && (stockNum < 1 || stockNum > 100)

  useEffect(() => {
    async function initData() {
      if (!isOpen) return
      try {
        setLoadingTasa(true)
        const { data: catData, error: catError } = await supabase
          .from('categorias')
          .select('nombre')
          .order('nombre', { ascending: true })

        if (catError) throw catError
        setCategoriasDB((catData as CategoriaDB[]).map(c => c.nombre))

        const { data: empresa, error: empError } = await supabase
          .from('datos_empresa')
          .select('tasa_dolar')
          .maybeSingle()

        if (empError) throw empError
        
        if (empresa?.tasa_dolar) {
          setTasaDolar(parseFloat(empresa.tasa_dolar))
        } else {
          const res = await fetch('/api/tasa')
          const data = await res.json()
          const price = data.price || data.monitors?.bcv?.price
          if (price) setTasaDolar(parseFloat(price))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingTasa(false)
      }
    }
    initData()
  }, [isOpen])

  useEffect(() => {
    const usd = parseFloat(formData.precio)
    if (!isNaN(usd) && tasaDolar > 0) {
      const calculo = (Math.max(0, usd) * tasaDolar).toFixed(2)
      setFormData(prev => ({ ...prev, precio_bs: calculo }))
    } else {
      setFormData(prev => ({ ...prev, precio_bs: '' }))
    }
  }, [formData.precio, tasaDolar])

  useEffect(() => {
    if (!isOpen) return
    if (productoEditar) {
      setFormData({
        nombre: productoEditar.nombre || '',
        descripcion: productoEditar.descripcion || '',
        precio: productoEditar.precio?.toString() || '',
        precio_bs: productoEditar.precio_bs?.toString() || '',
        stock: productoEditar.stock?.toString() || '',
        categoria: productoEditar.categoria || '',
        imagen_url: productoEditar.imagen_url || ''
      })
    } else {
      setFormData({ nombre: '', descripcion: '', precio: '', precio_bs: '', stock: '', categoria: '', imagen_url: '' })
    }
  }, [productoEditar, isOpen])

  useEffect(() => {
    if (!productoEditar && categoriasDB.length > 0 && !formData.categoria) {
      setFormData(prev => ({ ...prev, categoria: categoriasDB[0] }))
    }
  }, [categoriasDB, productoEditar])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const filePath = `fotos/${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('productos').upload(filePath, file)
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('productos').getPublicUrl(filePath)
      setFormData(prev => ({ ...prev, imagen_url: data.publicUrl }))
    } catch (error) {
      alert('Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isStockInvalid) return

    const precioNum = parseFloat(formData.precio)
    if (precioNum < 0) return alert('El precio no puede ser menor a 0')
    
    setLoading(true)
    const productData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion || '',
      precio: precioNum,
      precio_bs: parseFloat(formData.precio_bs) || 0,
      stock: parseInt(formData.stock),
      categoria: formData.categoria,
      imagen_url: formData.imagen_url
    }

    try {
      const { error } = productoEditar?.id 
        ? await supabase.from('productos').update(productData).eq('id', productoEditar.id)
        : await supabase.from('productos').insert([productData])
      
      if (error) throw error
      onSuccess()
      onClose()
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const inputStyle = "w-full px-5 py-4 bg-white border-2 border-orange-100 rounded-2xl focus:border-[#FF5C00] focus:ring-4 focus:ring-[#FF5C00]/10 outline-none transition-all text-[#3D1A14] font-semibold placeholder:text-gray-400"

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#3D1A14]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-orange-50 animate-in zoom-in duration-300">
        
        <div className={`p-8 border-b border-orange-50 flex justify-between items-center ${productoEditar ? 'bg-blue-50/30' : 'bg-orange-50/30'}`}>
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${productoEditar ? 'bg-blue-600 shadow-blue-100' : 'bg-[#FF5C00] shadow-orange-100'}`}>
              {productoEditar ? <Edit3 size={28} /> : <Package size={28} />}
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#3D1A14] leading-tight">{productoEditar ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <div className="flex items-center mt-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">Tasa en DB:</span>
                {loadingTasa ? <Loader2 size={14} className="animate-spin text-[#FF5C00]" /> : (
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${tasaDolar > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {tasaDolar > 0 ? `${tasaDolar.toFixed(2)} Bs/$` : 'No definida'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-50 text-[#3D1A14] hover:text-red-600 rounded-xl transition-colors">
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-sm font-black text-[#3D1A14] mb-2 block ml-1 uppercase tracking-tighter">Nombre del Producto</label>
              <input required type="text" className={inputStyle} placeholder="Ej: Cuaderno" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
            </div>

            <div>
              <label className="flex text-sm font-black text-[#3D1A14] mb-2 ml-1 items-center uppercase tracking-tighter">
                <DollarSign size={14} className="mr-1 text-[#FF5C00]" /> Precio USD
              </label>
              <input required type="number" step="0.01" min="0" className={inputStyle} placeholder="0.00" value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} />
            </div>

            <div className="relative">
              <label className="flex text-sm font-black text-blue-600 mb-2 ml-1 items-center uppercase tracking-tighter">
                <Calculator size={14} className="mr-1" /> Precio Bs (Cálculo)
              </label>
              <div className="relative">
                <input readOnly type="text" className={`${inputStyle} bg-blue-50/30 border-blue-100 text-blue-700 cursor-not-allowed font-black`} value={formData.precio_bs ? `${formData.precio_bs}` : ''} placeholder="---" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-300">VES</span>
              </div>
            </div>

            <div>
              <label className="flex text-sm font-black text-[#3D1A14] mb-2 ml-1 items-center uppercase tracking-tighter">
                <Hash size={14} className="mr-1" /> Stock
              </label>
              <input 
                required 
                type="number" 
                className={`${inputStyle} ${isStockInvalid ? 'border-red-500 focus:border-red-600 focus:ring-red-100' : ''}`} 
                placeholder="1 - 100" 
                value={formData.stock} 
                onChange={e => setFormData({...formData, stock: e.target.value})} 
              />
              {isStockInvalid && <p className="text-red-500 text-[10px] font-black mt-1 ml-1 uppercase tracking-widest">El stock debe estar entre 1 y 100</p>}
            </div>

            <div className="relative">
              <label className="text-sm font-black text-[#3D1A14] mb-2 block ml-1 uppercase tracking-tighter">Categoría</label>
              <div className="relative">
                <select required className={`${inputStyle} appearance-none pr-12`} value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}>
                  <option value="" disabled>Seleccionar...</option>
                  {categoriasDB.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-black text-[#3D1A14] mb-2 block ml-1 uppercase tracking-tighter">Imagen</label>
              <div className="relative h-[65px]">
                {!formData.imagen_url ? (
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full h-full border-2 border-dashed border-orange-200 rounded-2xl flex items-center justify-center bg-orange-50/50 hover:bg-orange-50 transition-all font-bold text-gray-500">
                    {uploading ? <Loader2 className="animate-spin text-[#FF5C00]" /> : <><Upload size={20} className="mr-2"/> Seleccionar Archivo</>}
                  </button>
                ) : (
                  <div className="w-full h-full flex items-center justify-between px-5 bg-green-50 border-2 border-green-200 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <img src={formData.imagen_url} className="w-11 h-11 rounded-lg object-cover shadow-sm" alt="Preview" />
                      <span className="text-xs font-black text-green-700">Imagen cargada correctamente</span>
                    </div>
                    <button type="button" onClick={() => setFormData({...formData, imagen_url: ''})} className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-black text-[#3D1A14] mb-2 block ml-1 uppercase tracking-tighter">Descripción Breve</label>
              <textarea rows={2} className={`${inputStyle} resize-none`} placeholder="Características principales..." value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-gray-100 text-[#3D1A14] font-black rounded-2xl hover:bg-gray-200 transition-all active:scale-95 uppercase tracking-tighter text-sm">Descartar</button>
            <button 
              type="submit" 
              disabled={loading || uploading || isStockInvalid || categoriasDB.length === 0} 
              className={`flex-[2] py-4 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 active:scale-95 uppercase tracking-tighter ${
                productoEditar ? 'bg-blue-600 shadow-blue-200' : 'bg-[#FF5C00] shadow-orange-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={22} /> <span>{productoEditar ? 'Actualizar Producto' : 'Guardar Producto'}</span></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}