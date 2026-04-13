'use client'

import React from 'react'
import { 
  BookOpen, HelpCircle, Package, Users, ShieldCheck, 
  Search, Edit3, Tag, AlertCircle, ShoppingBag, 
  MapPin, ImageIcon, Landmark, DollarSign, RefreshCw, 
  Info, CreditCard
} from 'lucide-react'

export default function ManualPage() {
  const secciones = [
    {
      id: 'inventario',
      titulo: 'Gestión de Inventario',
      icono: <Package className="text-[#FF5C00]" size={24} />,
      color: 'bg-orange-50',
      contenido: [
        {
          subtitulo: 'Registro y Edición',
          texto: 'Para añadir un producto, usa "Nuevo Producto". El sistema calcula automáticamente el precio en Bolívares según la tasa configurada.',
          icon: <Edit3 size={18} />
        },
        {
          subtitulo: 'Categorización',
          texto: 'Organiza productos mediante categorías para facilitar el filtrado tanto en la tienda pública como en el panel de control.',
          icon: <Tag size={18} />
        },
        {
          subtitulo: 'Control de Stock',
          texto: 'Si el stock es igual o menor a 5 unidades, el indicador cambiará a rojo como alerta visual de reabastecimiento crítico.',
          icon: <AlertCircle size={18} className="text-red-500" />
        }
      ]
    },
    {
      id: 'ventas',
      titulo: 'Monitoreo de Ventas',
      icono: <ShoppingBag className="text-green-600" size={24} />,
      color: 'bg-green-50',
      contenido: [
        {
          subtitulo: 'Validación de Pagos',
          texto: 'Cada venta incluye un acceso al comprobante digital. Es vital verificar que la referencia coincida con su estado de cuenta.',
          icon: <ImageIcon size={18} />
        },
        {
          subtitulo: 'Logística de Envío',
          texto: 'El sistema diferencia entre "Retiro en Tienda" y direcciones de envío específicas. Puede buscar por destino en el filtro principal.',
          icon: <MapPin size={18} />
        },
        {
          subtitulo: 'Búsqueda Inteligente',
          texto: 'Use el buscador para localizar transacciones rápidamente por nombre del cliente, número de referencia o destino del paquete.',
          icon: <Search size={18} />
        }
      ]
    },
    {
      id: 'configuracion',
      titulo: 'Parámetros del Sistema',
      icono: <Landmark className="text-purple-600" size={24} />,
      color: 'bg-purple-50',
      contenido: [
        {
          subtitulo: 'Tasa del Dólar',
          texto: 'Puede actualizar la tasa manualmente o usar el botón de sincronización para obtener el valor oficial del BCV en tiempo real.',
          icon: <RefreshCw size={18} />
        },
        {
          subtitulo: 'Datos Móvil Pago',
          texto: 'Asegúrese de mantener actualizados el teléfono, banco y RIF. Estos datos se muestran directamente al cliente al finalizar su compra.',
          icon: <CreditCard size={18} />
        },
        {
          subtitulo: 'Seguridad de Datos',
          texto: 'Al guardar cambios en configuración, se sincroniza globalmente. El botón cambiará a "Sincronizando DB" durante el proceso.',
          icon: <ShieldCheck size={18} />
        }
      ]
    },
    {
      id: 'usuarios',
      titulo: 'Control de Personal',
      icono: <Users className="text-blue-600" size={24} />,
      color: 'bg-blue-50',
      contenido: [
        {
          subtitulo: 'Niveles de Acceso',
          texto: 'Super Usuario (acceso total), Administrador (inventario y personal) y Vendedor (solo visualización y registro de ventas).',
          icon: <ShieldCheck size={18} />
        },
        {
          subtitulo: 'Gestión de Roles',
          texto: 'Los cambios de permisos son instantáneos. El sistema notificará al usuario afectado sobre su nuevo nivel de privilegios.',
          icon: <Info size={18} />
        }
      ]
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Header del Manual */}
      <div className="flex flex-col md:flex-row items-center gap-6 border-b border-orange-100 pb-10">
        <div className="w-20 h-20 bg-[#3D1A14] rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
          <BookOpen size={40} />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-black text-[#3D1A14] tracking-tight">Manual de Usuario</h1>
          <p className="text-gray-500 font-bold mt-2 italic">Guía administrativa para Inversiones Durí & Suministros Mariu</p>
        </div>
      </div>

      {/* Grid de Secciones */}
      <div className="grid grid-cols-1 gap-12">
        {secciones.map((seccion) => (
          <div key={seccion.id} className="bg-white rounded-[3rem] p-10 shadow-sm border border-orange-50 hover:shadow-xl hover:shadow-orange-100/20 transition-all duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-4 ${seccion.color} rounded-2xl`}>
                {seccion.icono}
              </div>
              <h2 className="text-3xl font-black text-[#3D1A14] tracking-tighter">{seccion.titulo}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seccion.contenido.map((item, index) => (
                <div key={index} className="p-6 rounded-3xl bg-[#FDFCF9] border border-transparent hover:border-orange-200 transition-all group">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-[#FF5C00] group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="font-black text-[#3D1A14] mb-2 uppercase text-[10px] tracking-widest">{item.subtitulo}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">
                    {item.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}