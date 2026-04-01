'use client'

import React, { useEffect, useState } from 'react'
import { 
  Building2, Save, Loader2, Landmark, 
  Phone, CreditCard, UserCheck, CheckCircle2, AlertCircle, ChevronDown,
  DollarSign, RefreshCw
} from 'lucide-react'
import { supabase } from '@/src/lib/supabase'

interface EmpresaData {
  id?: number;
  nombre_banco: string;
  codigo_banco: string;
  telefono_pago: string;
  identificacion: string;
  nombre_titular: string;
  tasa_dolar: string; // Mantenemos como string para el control del input
  active: boolean;
}

export default function ConfiguracionPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fetchingTasa, setFetchingTasa] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const [docType, setDocType] = useState('J')
  const [docNumber, setDocNumber] = useState('')

  const [formData, setFormData] = useState<EmpresaData>({
    nombre_banco: '',
    codigo_banco: '',
    telefono_pago: '',
    identificacion: '',
    nombre_titular: '',
    tasa_dolar: '0',
    active: true
  })

  const isFormValid = 
    formData.nombre_banco.trim() !== '' &&
    formData.codigo_banco.trim() !== '' &&
    formData.telefono_pago.trim() !== '' &&
    docNumber.trim() !== '' &&
    formData.nombre_titular.trim() !== '' &&
    !isNaN(parseFloat(formData.tasa_dolar)) && 
    parseFloat(formData.tasa_dolar) > 0

  useEffect(() => {
    fetchEmpresaData()
  }, [])

  const obtenerTasaAuto = async () => {
    try {
      setFetchingTasa(true)
      const res = await fetch('/api/tasa')
      const data = await res.json()
      if (data.price) {
        setFormData(prev => ({ ...prev, tasa_dolar: data.price.toString() }))
      }
    } catch (err) {
      console.error("No se pudo obtener la tasa automática", err)
    } finally {
      setFetchingTasa(false)
    }
  }

  async function fetchEmpresaData() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('datos_empresa')
        .select('*')
        .maybeSingle()

      if (error) throw error
      
      if (data) {
        setFormData({
            ...data,
            // Convertimos el número de la DB a string para el input controlado
            tasa_dolar: data.tasa_dolar?.toString() ?? '0'
        })
        if (data.identificacion?.includes('-')) {
          const [prefix, ...rest] = data.identificacion.split('-')
          setDocType(prefix)
          setDocNumber(rest.join('-'))
        } else {
          setDocNumber(data.identificacion || '')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setErrorMsg('Error al sincronizar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!isFormValid) {
      setErrorMsg('Por favor rellena todos los campos y asegúrate de que la tasa sea válida.')
      return
    }

    setSaving(true)
    const finalIdentificacion = `${docType}-${docNumber.trim()}`

    try {
      // 1. Preparamos el objeto para Supabase convirtiendo la tasa a número decimal
      const payload = {
        ...formData,
        identificacion: finalIdentificacion,
        tasa_dolar: parseFloat(formData.tasa_dolar) 
      }

      const { data, error } = await supabase
        .from('datos_empresa')
        .upsert(payload)
        .select()
        .single()

      if (error) throw error
      
      if (data) {
        setFormData({
          ...data,
          tasa_dolar: data.tasa_dolar.toString()
        })
      }
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error: any) {
      setErrorMsg(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-[#FF5C00]" size={48} />
      <p className="text-[#3D1A14] font-black animate-pulse">Cargando parámetros...</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-[#3D1A14] p-10 md:p-14 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic">Configuración</h2>
          <p className="text-orange-200/60 font-medium mt-2 uppercase tracking-widest text-xs">Suministros Mariu 3000 C.A.</p>
        </div>
        {showSuccess && (
          <div className="z-20 flex items-center gap-3 bg-green-500 px-8 py-4 rounded-2xl animate-in zoom-in shadow-xl">
            <CheckCircle2 size={24} />
            <span className="font-black italic">¡GUARDADO!</span>
          </div>
        )}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5C00] rounded-full blur-[120px] opacity-20 -mr-32 -mt-32"></div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-14 rounded-[4rem] shadow-xl border border-orange-50 space-y-12">
        
        {/* SECCIÓN DE TASA DEL DÓLAR (WIDGET) */}
        <div className="bg-orange-50/50 p-8 rounded-[2.5rem] border-2 border-orange-100 relative overflow-hidden group">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="bg-[#FF5C00] p-4 rounded-2xl shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
                <DollarSign className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-[#3D1A14] font-black text-xl italic">Tasa BCV</h3>
                <p className="text-[#3D1A14]/50 text-xs font-bold uppercase tracking-wider">Valor oficial para facturación</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-48">
                <input 
                  type="text" 
                  inputMode="decimal"
                  value={formData.tasa_dolar} 
                  onChange={(e) => {
                    let val = e.target.value.replace(',', '.').replace(/[^0-9.]/g, '');
                    const parts = val.split('.');
                    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
                    setFormData({...formData, tasa_dolar: val});
                  }}
                  className="w-full pl-6 pr-12 py-5 rounded-2xl bg-white border-2 border-orange-200 outline-none focus:border-[#FF5C00] font-black text-2xl text-[#FF5C00] transition-all shadow-inner"
                  placeholder="0.00"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-[#3D1A14]/20 text-sm">Bs.</span>
              </div>
              
              <button
                type="button"
                onClick={obtenerTasaAuto}
                disabled={fetchingTasa}
                className="p-5 bg-white border-2 border-orange-200 rounded-2xl text-[#FF5C00] hover:bg-[#FF5C00] hover:text-white transition-all active:scale-95 shadow-sm"
                title="Sincronizar con API"
              >
                {fetchingTasa ? <Loader2 className="animate-spin" size={24}/> : <RefreshCw size={24} />}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
          <InputField 
            label="Banco" 
            icon={<Landmark size={22}/>}
            value={formData.nombre_banco}
            onChange={(v) => setFormData({...formData, nombre_banco: v})}
            placeholder="Nombre del Banco"
          />

          <InputField 
            label="Código" 
            icon={<CreditCard size={22}/>}
            value={formData.codigo_banco}
            onChange={(v) => setFormData({...formData, codigo_banco: v})}
            placeholder="01XX"
          />

          <InputField 
            label="Teléfono Móvil" 
            icon={<Phone size={22}/>}
            value={formData.telefono_pago}
            onChange={(v) => setFormData({...formData, telefono_pago: v})}
            placeholder="04XX-XXXXXXX"
          />

          <div className="space-y-4">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] ml-3 text-[#3D1A14]/40">
              Documento Identidad
            </label>
            <div className="flex gap-3">
              <select 
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="bg-[#FDFCF9] border-2 border-orange-50 px-5 rounded-[1.5rem] font-black text-[#FF5C00] outline-none focus:border-[#FF5C00] cursor-pointer appearance-none"
              >
                <option value="V">V</option><option value="J">J</option><option value="E">E</option><option value="G">G</option>
              </select>
              <input 
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value.replace(/[^0-9-]/g, ''))}
                placeholder="Número"
                className="flex-1 px-6 py-5 rounded-[1.5rem] bg-[#FDFCF9] border-2 border-orange-50 outline-none focus:border-[#FF5C00] font-bold"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <InputField 
              label="Titular de la Cuenta" 
              icon={<UserCheck size={22}/>}
              value={formData.nombre_titular}
              onChange={(v) => setFormData({...formData, nombre_titular: v})}
              placeholder="Nombre o Razón Social"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-4 p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 animate-shake">
            <AlertCircle size={24} />
            <p className="font-bold text-xs uppercase tracking-tight">{errorMsg}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving || !isFormValid}
          className={`w-full py-7 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-2xl
            ${isFormValid 
              ? 'bg-[#FF5C00] text-white hover:bg-[#3D1A14] shadow-orange-200/50' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
            }`}
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save size={26} />}
          {saving ? 'SINCRONIZANDO DB...' : 'GUARDAR CAMBIOS'}
        </button>
      </form>
    </div>
  )
}

function InputField({ label, icon, value, onChange, placeholder }: any) {
  return (
    <div className="space-y-4 group">
      <label className="text-[11px] font-black uppercase tracking-[0.3em] ml-3 text-[#3D1A14]/40 group-focus-within:text-[#FF5C00] transition-colors">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-200 group-focus-within:text-[#FF5C00] transition-colors">
          {icon}
        </div>
        <input 
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-16 pr-8 py-5 rounded-[1.5rem] font-bold bg-[#FDFCF9] border-2 border-orange-50 outline-none focus:border-[#FF5C00] focus:bg-white text-[#3D1A14] transition-all shadow-sm"
        />
      </div>
    </div>
  )
}