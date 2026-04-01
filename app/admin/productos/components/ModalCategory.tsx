'use client'

import React, { useState } from 'react'
import { X, Tag, Loader2 } from 'lucide-react'
import { supabase } from '@/src/lib/supabase'

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalCategoria({ isOpen, onClose, onSuccess }: Props) {
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from('categorias')
        .insert([{ nombre: nombre.trim() }])

      if (error) throw error
      
      setNombre('')
      onSuccess()
      onClose()
    } catch (error: any) {
      alert(error.message || 'Error al crear la categoría')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#3D1A14]/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-orange-50 overflow-hidden">
        <div className="px-8 py-6 border-b border-orange-50 flex justify-between items-center bg-[#FFFBF0]/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FFB800] rounded-lg text-white">
              <Tag size={20} />
            </div>
            <h3 className="text-xl font-black text-[#3D1A14]">Nueva Categoría</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-orange-50 rounded-full text-gray-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#3D1A14] mb-2">Nombre de la Categoría</label>
            <input
              autoFocus
              type="text"
              /* He añadido text-[#3D1A14] y font-bold para máxima visibilidad */
              className="w-full px-5 py-4 bg-orange-50/50 border border-orange-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/20 text-[#3D1A14] font-bold placeholder:text-gray-400"
              placeholder="Ej: Escolar, Oficina..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !nombre.trim()}
            className="w-full bg-[#3D1A14] hover:bg-[#25100c] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-orange-100"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Guardar Categoría'}
          </button>
        </form>
      </div>
    </div>
  )
}