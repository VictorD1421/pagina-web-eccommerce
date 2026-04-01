'use client'

import React, { useEffect, useState } from 'react'
import { 
  Mail, 
  MapPin, 
  ExternalLink, 
  Clock,
  ArrowRight,
  MessageSquare,
  Check
} from 'lucide-react'
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa'

export const Contacto = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPhone, setSelectedPhone] = useState(1) // 1 o 2

  const contactInfo = {
    phone1: process.env.NEXT_PUBLIC_COMPANY_PHONE_1 || '+58 424-3657447',
    phone2: process.env.NEXT_PUBLIC_COMPANY_PHONE_2 || '+58 424-3013452',
    email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'inversionesduri@gmail.com',
    map: process.env.NEXT_PUBLIC_COMPANY_MAP_LINK || '#',
    instagram: process.env.NEXT_PUBLIC_COMPANY_INSTAGRAM || '#',
    facebook: process.env.NEXT_PUBLIC_COMPANY_FACEBOOK || '#',
  }

  // Lógica de disponibilidad (Hora de Venezuela)
  useEffect(() => {
    const checkStatus = () => {
      const now = new Date()
      const vzlaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Caracas" }))
      
      const day = vzlaTime.getDay()
      const hours = vzlaTime.getHours()

      // Lunes (1) a Sábado (6) de 8:00 a 18:00
      const isWorkingDay = day >= 1 && day <= 6
      const isWorkingHour = hours >= 8 && hours < 18

      setIsOpen(isWorkingDay && isWorkingHour)
    }

    checkStatus()
    const interval = setInterval(checkStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  const whatsappLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, '')}`

  return (
    <section id="contacto" className="py-32 bg-[#2D120D] scroll-mt-24 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[#FF5C00]/5 rounded-[100%] blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[#FFB800] font-black text-xs uppercase tracking-[0.3em] mb-4">
              <MessageSquare size={16} />
              Canales Oficiales
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">
              Estamos <br />
              <span className="text-[#FF5C00]">Contigo.</span>
            </h2>
          </div>
          <p className="text-orange-50/40 font-medium text-lg max-w-xs border-l-2 border-[#FF5C00]/30 pl-6">
            Resolvemos tus dudas en tiempo real. Elige el canal que prefieras.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* CANAL: VENTAS WHATSAPP (Con selector de número) */}
          <div className="group relative bg-white/[0.03] border border-white/10 p-8 rounded-[3rem] transition-all duration-500 overflow-hidden hover:border-[#FF5C00]/50">
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-14 h-14 bg-[#FF5C00]/20 rounded-2xl flex items-center justify-center text-[#FF5C00] mb-12 group-hover:bg-[#FF5C00] group-hover:text-white transition-all duration-500">
                <FaWhatsapp size={28} />
              </div>
              
              <h3 className="text-3xl font-black text-white uppercase mb-6">WhatsApp</h3>
              
              <div className="space-y-3 mb-8">
                <button 
                  onClick={() => setSelectedPhone(1)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedPhone === 1 ? 'bg-[#FF5C00] border-[#FF5C00] text-white' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                >
                  <span className="font-bold">{contactInfo.phone1}</span>
                  {selectedPhone === 1 && <Check size={18} />}
                </button>
                <button 
                  onClick={() => setSelectedPhone(2)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedPhone === 2 ? 'bg-[#FF5C00] border-[#FF5C00] text-white' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                >
                  <span className="font-bold">{contactInfo.phone2}</span>
                  {selectedPhone === 2 && <Check size={18} />}
                </button>
              </div>

              <a 
                href={whatsappLink(selectedPhone === 1 ? contactInfo.phone1 : contactInfo.phone2)} 
                target="_blank"
                className="mt-auto w-full py-5 bg-white text-[#2D120D] rounded-2xl font-black uppercase tracking-tighter flex items-center justify-center gap-3 hover:bg-[#FF5C00] hover:text-white transition-all group/btn"
              >
                Chatear Ahora <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
              </a>
            </div>
            <FaWhatsapp className="absolute -bottom-6 -right-6 size-48 text-white/5 -rotate-12 group-hover:text-[#FF5C00]/5 transition-colors" />
          </div>

          {/* CANAL: SEDE FÍSICA */}
          <div className="group relative bg-white/[0.03] border border-white/10 p-8 rounded-[3rem] hover:bg-[#FFB800] transition-all duration-500 overflow-hidden">
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-14 h-14 bg-[#FFB800]/20 rounded-2xl flex items-center justify-center text-[#FFB800] mb-12 group-hover:bg-[#3D1A14] group-hover:text-[#FFB800] transition-all">
                <MapPin size={28} />
              </div>
              <h3 className="text-3xl font-black text-white group-hover:text-[#3D1A14] uppercase mb-2">Visítanos</h3>
              <p className="text-[#FFB800] group-hover:text-[#3D1A14] font-bold text-xl mb-8">Maracay, Aragua.</p>
              
              <div className="mt-auto text-orange-50/60 group-hover:text-[#3D1A14]/70 mb-6 text-sm font-medium">
                Calle Junín, Maracay 2101. <br /> Punto de referencia: Cerca de la Plaza Bolívar.
              </div>

              <a href={contactInfo.map} target="_blank" className="inline-flex items-center justify-center gap-3 py-5 bg-white/10 group-hover:bg-[#3D1A14] text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                Google Maps <ExternalLink size={16} />
              </a>
            </div>
            <MapPin className="absolute -bottom-6 -right-6 size-48 text-white/5 -rotate-12 group-hover:text-[#3D1A14]/5 transition-colors" />
          </div>

          {/* CANAL: DIGITAL */}
          <div className="group relative bg-white/[0.03] border border-white/10 p-8 rounded-[3rem] hover:bg-white transition-all duration-500 overflow-hidden">
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-12 group-hover:bg-[#3D1A14] group-hover:text-white transition-all">
                <Mail size={28} />
              </div>
              <h3 className="text-3xl font-black text-white group-hover:text-[#3D1A14] uppercase mb-2">Social</h3>
              <a href={`mailto:${contactInfo.email}`} className="text-[#FFB800] group-hover:text-[#FF5C00] font-bold text-lg block mb-8 break-all transition-colors">
                {contactInfo.email}
              </a>
              
              <div className="mt-auto flex gap-4">
                {[
                  { icon: <FaInstagram size={24} />, href: contactInfo.instagram, label: 'Instagram' },
                  { icon: <FaFacebookF size={24} />, href: contactInfo.facebook, label: 'Facebook' }
                ].map((item, idx) => (
                  <a 
                    key={idx}
                    href={item.href} 
                    target="_blank" 
                    className="flex-1 p-5 bg-white/5 group-hover:bg-[#3D1A14] text-white flex items-center justify-center rounded-2xl hover:scale-105 transition-all"
                    aria-label={item.label}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
            <Mail className="absolute -bottom-6 -right-6 size-48 text-white/5 -rotate-12 group-hover:text-[#3D1A14]/5 transition-colors" />
          </div>
        </div>

        {/* BARRA DE HORARIO - DINÁMICA */}
        <div className="mt-12 inline-flex flex-wrap items-center gap-6 px-8 py-5 bg-white/[0.02] border border-white/5 rounded-[2rem] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${isOpen ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_12px_rgba(239,44,44,0.5)]'}`} />
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isOpen ? 'text-green-500' : 'text-red-500'}`}>
              {isOpen ? 'Operativo Ahora' : 'Fuera de Horario'}
            </span>
          </div>
          <div className="h-6 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-3 text-white/80 font-bold text-sm">
            <Clock size={18} className="text-[#FFB800]" />
            Lunes a Sábado: 8:00 AM — 6:00 PM
          </div>
        </div>
      </div>
    </section>
  )
}