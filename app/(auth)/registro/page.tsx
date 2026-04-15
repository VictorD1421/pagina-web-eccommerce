'use client'

import React, { useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { 
  UserPlus, Mail, Lock, User, ArrowRight, Sparkles, 
  CheckCircle2, AlertCircle, Phone, ChevronLeft 
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null)
  const router = useRouter()

  // Handlers para validación en tiempo real (Input Masking)
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reemplaza cualquier cosa que NO sea letra o espacio
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
    setNombre(value)
  }

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reemplaza cualquier cosa que NO sea número
    const value = e.target.value.replace(/[^0-9]/g, '')
    setTelefono(value)
  }

  const validateForm = () => {
    // 1. Validar Nombre (No vacío y sin números)
    if (!nombre.trim() || /[\d]/.test(nombre)) {
      setStatus({ type: 'error', msg: 'El nombre es obligatorio y no puede contener números.' })
      return false
    }

    // 2. Validar Teléfono (Mínimo 7 dígitos y solo números)
    if (telefono.length < 7) {
      setStatus({ type: 'error', msg: 'Ingresa un número de teléfono válido (solo números).' })
      return false
    }

    // 3. Validar Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus({ type: 'error', msg: 'Por favor, ingresa un correo electrónico válido.' })
      return false
    }

    // 4. Validar Contraseña
    if (password.length < 6) {
      setStatus({ type: 'error', msg: 'La contraseña debe tener al menos 6 caracteres.' })
      return false
    }

    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)

    if (!validateForm()) return

    setLoading(true)
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: nombre.trim(),
          phone_number: telefono 
        }
      }
    })

    if (error) {
      setStatus({ type: 'error', msg: error.message })
      setLoading(false)
    } else {
      setStatus({ 
        type: 'success', 
        msg: '¡Casi listo! Revisa tu correo para confirmar tu registro.' 
      })
      setLoading(false)
      
      // Limpiar campos
      setEmail('')
      setPassword('')
      setNombre('')
      setTelefono('')
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center p-0 relative overflow-hidden">
      
      <Link 
        href="/" 
        className="fixed top-6 left-6 z-50 flex items-center gap-2.5 px-5 py-3 bg-white/40 backdrop-blur-md text-[#3D1A14] rounded-full font-bold text-sm transition-all hover:bg-white hover:shadow-lg group shadow-sm border border-white/50"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
        Volver al inicio
      </Link>

      <div className="flex w-full max-w-[1200px] h-[850px] bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(61,26,20,0.15)] overflow-hidden border border-orange-50 animate-in fade-in zoom-in duration-500">
        
        {/* PANEL IZQUIERDO */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center overflow-y-auto">
          
          <div className="mb-8 text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-4 text-xs font-black tracking-[0.15em] text-[#FF5C00] uppercase bg-orange-50 rounded-full border border-orange-100">
                <UserPlus size={16} className="animate-bounce"/>
                <span>Forma parte de Durí</span>
            </div>
            <h1 className="text-4xl font-black text-[#3D1A14] tracking-tighter mb-2">Crear mi cuenta</h1>
            <p className="text-gray-500 font-medium italic">¡Donde imaginar, es crear!</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 relative z-10">
            {status && (
              <div className={`p-4 rounded-2xl text-sm font-bold border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                status.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'
              }`}>
                {status.type === 'error' ? <AlertCircle size={20} className="shrink-0" /> : <CheckCircle2 size={20} className="shrink-0" />}
                <span>{status.msg}</span>
              </div>
            )}

            {/* Input Nombre */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#3D1A14]/40 uppercase tracking-[0.2em] ml-2">Nombre Completo</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5C00] transition-colors" size={18} />
                <input 
                  type="text" required value={nombre} onChange={handleNombreChange}
                  className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-[1.2rem] focus:border-orange-200 focus:bg-white outline-none transition-all font-bold text-[#3D1A14] placeholder:text-gray-300"
                  placeholder="Solo letras"
                />
              </div>
            </div>

            {/* Input Teléfono */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#3D1A14]/40 uppercase tracking-[0.2em] ml-2">Teléfono de Contacto</label>
              <div className="relative group">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5C00] transition-colors" size={18} />
                <input 
                  type="tel" required value={telefono} onChange={handleTelefonoChange}
                  className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-[1.2rem] focus:border-orange-200 focus:bg-white outline-none transition-all font-bold text-[#3D1A14] placeholder:text-gray-300"
                  placeholder="Solo números"
                />
              </div>
            </div>

            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#3D1A14]/40 uppercase tracking-[0.2em] ml-2">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5C00] transition-colors" size={18} />
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-[1.2rem] focus:border-orange-200 focus:bg-white outline-none transition-all font-bold text-[#3D1A14] placeholder:text-gray-300"
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            {/* Input Contraseña */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#3D1A14]/40 uppercase tracking-[0.2em] ml-2">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5C00] transition-colors" size={18} />
                <input 
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-[1.2rem] focus:border-orange-200 focus:bg-white outline-none transition-all font-bold text-[#3D1A14] placeholder:text-gray-300"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="group w-full relative overflow-hidden bg-[#3D1A14] py-4.5 rounded-[1.2rem] font-black text-white text-lg transition-all shadow-2xl hover:shadow-orange-200/40 disabled:opacity-50 transform active:scale-95 shadow-[0_15px_30px_-5px_rgba(61,26,20,0.2)] mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF5C00] to-[#FFB800] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-3">
                <span>{loading ? 'Procesando registro...' : 'Registrarme ahora'}</span>
                {!loading && <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />}
              </div>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center text-center">
            <p className="text-gray-400 font-medium mb-3 text-sm">¿Ya tienes una cuenta en Durí?</p>
            <Link 
              href="/login" 
              className="text-[#FF5C00] font-black hover:underline decoration-2 underline-offset-4 transition-all"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="hidden md:block w-1/2 relative group overflow-hidden">
          <Image 
            src="/bg/fachada.jpg" 
            alt="Fachada Inversiones Durí" 
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-1000 select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#3D1A14]/85 via-[#3D1A14]/40 to-[#FF5C00]/80" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center z-10 select-none pointer-events-none">
            <div className="relative mb-8 p-6 bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-2xl">
              <Image 
                src="/branding/Durí-Mascota.png" 
                alt="Mascota Durí" 
                width={120} 
                height={120}
                className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] animate-float"
              />
              <Sparkles className="absolute -top-2 -right-2 text-[#FFB800]" size={28} />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter mb-4 leading-tight">
              ¡Tu oficina y colegio <br /> en un solo lugar!
            </h2>
            <p className="text-orange-50 font-bold text-lg opacity-90">
              Registrate para gestionar tus pedidos y recibir beneficios exclusivos en Maracay.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}