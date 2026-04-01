'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/src/lib/supabase'
import { 
  ShoppingCart, User, Menu, X,
  LogIn, LogOut, LayoutDashboard, ShieldCheck 
} from 'lucide-react'
import { 
  SiInstagram, 
  SiFacebook, 
  SiWhatsapp 
} from 'react-icons/si'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

// Hooks y Componentes
import { useCart } from '@/hooks/useCart' 
import { CartDrawer } from '../product/CartDrawer'    

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  // Estados de Usuario con carga controlada
  const [user, setUser] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  
  const { 
    cartItems, 
    loading: cartLoading, 
    fetchCartItems, 
    setCartItems,
    updateQuantity,
    removeItem,
    clearCart,
    processCheckout
  } = useCart(user)

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalogo' },
    { name: 'Nosotros', href: '/#nosotros' },
    { name: 'Contacto', href: '/#contacto' },
  ]

  const socialLinks = {
    instagram: process.env.NEXT_PUBLIC_COMPANY_INSTAGRAM || '#',
    facebook: process.env.NEXT_PUBLIC_COMPANY_FACEBOOK || '#',
    whatsapp: `https://wa.me/${(process.env.NEXT_PUBLIC_COMPANY_PHONE_1 || '').replace(/\D/g, '')}`
  }

  // 1. Manejo Consolidado de Sesión y Perfil con Tipado Correcto
  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      try {
        const { data } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()
        
        if (data) setPerfil(data)
      } catch (err) {
        console.error("Error cargando perfil:", err)
      } finally {
        setIsAuthLoading(false)
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        if (currentUser) {
          await fetchProfile(currentUser.id)
        } else {
          setPerfil(null)
          setIsAuthLoading(false)
          
          if (typeof setCartItems === 'function') {
            setCartItems([])
          }
          
          queryClient.removeQueries({ queryKey: ['cart'] })
          queryClient.clear() 
        }

        if (event === 'SIGNED_OUT') {
          router.push('/')
          router.refresh()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, queryClient, setCartItems])

  // 2. Fetch de carrito (solo si el ID de usuario existe)
  useEffect(() => {
    if (user?.id) {
      fetchCartItems()
    }
  }, [user?.id, fetchCartItems])

  // 3. Efectos de UI
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    setIsUserMenuOpen(false)
    setIsCartOpen(false)
    await supabase.auth.signOut()
  }

  // Lógica de visualización del nombre
  const userDisplayName = perfil?.nombre 
    ? perfil.nombre.split(' ')[0] 
    : user?.email?.split('@')[0] || 'Cuenta'

  // Verificación de permisos administrativos
  const isAdmin = perfil?.rol === 'admin' || perfil?.rol === 'super_user'

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' 
          : 'bg-white py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          <div className="flex items-center gap-10">
            <Link href="/" className="relative z-[60] flex items-center group">
              <motion.div 
                animate={{ scale: isScrolled ? 0.8 : 1, y: isScrolled ? 0 : 5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative w-24 h-12 md:w-36 md:h-22"
              >
                <Image 
                  src="/branding/Durí-Logo.png" 
                  alt="Logo Inversiones Durí"
                  fill
                  className="object-contain transition-transform group-hover:scale-105"
                  priority
                />
              </motion.div>
            </Link>

            {/* NAV DESKTOP */}
            <div className="hidden lg:flex items-center bg-gray-50/50 border border-gray-100 rounded-full px-2 py-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`px-5 py-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all rounded-full ${
                      isActive ? 'bg-[#3D1A14] text-white' : 'text-[#3D1A14]/50 hover:text-[#FF5C00]'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 relative z-[60]">
            {/* USER MENU */}
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                disabled={isAuthLoading}
                className={`flex items-center gap-2 p-1 pr-3 rounded-full border transition-all ${
                  user ? 'border-orange-100 bg-orange-50/30' : 'border-gray-100 hover:bg-gray-50'
                } ${isAuthLoading ? 'opacity-50 cursor-wait' : ''}`}
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all ${
                  user ? 'bg-[#3D1A14] shadow-md' : 'bg-gray-100'
                }`}>
                  <User size={user ? 18 : 20} className={user ? 'text-[#FF5C00]' : 'text-gray-400'} />
                </div>
                <span className="hidden md:block text-[10px] font-black uppercase tracking-widest text-[#3D1A14]">
                  {isAuthLoading ? '...' : userDisplayName}
                </span>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-orange-50 overflow-hidden py-3 z-[70]"
                  >
                    {user ? (
                      <div className="flex flex-col">
                        <div className="px-6 py-4 bg-orange-50/50 mx-3 rounded-2xl mb-2">
                          <p className="text-[9px] text-[#FF5C00] font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                            {isAdmin && <ShieldCheck size={10} />}
                            {perfil?.role || 'Cliente'}
                          </p>
                          <p className="text-sm font-black text-[#3D1A14] truncate">{perfil?.nombre || 'Usuario Durí'}</p>
                          <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                        </div>
                        <div className="px-2">
                          {isAdmin && (
                            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-[#3D1A14] hover:bg-orange-50 rounded-xl transition-all">
                              <LayoutDashboard size={16} className="text-[#FF5C00]" /> Panel Administrativo
                            </Link>
                          )}
                          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-red-500 hover:bg-red-50 font-black rounded-xl transition-all">
                            <LogOut size={16} /> Cerrar Sesión
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3">
                        <Link href="/login" className="flex items-center justify-center gap-3 w-full py-4 bg-[#3D1A14] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-[#FF5C00] transition-all shadow-lg">
                          <LogIn size={18} /> Iniciar Sesión
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CART BUTTON */}
            {user && (
              <button 
                onClick={() => setIsCartOpen(true)}
                className={`relative group p-3 rounded-2xl transition-all ${
                  isCartOpen ? 'bg-[#FF5C00] shadow-orange-200' : 'bg-[#3D1A14] hover:bg-[#FF5C00]'
                } shadow-xl active:scale-90`}
              >
                <ShoppingCart size={20} className="text-white" />
                {cartItems.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-[#FFB800] text-[#3D1A14] text-[10px] font-black h-6 w-6 rounded-full flex items-center justify-center border-4 border-white shadow-sm"
                  >
                    {cartItems.length}
                  </motion.span>
                )}
              </button>
            )}

            {/* MOBILE TOGGLE */}
            <button 
              className="lg:hidden p-2 text-[#3D1A14] hover:bg-gray-100 rounded-xl transition-colors" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-white z-[55] lg:hidden flex flex-col p-8 pt-32"
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={link.name}
                  >
                    <Link 
                      href={link.href}
                      className="text-4xl font-black text-[#3D1A14] uppercase tracking-tighter hover:text-[#FF5C00] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto border-t border-gray-100 pt-8 flex flex-col gap-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Nuestras Redes</p>
                <div className="flex gap-4">
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-50 rounded-2xl text-[#3D1A14] hover:bg-orange-50 transition-colors">
                    <SiInstagram size={20} />
                  </a>
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-50 rounded-2xl text-[#3D1A14] hover:bg-orange-50 transition-colors">
                    <SiFacebook size={20} />
                  </a>
                  <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white rounded-2xl transition-transform active:scale-95">
                    <SiWhatsapp size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer 
        isOpen={isCartOpen} 
        setIsOpen={setIsCartOpen} 
        items={cartItems} 
        loading={cartLoading}
        onUpdateQty={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
        onCheckout={processCheckout}
      />
    </>
  )
}