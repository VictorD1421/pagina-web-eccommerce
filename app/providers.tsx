'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  // Creamos el QueryClient dentro de un estado para que sea persistente
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Los datos se consideran "válidos" por 5 minutos antes de re-verificar
        staleTime: 1000 * 60 * 5, 
        // ¡ESTO ES LO IMPORTANTE!: Refresca los datos automáticamente 
        // cuando el usuario vuelve a hacer clic en la pestaña del navegador.
        refetchOnWindowFocus: true, 
        // Si una petición falla (ej. bajón de internet en Maracay), reintenta una vez
        retry: 1, 
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}