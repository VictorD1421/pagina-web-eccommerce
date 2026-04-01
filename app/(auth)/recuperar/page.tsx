'use client'

import React, { useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { Mail, ArrowRight, ChevronLeft, Sparkles, Send } from 'lucide-react'
import Link from 'next/link'

export default function RecuperarPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Esta URL debe estar configurada en tu Dashboard de Supabase (Auth -> URL Configuration)
      redirectTo: `${window.location.origin}/actualizar-password`,
    })

    if (error) {
      setMessage({ type: 'error', text: 'No pudimos enviar el correo. Verifica tu dirección.' })
    } else {
      setMessage({ type: 'success', text: '¡Enlace enviado! Revisa tu bandeja de entrada.' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center p-6 relative overflow-hidden">
      
      <Link 
        href="/login" 
        className="fixed top-6 left-6 z-50 flex items-center gap-2.5 px-5 py-3 bg-white/40 backdrop-blur-md text-[#3D1A14] rounded-full font-bold text-sm transition-all hover:bg-white hover:shadow-lg group border border-white/50"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Volver al login
      </Link>

      <div className="w-full max-w-[550px] bg-white rounded-[3.5rem] p-10 md:p-16 shadow-[0_50px_100px_-20px_rgba(61,26,20,0.1)] border border-orange-50 animate-in fade-in zoom-in duration-500">
        
        <div className="flex flex-col mb-10 text-center items-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-6 text-xs font-black tracking-[0.15em] text-[#FF5C00] uppercase bg-orange-50 rounded-full border border-orange-100">
              <Sparkles size={16} />
              <span>Recuperación de Acceso</span>
          </div>
          <h1 className="text-4xl font-black text-[#3D1A14] tracking-tighter mb-4">¿Olvidaste tu clave?</h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            No te preocupes. Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          {message && (
            <div className={`${message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'} p-5 rounded-2xl text-sm font-bold border text-center animate-in fade-in duration-300`}>
              {message.text}
            </div>
          )}

          <div className="space-y-2.5">
            <label className="text-[11px] font-black text-[#3D1A14]/40 uppercase tracking-[0.25em] ml-2">Tu Correo Electrónico</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5C00] transition-colors" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-4 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:border-orange-200 focus:bg-white outline-none transition-all font-bold text-[#3D1A14]"
                placeholder="ejemplo@correo.com"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="group w-full relative overflow-hidden bg-[#3D1A14] py-5 rounded-[1.5rem] font-black text-white text-lg transition-all shadow-2xl disabled:opacity-50 active:scale-95 shadow-[0_20px_40px_-10px_rgba(61,26,20,0.2)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF5C00] to-[#FFB800] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-center gap-3">
              <span>{loading ? 'Enviando...' : 'Enviar enlace'}</span>
              <Send size={20} className={loading ? 'animate-pulse' : 'group-hover:translate-x-1 transition-transform'} />
            </div>
          </button>
        </form>
      </div>
    </div>
  )
}