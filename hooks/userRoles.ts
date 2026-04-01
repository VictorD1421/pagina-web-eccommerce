// hooks/useRole.ts
import { supabase } from '@/src/lib/supabase';

export const useRole = () => {
  const getRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single();

    return data?.rol;
  };

  return { getRole };
};