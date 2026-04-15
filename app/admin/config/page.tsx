'use client'

import React, { useEffect, useState } from 'react'
import { 
  Save, Loader2, Landmark, Phone, CreditCard, 
  UserCheck, CheckCircle2, AlertCircle, DollarSign,
  BookOpen, X, HelpCircle
} from 'lucide-react'
import { supabase } from '@/src/lib/supabase'

// --- COMPONENTE MODAL DE MANUAL ---
function ManualModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3D1A14]/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-[#FF5C00] p-8 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BookOpen size={32} className="italic" />
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Manual de Usuario</h3>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Módulo de Configuración</p>
            </div>
          </div>
          <button onClick={onClose} className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8 md:p-12 space-y-6 max-height-[70vh] overflow-y-auto">
          <section className="space-y-3">
            <h4 className="text-[#FF5C00] font-black flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px]">1</div>
              ACTUALIZACIÓN DE TASA BCV
            </h4>
            <p className="text-[#3D1A14]/70 text-sm leading-relaxed">
              Ingrese el valor del dólar oficial en el recuadro naranja superior. Este valor se utilizará automáticamente para calcular todos los precios del sistema en Bolívares.
            </p>
          </section>

          <section className="space-y-3">
            <h4 className="text-[#FF5C00] font-black flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px]">2</div>
              DATOS BANCARIOS (PAGO MÓVIL)
            </h4>
            <p className="text-[#3D1A14]/70 text-sm leading-relaxed">
              Asegúrese de que el <strong>Código de Banco</strong> sea de 4 dígitos (ej: 0102) y el <strong>Teléfono</strong> incluya el código de área (ej: 0412). Estos datos se mostrarán a sus clientes para recibir pagos.
            </p>
          </section>

          <section className="space-y-3">
            <h4 className="text-[#FF5C00] font-black flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px]">3</div>
              IDENTIFICACIÓN Y TITULAR
            </h4>
            <p className="text-[#3D1A14]/70 text-sm leading-relaxed">
              Seleccione el tipo de documento (V, J, E, G) e ingrese la numeración. El nombre del titular debe ser idéntico al registrado en el banco para evitar confusiones en las transferencias.
            </p>
          </section>

          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex gap-4">
            <HelpCircle className="text-[#FF5C00] shrink-0" />
            <p className="text-[#3D1A14]/60 text-[11px] font-bold uppercase leading-normal">
              Nota: El botón de actualizar solo se habilitará cuando todos los campos obligatorios estén correctamente llenados.
            </p>
          </div>
        </div>

        <div className="p-8 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-[#3D1A14] text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-[#FF5C00] transition-colors"
          >
            ENTENDIDO
          </button>
        </div>
      </div>
    </div>
  )
}

// --- PÁGINA PRINCIPAL ---
interface EmpresaData {
  id?: number; 
  nombre_banco: string;
  codigo_banco: string;
  telefono_pago: string;
  identificacion: string;
  nombre_titular: string;
  tasa_dolar: string; 
  active: boolean;
}

