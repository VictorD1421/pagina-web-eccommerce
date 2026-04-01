'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiMapPin, FiPhone, FiMail, FiClock, FiExternalLink } from 'react-icons/fi'
import { SiInstagram, SiFacebook, SiWhatsapp } from 'react-icons/si'

export const Footer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const currentYear = new Date().getFullYear()

  const phone1 = process.env.NEXT_PUBLIC_COMPANY_PHONE_1
  const phone2 = process.env.NEXT_PUBLIC_COMPANY_PHONE_2
  const email = process.env.NEXT_PUBLIC_COMPANY_EMAIL
  const instagram = process.env.NEXT_PUBLIC_COMPANY_INSTAGRAM
  const facebook = process.env.NEXT_PUBLIC_COMPANY_FACEBOOK
  const linktree = process.env.NEXT_PUBLIC_COMPANY_LINKTREE
  const mapLink = process.env.NEXT_PUBLIC_COMPANY_MAP_LINK
  const rif = process.env.NEXT_PUBLIC_COMPANY_RIF || 'J-31456201-4'

  // Lógica para verificar si está abierto
  useEffect(() => {
    const checkStatus = () => {
      const now = new Date()
      // Ajuste opcional: Si el servidor no está en VZLA, podrías usar Intl para obtener la hora exacta de Maracay
      const venezuelaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Caracas" }))
      
      const day = venezuelaTime.getDay() // 0 = Domingo, 1 = Lunes...
      const hours = venezuelaTime.getHours()

      // Abierto de Lunes (1) a Sábado (6) entre las 8:00 y las 18:00
      const isWorkingDay = day >= 1 && day <= 6
      const isWorkingHour = hours >= 8 && hours < 18

      setIsOpen(isWorkingDay && isWorkingHour)
    }

    checkStatus()
    const interval = setInterval(checkStatus, 60000) // Verificar cada minuto
    return () => clearInterval(interval)
  }, [])

  const formatWhatsApp = (num: string | undefined) => {
    return num ? num.replace(/\D/g, '') : ''
  }

  return (
    <footer id="footer-contacto" className="bg-[#3D1A14] text-white pt-24 pb-10 relative overflow-hidden">
      {/* Elementos Dinámicos de Fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF5C00]/5 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FFB800]/5 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4" />
      
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 mb-20">
          
          {/* Columna 1: Branding Dinámico */}
          <div className="flex flex-col gap-8">
            <Link href="/" className="inline-block group">
              <div className="relative w-[280px] h-[140px] -mt-10 -ml-4 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1"> 
                <Image 
                  src="/footer/Durí-Footer.png" 
                  alt="Logo Inversiones Durí"
                  fill
                  sizes="280px"
                  className="object-contain object-left drop-shadow-2xl"
                  priority 
                />
              </div>
            </Link>
            
            <div className="space-y-4">
              <p className="text-orange-50/70 font-medium leading-relaxed text-sm max-w-[300px]">
                Donde imaginar... es crear. <br />
                Tu aliado integral en artículos escolares, oficina y hogar en el corazón de Maracay.
              </p>
              
              <div className="flex gap-3">
                {[
                  { icon: <SiInstagram size={20} />, href: instagram, color: 'hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]' },
                  { icon: <SiFacebook size={20} />, href: facebook, color: 'hover:bg-[#1877F2]' },
                  { icon: <SiWhatsapp size={20} />, href: `https://wa.me/${formatWhatsApp(phone1)}`, color: 'hover:bg-[#25D366]' }
                ].map((social, i) => (
                  <Link 
                    key={i}
                    href={social.href || '#'} 
                    target="_blank" 
                    className={`w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md hover:scale-110 hover:-translate-y-1 ${social.color}`}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Columna 2: Navegación Estilizada */}
          <div className="lg:pl-10">
            <h4 className="text-[#FFB800] font-black uppercase tracking-[0.2em] text-[10px] mb-8 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[#FFB800]/30"></span> Explorar
            </h4>
            <ul className="space-y-4 font-bold text-orange-50/80 text-sm">
              <li>
                <Link href="/catalogo" className="group flex items-center gap-2 hover:text-[#FFB800] transition-all">
                  <span className="w-0 group-hover:w-2 h-[2px] bg-[#FFB800] transition-all"></span>
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href={linktree || '#'} target="_blank" className="group flex items-center gap-2 hover:text-[#FFB800] transition-all">
                  <span className="w-0 group-hover:w-2 h-[2px] bg-[#FFB800] transition-all"></span>
                  Nuestros Enlaces <FiExternalLink size={14} className="opacity-50" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Información de Contacto */}
          <div>
            <h4 className="text-[#FFB800] font-black uppercase tracking-[0.2em] text-[10px] mb-8 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[#FFB800]/30"></span> Contacto
            </h4>
            <ul className="space-y-6 text-sm">
              <li>
                <Link href={mapLink || '#'} target="_blank" className="flex gap-4 group">
                  <div className="w-10 h-10 bg-[#FF5C00]/10 rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#FF5C00]">
                    <FiMapPin className="text-[#FF5C00] group-hover:text-white" size={18} />
                  </div>
                  <span className="text-orange-50/80 group-hover:text-white transition-colors leading-snug">
                    Calle Junín, <br /> Maracay 2101, Aragua.
                  </span>
                </Link>
              </li>
              <li className="space-y-4">
                <Link href={`https://wa.me/${formatWhatsApp(phone1)}`} target="_blank" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-500 transition-colors">
                    <FiPhone className="text-green-500 group-hover:text-white" size={18} />
                  </div>
                  <span className="font-bold text-base group-hover:text-white transition-colors">{phone1}</span>
                </Link>
                <Link href={`mailto:${email}`} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-[#FFB800]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#FFB800] transition-colors">
                    <FiMail className="text-[#FFB800] group-hover:text-white" size={18} />
                  </div>
                  <span className="text-orange-50/80 group-hover:text-white transition-colors break-all">{email}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Horario Moderno con Estado en Vivo */}
          <div>
            <h4 className="text-[#FFB800] font-black uppercase tracking-[0.2em] text-[10px] mb-8 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[#FFB800]/30"></span> Horario
            </h4>
            <div className="relative group">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${isOpen ? 'from-green-500/20 to-[#FFB800]/20' : 'from-red-500/20 to-[#3D1A14]'} rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500`}></div>
              <div className="relative bg-[#3D1A14] p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-black text-[10px] uppercase tracking-widest ${isOpen ? 'text-green-500' : 'text-red-500'}`}>
                    {isOpen ? 'Abierto Ahora' : 'Cerrado Ahora'}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="block text-[10px] font-bold text-orange-50/40 uppercase mb-1">Lunes a Sábado</span>
                  <p className="text-2xl font-black text-white leading-none">8:00 AM</p>
                  <p className="text-2xl font-black text-[#FFB800]">6:00 PM</p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-orange-50/40 text-[10px] font-bold uppercase">
                  <FiClock /> Domingos Cerrado
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-[10px] font-black text-orange-50/30 uppercase tracking-[0.3em]">
              © {currentYear} INVERSIONES DURÍ C.A. • RIF {rif}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-orange-50/20">
            <span className="w-4 h-[1px] bg-white/10"></span>
            DESARROLLADO POR ALEXANDER SALGUERA
            <span className="w-4 h-[1px] bg-white/10"></span>
          </div>
        </div>
      </div>
    </footer>
  )
}