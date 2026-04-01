'use client'

import React, { useEffect, useState } from 'react'
import { LayoutDashboard, Package, Users, ShoppingCart, LogOut, Settings, ChevronRight, User } from 'lucide-react'
import { supabase } from '@/src/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [userData, setUserData] = useState<{ name: string, role: string, initials: string } | null>(null)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Asumiendo que guardas el nombre en user_metadata o usamos el email como fallback
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin Usuario'
        const role = user.user_metadata?.role || 'Administrador'
        
        // Lógica para iniciales (Primera letra nombre + Primera letra apellido)
        const names = fullName.split(' ')
        const initials = names.length > 1 
          ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
          : names[0].substring(0, 2).toUpperCase()

        setUserData({ name: fullName, role, initials })
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="fixed inset-0 flex bg-[#FDFCF9] z-[100]">
      
      {/* Sidebar Lateral */}
      <aside className="w-72 bg-[#3D1A14] text-white p-8 flex flex-col shadow-2xl h-full border-r border-white/5">
        <div className="mb-12">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFB800] to-[#FF5C00] rounded-2xl flex items-center justify-center text-[#3D1A14] font-black text-2xl shadow-lg group-hover:rotate-6 transition-all duration-300">
              D
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white">DURÍ<span className="text-[#FFB800]">ADMIN</span></h1>
              <p className="text-[10px] text-orange-200/30 uppercase font-black tracking-[0.2em]">Suministros Mariu</p>
            </div>
          </Link>
        </div>

        <nav className="space-y-2 flex-1">
          <AdminNavItem href="/admin" icon={<LayoutDashboard size={20}/>} label="Dashboard" active={pathname === '/admin'} />
          <AdminNavItem href="/admin/productos" icon={<Package size={20}/>} label="Productos" active={pathname.includes('/productos')} />
          <AdminNavItem href="/admin/ventas" icon={<ShoppingCart size={20}/>} label="Ventas" active={pathname.includes('/ventas')} />
          <AdminNavItem href="/admin/users" icon={<Users size={20}/>} label="Usuarios" active={pathname.includes('/users')} />
          <div className="pt-4 mt-4 border-t border-white/5">
            <AdminNavItem href="/admin/config" icon={<Settings size={20}/>} label="Ajustes" active={pathname.includes('/config')} />
          </div>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 p-4 text-orange-100/40 hover:text-white hover:bg-white/5 rounded-2xl transition-all mt-auto font-bold group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span>Finalizar Sesión</span>
        </button>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header Mejorado */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-orange-100/50 px-10 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2 bg-orange-50/50 px-4 py-2 rounded-xl border border-orange-100/50">
              <span className="text-xs font-black text-[#3D1A14]/30 uppercase tracking-widest">Panel</span>
              <ChevronRight size={14} className="text-orange-200" />
              <span className="text-sm font-black text-[#FF5C00] capitalize">
                {pathname.split('/').pop() === 'admin' ? 'Resumen General' : pathname.split('/').pop()?.replace('-', ' ')}
              </span>
          </div>
          
          <div className="flex items-center">
            {/* Perfil de Usuario Dinámico */}
            <div className="flex items-center pl-6 border-l border-orange-100 space-x-4 group cursor-default">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-[#3D1A14] leading-none mb-1">
                  {userData?.name || 'Cargando...'}
                </p>
                <div className="inline-block px-2 py-0.5 bg-[#FFB800]/10 rounded-md">
                  <p className="text-[10px] font-black text-[#FFB800] uppercase tracking-tighter">
                    {userData?.role || 'Admin'}
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-12 h-12 bg-[#3D1A14] rounded-2xl flex items-center justify-center font-black text-white shadow-xl shadow-[#3D1A14]/10 group-hover:scale-105 transition-transform duration-300 overflow-hidden border-2 border-orange-50">
                  {userData?.initials ? (
                    <span className="text-lg tracking-tighter">{userData.initials}</span>
                  ) : (
                    <User size={20} className="animate-pulse" />
                  )}
                  {/* Indicador de estado online */}
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-12 bg-[#FDFCF9]">
          {children}
        </main>
      </div>
    </div>
  )
}

function AdminNavItem({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center space-x-4 p-4 rounded-2xl font-black transition-all duration-300 group ${
        active 
          ? 'bg-[#FF5C00] text-white shadow-xl shadow-orange-500/20' 
          : 'text-orange-100/40 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className={`${active ? 'scale-110' : 'group-hover:scale-110 group-hover:text-[#FFB800]'} transition-all`}>
        {icon}
      </span>
      <span className="tracking-tight">{label}</span>
      {active && (
        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
      )}
    </Link>
  )
}