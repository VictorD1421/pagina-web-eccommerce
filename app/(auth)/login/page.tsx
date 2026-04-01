'use client'

import React, { useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2, ChevronLeft, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Credenciales incorrectas. Por favor, verifica tus datos.')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center p-0 relative overflow-hidden">
      
      {/* Botón de retorno rápido moderno y dinámico (estilo segunda imagen) */}
      <Link 
        href="/" 
        className="fixed top-6 left-6 z-50 flex items-center gap-2.5 px-5 py-3 bg-white/40 backdrop-blur-md text-[#3D1A14] rounded-full font-bold text-sm transition-all hover:bg-white hover:shadow-lg group shadow-sm border border-white/50"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
        Volver al inicio
      </Link>

      <div className="flex w-full max-w-[1200px] h-[750px] bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(61,26,20,0.15)] overflow-hidden border border-orange-50 animate-in fade-in zoom-in duration-500">
        
        {/* PANEL IZQUIERDO: Formulario de Login (Limpio y Moderno) */}
        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          
          <div className="flex flex-col mb-12">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-4 text-xs font-black tracking-[0.15em] text-[#FF5C00] uppercase bg-orange-50 rounded-full border border-orange-100 self-start">
                <Sparkles size={16} className="animate-pulse"/>
                <span>¡Donde imaginar, es crear!</span>
            </div>
            <h1 className="text-5xl font-black text-[#3D1A14] tracking-tighter mb-3 leading-[1.1]">¡Hola de nuevo!</h1>
            <p className="text-gray-500 font-medium text-lg leading-relaxed">Ingresa a tu cuenta en <span className="text-[#FF5C00] font-bold">Inversiones Durí</span></p>
          </div>

          <form onSubmit={handleLogin} className="space-y-7 relative z-10">
            {error && (
              <div className="bg-red-50 text-red-600 p-5 rounded-2xl text-sm font-bold border border-red-100 text-center animate-shake">
                {error}
              </div>
            )}

            {/* Input Email Optimizado */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-black text-[#3D1A14]/40 uppercase tracking-[0.25em] ml-2">Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5C00] transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-4 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:border-orange-200 focus:bg-white outline-none transition-all font-bold text-[#3D1A14] placeholder:text-gray-300"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            {/* Input Password Optimizado */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center ml-2">
                <label className="text-[11px] font-black text-[#3D1A14]/40 uppercase tracking-[0.25em]">Contraseña</label>
                <Link href="/recuperar" className="text-xs font-bold text-[#FF5C00] hover:underline decoration-2 underline-offset-4">¿Olvidaste tu clave?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5C00] transition-colors" size={20} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-16 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:border-orange-200 focus:bg-white outline-none transition-all font-bold text-[#3D1A14] placeholder:text-gray-300"
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

            {/* Botón Principal Moderno con Gradiente Durí */}
            <button 
              disabled={loading}
              className="group w-full relative overflow-hidden bg-[#3D1A14] py-5 rounded-[1.5rem] font-black text-white text-lg transition-all shadow-2xl hover:shadow-orange-200/40 disabled:opacity-50 transform active:scale-95 shadow-[0_20px_40px_-10px_rgba(61,26,20,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF5C00] to-[#FFB800] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-3">
                <span>{loading ? 'Cargando...' : 'Iniciar Sesión'}</span>
                {!loading && <ArrowRight size={24} className="group-hover:translate-x-1.5 transition-transform" />}
              </div>
            </button>
          </form>

          {/* Registro Seccción */}
          <div className="mt-12 pt-10 border-t border-gray-100 flex flex-col items-center text-center">
            <p className="text-gray-400 font-medium mb-5">¿No tienes cuenta todavía?</p>
            <Link 
              href="/registro" 
              className="w-full py-4.5 px-6 border-2 border-gray-100 text-[#3D1A14] rounded-2xl font-black hover:border-[#FFB800] hover:bg-orange-50/50 transition-all active:scale-[0.98] text-center"
            >
              Crea tu cuenta gratis
            </Link>
          </div>
        </div>

        {/* PANEL DERECHO: Banner Visual Inmersivo (Fachada Durí) */}
        <div className="hidden md:block w-1/2 relative group overflow-hidden">
          <Image 
            src="/bg/fachada.jpg" 
            alt="Fachada Inversiones Durí" 
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
            priority
          />
          {/* Overlay de color de la marca */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#3D1A14]/90 via-[#FF5C00]/85 to-[#FFB800]/70 select-none pointer-events-none" />
          
          {/* Contenido del Banner */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center z-10 select-none pointer-events-none">
            <div className="relative mb-10 p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl">
              <Image 
                src="/branding/Durí-Mascota.png" 
                alt="Mascota Durí" 
                width={120} 
                height={120}
                className="object-contain drop-shadow-2xl"
              />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter mb-4 leading-tight">Inversiones Durí C.A.</h2>
            <p className="text-orange-50 font-bold max-w-sm">Equipamos tu creatividad en Maracay con la mayor variedad en artículos escolares, de oficina y hogar.</p>
            
            <div className="mt-10 flex items-center gap-2.5 px-4 py-2 text-xs font-black tracking-widest text-[#3D1A14] uppercase bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Compra los mejores útiles</span>
            </div>
          </div>
          
          {/* Footer info sutil */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-center select-none pointer-events-none">
            <p className="text-[11px] text-orange-100 font-bold uppercase tracking-[0.4em] mb-2">
              Av. Bolívar Este • Maracay
            </p>
            <div className="w-12 h-1 bg-orange-100/50 mx-auto rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}