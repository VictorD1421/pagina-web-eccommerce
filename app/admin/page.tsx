'use client'

import React, { useEffect, useState } from 'react'
import { Package, Users, Clock, TrendingUp } from 'lucide-react'
import { supabase } from '@/src/lib/supabase'

// Interfaces
interface Perfil {
  nombre: string | null;
  email: string | null;
}

interface Pedido {
  id: string;
  total: number;
  estado: string;
  created_at: string;
  perfiles: Perfil | Perfil[] | null;
}

interface Stats {
  productos: number;
  usuarios: number;
  pedidos: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ productos: 0, usuarios: 0, pedidos: 0 })
  const [recentOrders, setRecentOrders] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      setLoading(true)
      
      // 1. Obtener conteos de forma eficiente
      const [prodRes, userRes, orderRes] = await Promise.all([
        supabase.from('productos').select('*', { count: 'exact', head: true }),
        supabase.from('perfiles').select('*', { count: 'exact', head: true }),
        supabase.from('pedidos').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente')
      ])

      // 2. Obtener los 5 pedidos más recientes con relación de perfiles
      const { data: orders, error } = await supabase
        .from('pedidos')
        .select(`
          id,
          total,
          estado,
          created_at,
          perfiles ( nombre, email )
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error

      setStats({
        productos: prodRes.count || 0,
        usuarios: userRes.count || 0,
        pedidos: orderRes.count || 0
      })

      setRecentOrders((orders as unknown as Pedido[]) || [])
    } catch (error) {
      console.error('Error cargando dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5C00]"></div>
      </div>
    )
  }

  return (
    <>
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-5xl font-black text-[#3D1A14] tracking-tight">Panel de Control</h2>
          <p className="text-gray-400 text-lg font-medium mt-2">Bienvenido de nuevo al centro de operaciones.</p>
        </div>
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-orange-100 flex items-center space-x-4 pr-6">
           <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-[#FF5C00]">
              <TrendingUp size={24} />
           </div>
           <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Estado del Sistema</p>
              <p className="text-sm font-bold text-green-500">En línea</p>
           </div>
        </div>
      </header>

      {/* Métrica Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard title="Productos" value={stats.productos} icon={<Package />} color="bg-blue-50 text-blue-600" />
        <StatCard title="Usuarios" value={stats.usuarios} icon={<Users />} color="bg-purple-50 text-purple-600" />
        <StatCard title="Pendientes" value={stats.pedidos} icon={<Clock />} color="bg-orange-50 text-[#FF5C00]" highlight />
      </div>

      {/* Tabla de Pedidos */}
      <section className="bg-white rounded-[3rem] p-10 shadow-xl shadow-orange-100/50 border border-orange-50">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-[#3D1A14]">Ventas Recientes</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr className="text-gray-400 text-sm uppercase tracking-widest font-bold">
                <th className="px-6 py-2">Cliente</th>
                <th className="px-6 py-2">Fecha</th>
                <th className="px-6 py-2">Total</th>
                <th className="px-6 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const perfil = Array.isArray(order.perfiles) ? order.perfiles[0] : order.perfiles;
                return (
                  <tr key={order.id} className="bg-[#FFFBF0]/50 hover:bg-[#FFFBF0] transition-colors group">
                    <td className="px-6 py-5 rounded-l-[1.5rem]">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center font-black text-[#3D1A14]">
                          {perfil?.nombre?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-[#3D1A14]">{perfil?.nombre || 'Desconocido'}</p>
                          <p className="text-xs text-gray-400 font-medium">{perfil?.email || 'Sin email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-500 font-bold">
                      {new Date(order.created_at).toLocaleDateString('es-VE')}
                    </td>
                    <td className="px-6 py-5 font-black text-[#3D1A14]">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-5 rounded-r-[1.5rem]">
                      <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        order.estado === 'pendiente' ? 'bg-orange-100 text-[#FF5C00]' : 'bg-green-100 text-green-600'
                      }`}>
                        {order.estado}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {recentOrders.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-400 font-bold">No hay pedidos registrados recientemente.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

// Componente StatCard con tipado estricto
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactElement<{ size?: number }>; // Tipado del Icono de Lucide
  color: string;
  highlight?: boolean;
}

function StatCard({ title, value, icon, color, highlight = false }: StatCardProps) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-orange-100/30 border border-orange-50 flex items-center space-x-6 hover:translate-y-[-4px] transition-transform duration-300">
      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${color}`}>
        {React.cloneElement(icon, { size: 30 })}
      </div>
      <div>
        <h3 className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-1">{title}</h3>
        <p className={`text-4xl font-black tracking-tight ${highlight ? 'text-[#FF5C00]' : 'text-[#3D1A14]'}`}>{value}</p>
      </div>
    </div>
  )
}