'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/src/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UserCog, 
  ShieldCheck, 
  ShieldAlert, 
  Loader2, 
  Search, 
  Users,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react'

interface Perfil {
  id: string
  nombre: string
  email: string
  rol: string
  created_at?: string
}

const ITEMS_PER_PAGE = 10

export default function UsersPage() {
  const [usuarios, setUsuarios] = useState<Perfil[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(0)
  const [totalUsuarios, setTotalUsuarios] = useState(0)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [confirmModal, setConfirmModal] = useState<{ id: string; nombre: string; nuevoRol: string } | null>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) setCurrentUserId(data.session.user.id)
    }
    getSession()
  }, [])

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchUsuarios = useCallback(async (page: number, search: string) => {
    setLoading(true)
    const desde = page * ITEMS_PER_PAGE
    const hasta = desde + ITEMS_PER_PAGE - 1

    let query = supabase
      .from('perfiles')
      .select('*', { count: 'exact' })
      .order('nombre', { ascending: true })
      .range(desde, hasta)

    if (search) {
      query = query.or(`nombre.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, error, count } = await query
    if (!error && data) {
      setUsuarios(data)
      if (count !== null) setTotalUsuarios(count)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchUsuarios(pagina, busqueda) }, [pagina, fetchUsuarios])
  useEffect(() => { setPagina(0); fetchUsuarios(0, busqueda) }, [busqueda, fetchUsuarios])

  const ejecutarCambioRol = async () => {
    if (!confirmModal) return
    const { id, nuevoRol } = confirmModal

    const { error } = await supabase
      .from('perfiles')
      .update({ rol: nuevoRol })
      .eq('id', id)

    if (error) {
      showToast("Error al actualizar permisos", 'error')
    } else {
      setUsuarios(prev => prev.map(u => u.id === id ? { ...u, rol: nuevoRol } : u))
      showToast("Rol actualizado con éxito")
    }
    setConfirmModal(null)
  }

  const haySiguiente = (pagina + 1) * ITEMS_PER_PAGE < totalUsuarios

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 relative overflow-hidden">
      
      {/* Notificaciones Emergentes */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border-2 bg-white ${
              toast.type === 'success' ? 'border-green-100 text-green-700' : 'border-red-100 text-red-700'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            <span className="font-bold uppercase text-xs tracking-wider">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Confirmación */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#3D1A14]/40 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-orange-100 text-center"
            >
              <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-[#FF5C00] mx-auto mb-6">
                <ShieldAlert size={40} />
              </div>
              <h3 className="text-2xl font-black text-[#3D1A14] mb-2 uppercase tracking-tight">¿Confirmar Cambio?</h3>
              <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                Vas a otorgar el rol de <span className="text-[#FF5C00] font-bold uppercase">{confirmModal.nuevoRol}</span> a {confirmModal.nombre}.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-100"
                >
                  Cancelar
                </button>
                <button 
                  onClick={ejecutarCambioRol}
                  className="flex-1 py-4 bg-[#FF5C00] text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-[#e05200] transition-all"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 bg-[#FF5C00] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-200">
              <Users size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#3D1A14] tracking-tight">Control de Personal</h1>
              <p className="text-orange-600 font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
                Inversiones Durí C.A. • Dashboard Administrativo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5C00] transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Nombre o correo..."
                className="pl-12 pr-6 py-4 bg-white border-2 border-orange-100 rounded-[2rem] outline-none w-full md:w-80 font-bold shadow-sm focus:border-[#FF5C00] transition-all text-[#3D1A14] placeholder:text-gray-400"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <button 
              onClick={() => fetchUsuarios(pagina, busqueda)}
              className="p-4 bg-white border-2 border-orange-100 rounded-2xl text-[#3D1A14] hover:bg-orange-50 transition-colors shadow-sm active:scale-95"
              title="Refrescar lista"
            >
              <RefreshCw size={24} className={loading ? 'animate-spin text-[#FF5C00]' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-orange-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-orange-50/30">
                  <th className="p-8 text-[#3D1A14] font-black uppercase text-xs tracking-[0.2em]">Identidad</th>
                  <th className="p-8 text-[#3D1A14] font-black uppercase text-xs tracking-[0.2em]">Contacto</th>
                  <th className="p-8 text-[#3D1A14] font-black uppercase text-xs tracking-[0.2em]">Nivel de Acceso</th>
                  <th className="p-8 text-[#3D1A14] font-black uppercase text-xs tracking-[0.2em] text-center">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-[#FF5C00]" size={48} />
                        <p className="text-[#3D1A14] font-black tracking-widest text-sm">SINCRONIZANDO DATOS...</p>
                      </div>
                    </td>
                  </tr>
                ) : usuarios.map((user) => (
                  <tr key={user.id} className="hover:bg-orange-50/20 transition-all duration-200">
                    <td className="p-8">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          user.rol === 'super_user' ? 'bg-purple-100 text-purple-600' : 
                          user.rol === 'admin' ? 'bg-orange-100 text-[#FF5C00]' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <UserCog size={24} />
                        </div>
                        <span className="font-black text-lg text-[#3D1A14]">{user.nombre}</span>
                      </div>
                    </td>
                    <td className="p-8 text-gray-500 font-bold">{user.email}</td>
                    <td className="p-8">
                      <select 
                        disabled={user.rol === 'super_user' || user.id === currentUserId}
                        value={user.rol}
                        onChange={(e) => setConfirmModal({ id: user.id, nombre: user.nombre, nuevoRol: e.target.value })}
                        className={`px-6 py-3 rounded-2xl font-black border-2 outline-none transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                          user.rol === 'super_user' ? 'bg-purple-50 border-purple-100 text-purple-700' :
                          user.rol === 'admin' ? 'bg-orange-50 border-orange-200 text-[#FF5C00]' : 'bg-blue-50 border-blue-200 text-blue-700'
                        }`}
                      >
                        {user.rol === 'super_user' && <option value="super_user">Desarrollador</option>}
                        <option value="usuario">Usuario (Vendedor)</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </td>
                    <td className="p-8 text-center">
                      {user.rol === 'super_user' ? (
                        <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full border border-purple-100 text-[10px] font-black uppercase tracking-widest">Root</span>
                      ) : user.rol === 'admin' ? (
                        <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100 text-[10px] font-black uppercase tracking-widest">Acceso Total</span>
                      ) : (
                        <span className="px-4 py-2 bg-gray-50 text-gray-400 rounded-full border border-gray-100 text-[10px] font-black uppercase tracking-widest">Estándar</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="p-6 bg-orange-50/20 border-t border-orange-50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#3D1A14] font-bold text-sm">
              <span className="text-[#FF5C00]">{totalUsuarios}</span> usuarios registrados
            </p>
            <div className="flex items-center space-x-2">
              <button 
                disabled={pagina === 0 || loading}
                onClick={() => setPagina(p => p - 1)}
                className="p-3 bg-white border-2 border-orange-100 rounded-xl disabled:opacity-30 hover:border-[#FF5C00] transition-all active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="px-6 py-2 bg-white border-2 border-orange-100 rounded-xl font-black text-[#3D1A14] text-sm">
                {pagina + 1}
              </div>
              <button 
                disabled={!haySiguiente || loading}
                onClick={() => setPagina(p => p + 1)}
                className="p-3 bg-white border-2 border-orange-100 rounded-xl disabled:opacity-30 hover:border-[#FF5C00] transition-all active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}