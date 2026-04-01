import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase en Inversiones Durí')
}

// Variable privada para almacenar la instancia única
let supabaseInstance: ReturnType<typeof createBrowserClient> | undefined

export const supabase = (() => {
  // Si ya existe la instancia, la devolvemos inmediatamente
  if (supabaseInstance) return supabaseInstance

  // Si no existe, la creamos con configuraciones de optimización
  supabaseInstance = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        // Ayuda a evitar colisiones de pestañas y bloqueos de React Strict Mode
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce', // Estándar de seguridad recomendado para SSR
      }
    }
  )

  return supabaseInstance
})()