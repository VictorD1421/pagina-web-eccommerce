import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/src/lib/supabase'
import { useCallback } from 'react'

export const useCart = (user: any) => {
  const queryClient = useQueryClient()

  // 1. QUERY: Obtención de datos con manejo de resiliencia
  const { 
    data: cartData, 
    isLoading: loading, 
    refetch: fetchCartItems 
  } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      
      try {
        const { data, error } = await supabase
          .from('pedidos')
          .select(`
            id,
            items_pedido (
              id, 
              cantidad, 
              precio_unitario, 
              producto_id,
              productos (
                nombre, 
                imagen_url,
                precio
              )
            )
          `)
          .eq('usuario_id', user.id)
          .eq('estado', 'carrito')
          .maybeSingle() 

        if (error) throw error
        return data
      } catch (error: any) {
        // Si es un error de red, intentamos recuperar lo que haya en caché
        if (error instanceof TypeError || error.message?.includes('fetch')) {
          const cached = queryClient.getQueryData(['cart', user?.id])
          if (cached) return cached
        }
        
        console.error("Error en la conexión con Supabase:", error.message)
        return null
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30,    // 30 min en memoria
    retry: 1,                  // Reducido a 1 para evitar saturar en caso de error persistente
    refetchOnWindowFocus: false,
  })

  const cartItems = cartData?.items_pedido || []
  const cartId = cartData?.id || null

  // 2. FUNCIÓN MEJORADA: useCallback es VITAL para evitar bucles infinitos en el Navbar
  const setCartItems = useCallback((newData: any[]) => {
    if (!user?.id) return;
    queryClient.setQueryData(['cart', user?.id], (oldData: any) => {
      if (!oldData) return { id: null, items_pedido: newData };
      return { ...oldData, items_pedido: newData }
    })
  }, [queryClient, user?.id])

  // 3. MUTATION: Actualizar cantidad
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, newQty }: { itemId: string, newQty: number }) => {
      if (newQty <= 0) return removeItemMutation.mutateAsync(itemId)
      
      const { error } = await supabase
        .from('items_pedido')
        .update({ cantidad: newQty })
        .eq('id', itemId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    }
  })

  // 4. MUTATION: Eliminar item
  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('items_pedido')
        .delete()
        .eq('id', itemId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    }
  })

  // 5. MUTATION: Vaciar carrito
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!cartId) return
      const { error } = await supabase
        .from('items_pedido')
        .delete()
        .eq('pedido_id', cartId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    }
  })

  // 6. FUNCIÓN: Finalizar pedido (Checkout)
  const processCheckout = async (total: number) => {
    if (!cartId) return { error: new Error("No hay carrito activo") }
    
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .update({ 
          total, 
          estado: 'pendiente', 
          created_at: new Date().toISOString() 
        })
        .eq('id', cartId)
        .select()

      if (error) throw error

      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  // Memorizar las funciones de mutación para que la Navbar no detecte cambios de referencia constantes
  const updateQuantity = useCallback((itemId: string, newQty: number) => 
    updateQuantityMutation.mutate({ itemId, newQty }), [updateQuantityMutation])

  const removeItem = useCallback((itemId: string) => 
    removeItemMutation.mutate(itemId), [removeItemMutation])

  const clearCart = useCallback(() => 
    clearCartMutation.mutate(), [clearCartMutation])

  return { 
    cartItems, 
    loading, 
    fetchCartItems, 
    setCartItems,
    updateQuantity,
    removeItem,
    clearCart,
    processCheckout 
  }
}