export default function ConfiguracionPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isManualOpen, setIsManualOpen] = useState(false) // Estado para el modal
  
  const [docType, setDocType] = useState('V')
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

  const soloNumeros = (val: string) => val.replace(/[^0-9]/g, '');
  const soloLetras = (val: string) => val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');

  const isFormValid = 
    formData.nombre_banco.trim().length > 2 &&
    formData.codigo_banco.trim().length >= 4 &&
    formData.telefono_pago.trim().length >= 10 &&
    docNumber.trim().length >= 6 &&
    formData.nombre_titular.trim().length > 3 &&
    !isNaN(parseFloat(formData.tasa_dolar)) && 
    parseFloat(formData.tasa_dolar) > 0

  useEffect(() => {
    fetchEmpresaData()
  }, [])

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
            tasa_dolar: data.tasa_dolar?.toString() ?? '0'
        })
        if (data.identificacion?.includes('-')) {
          const [prefix, ...rest] = data.identificacion.split('-')
          setDocType(prefix)
          setDocNumber(soloNumeros(rest.join('')))
        } else {
          setDocNumber(soloNumeros(data.identificacion || ''))
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setErrorMsg('Error al sincronizar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!isFormValid) {
      setErrorMsg('Por favor rellena todos los campos con el formato correcto.')
      return
    }

    setSaving(true)
    const finalIdentificacion = `${docType}-${docNumber.trim()}`

    try {
      const payload: any = {
        nombre_banco: formData.nombre_banco.trim(),
        codigo_banco: formData.codigo_banco.trim(),
        telefono_pago: formData.telefono_pago.trim(),
        identificacion: finalIdentificacion,
        nombre_titular: formData.nombre_titular.trim(),
        tasa_dolar: parseFloat(formData.tasa_dolar),
        active: formData.active
      }

      if (formData.id) {
        payload.id = Number(formData.id)
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
      console.error("Error detallado:", error)
      setErrorMsg(error.message || "Error al actualizar la base de datos.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-[#FF5C00]" size={48} />
      <p className="text-[#3D1A14] font-black animate-pulse uppercase tracking-widest text-sm">Cargando parámetros...</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <ManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />

      <div className="bg-[#3D1A14] p-10 md:p-14 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative z-10 text-center md:text-left flex items-center gap-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic">Configuración</h2>
            <p className="text-orange-200/60 font-medium mt-2 uppercase tracking-widest text-xs">Suministros Mariu 3000 C.A.</p>
          </div>
          <button 
            onClick={() => setIsManualOpen(true)}
            className="hidden md:flex bg-white/10 hover:bg-[#FF5C00] p-4 rounded-2xl border border-white/5 transition-all group"
            title="Abrir Manual"
          >
            <BookOpen className="text-white group-hover:scale-110 transition-transform" size={24} />
          </button>
        </div>

        {showSuccess && (
          <div className="z-20 flex items-center gap-3 bg-green-500 px-8 py-4 rounded-2xl animate-in zoom-in shadow-xl border-2 border-white/20">
            <CheckCircle2 size={24} />
            <span className="font-black italic">¡ACTUALIZADO!</span>
          </div>
        )}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5C00] rounded-full blur-[120px] opacity-20 -mr-32 -mt-32"></div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-14 rounded-[4rem] shadow-xl border border-orange-50 space-y-12">
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
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
          <InputField 
            label="Banco" 
            icon={<Landmark size={22}/>}
            value={formData.nombre_banco}
            onChange={(v: string) => setFormData({...formData, nombre_banco: soloLetras(v)})}
            placeholder="Ej: Banesco"
          />

          <InputField 
            label="Código Banco" 
            icon={<CreditCard size={22}/>}
            value={formData.codigo_banco}
            onChange={(v: string) => setFormData({...formData, codigo_banco: soloNumeros(v)})}
            placeholder="01XX"
            maxLength={4}
          />

          <InputField 
            label="Teléfono Pago Móvil" 
            icon={<Phone size={22}/>}
            value={formData.telefono_pago}
            onChange={(v: string) => setFormData({...formData, telefono_pago: soloNumeros(v)})}
            placeholder="04121234567"
            maxLength={11}
          />

          <div className="space-y-4">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] ml-3 text-[#3D1A14]/40">
              Documento Identidad
            </label>
            <div className="flex gap-3">
              <select 
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="bg-[#FDFCF9] border-2 border-orange-50 px-4 rounded-[1.5rem] font-black text-[#FF5C00] outline-none focus:border-[#FF5C00] cursor-pointer appearance-none shadow-sm"
              >
                <option value="V">V</option>
                <option value="J">J</option>
                <option value="E">E</option>
                <option value="G">G</option>
              </select>
              <input 
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(soloNumeros(e.target.value))}
                placeholder="Número de cédula/RIF"
                className="flex-1 px-6 py-5 rounded-[1.5rem] bg-[#FDFCF9] border-2 border-orange-50 outline-none focus:border-[#FF5C00] font-bold shadow-sm transition-all"
                maxLength={10}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <InputField 
              label="Titular de la Cuenta" 
              icon={<UserCheck size={22}/>}
              value={formData.nombre_titular}
              onChange={(v: string) => setFormData({...formData, nombre_titular: soloLetras(v)})}
              placeholder="Nombre Completo o Razón Social"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-4 p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 animate-in slide-in-from-top-2">
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
              : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
            }`}
        >
          {saving ? <Loader2 className="animate-spin" size={26} /> : <Save size={26} />}
          {saving ? 'PROCESANDO...' : 'ACTUALIZAR DATOS DE EMPRESA'}
        </button>
      </form>
    </div>
  )
}

function InputField({ label, icon, value, onChange, placeholder, maxLength }: any) {
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
          maxLength={maxLength}
          className="w-full pl-16 pr-8 py-5 rounded-[1.5rem] font-bold bg-[#FDFCF9] border-2 border-orange-50 outline-none focus:border-[#FF5C00] focus:bg-white text-[#3D1A14] transition-all shadow-sm"
        />
      </div>
    </div>
  )
}