import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 1. Obtener sesión de forma segura
  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Lógica de redirección para usuarios logueados en Auth pages
  if (user && (pathname === '/login' || pathname === '/registro')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 2. Protección de rutas /admin con manejo de errores de red
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // Consultamos el rol con un timeout implícito o manejo de error
      const { data: perfil, error } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', user.id)
        .single()

      if (error || !perfil) {
        console.error("Error consultando perfil en middleware:", error?.message)
        // Si hay error de red o base de datos, por seguridad mandamos al home
        return NextResponse.redirect(new URL('/', request.url))
      }

      const esAdmin = perfil.rol === 'admin' || perfil.rol === 'super_user'
      
      if (!esAdmin) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (e) {
      // Si el fetch falla (error de red crítico), evitamos el crash
      console.error("Falla crítica de red en middleware (fetch failed):", e)
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // 3. Protección de /perfil
  if (pathname.startsWith('/perfil') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  // Excluimos archivos estáticos y api para no sobrecargar el middleware
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}