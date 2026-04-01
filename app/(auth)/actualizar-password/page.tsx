'use client'

import React, { useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { Lock, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ActualizarPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' })
      return
    }

    setLoading(true)
    setMessage(null)

    // Supabase detecta automáticamente el token de la URL
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      setMessage({ type: 'error', text: 'Error al actualizar: ' + error.message })
      setLoading(false)
    } else {
      setMessage({ type: 'success', text: '¡Contraseña actualizada con éxito!' })
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center p-6">
      <div className="w-full max-w-[500px] bg-white rounded-[3.5rem] p-10 md:p-14 shadow-[0_50px_100px_-20px_rgba(61,26,20,0.1)] border border-orange-50">
        
        <div className="flex flex-col mb-10 text-center items-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-6 text-xs font-black tracking-[0.15em] text-[#FF5C00] uppercase bg-orange-50 rounded-full border border-orange-100">
              <Sparkles size={16} />
              <span>Nueva Contraseña</span>
          </div>
          <h1 className="text-4xl font-black text-[#3D1A14] tracking-tighter mb-4">Crea tu nueva clave</h1>
          <p className="text-gray-500 font-medium">Por seguridad, elige una contraseña que no hayas usado antes.</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          {message && (
            <div className={`${message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'} p-5 rounded-2xl text-sm font-bold border text-center`}>
              {message.text}
            </div>
          )}

          <div className="space-y-2.5">
            <label className="text-[11px] font-black text-[#3D1A14]/40 uppercase tracking-[0.25em] ml-2">Nueva Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5C00] transition-colors" size={20} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-16 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:border-orange-200 focus:bg-white outline-none transition-all font-bold text-[#3D1A14]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#3D1A14] transition-colors p-2"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-[11px] font-black text-[#3D1A14]/40 uppercase tracking-[0.25em] ml-2">Confirmar Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5C00] transition-colors" size={20} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-14 pr-4 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:border-orange-200 focus:bg-white outline-none transition-all font-bold text-[#3D1A14]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="group w-full relative overflow-hidden bg-[#3D1A14] py-5 rounded-[1.5rem] font-black text-white text-lg transition-all shadow-2xl disabled:opacity-50 active:scale-95 shadow-[0_20px_40px_-10px_rgba(61,26,20,0.2)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF5C00] to-[#FFB800] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-center gap-3">
              <span>{loading ? 'Actualizando...' : 'Cambiar contraseña'}</span>
              <CheckCircle2 size={20} />
            </div>
          </button>
        </form>
      </div>
    </div>
  )
}