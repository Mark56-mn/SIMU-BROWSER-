import { supabase } from './supabase';

export const getStarsBalance = async (): Promise<number> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return 0;
    const { data, error } = await supabase.from('profiles').select('stars_balance').eq('id', session.user.id).single();
    if (error) throw error;
    return data.stars_balance || 0;
  } catch (e) {
    console.error('getStarsBalance err:', e);
    return 0;
  }
};

export const getExchangeRate = async (): Promise<number> => {
  try {
    const { data, error } = await supabase.from('exchange_rates').select('rate').eq('pair', 'SIMU_STARS').single();
    if (error) throw error;
    return data.rate || 10;
  } catch (e) {
    console.error('getExchangeRate err:', e);
    return 10; // Default fallback
  }
};

export const sendStars = async (receiverId: string, amount: number, type: string, referenceId?: string) => {
  try {
    const { data, error } = await supabase.rpc('send_stars', {
      p_receiver_id: receiverId,
      p_amount: amount,
      p_type: type,
      p_reference_id: referenceId || null
    });
    if (error) throw error;
    return data; 
  } catch (e: any) {
    return { success: false, error: e.message };
  }
};

export const swapSimuToStars = async (amount: number) => {
  try {
    const { data, error } = await supabase.rpc('swap_simu_to_stars', { p_simu_amount: amount });
    if (error) throw error;
    return data;
  } catch (e: any) {
    return { success: false, error: e.message };
  }
};

export const swapStarsToSimu = async (amount: number) => {
  try {
    const { data, error } = await supabase.rpc('swap_stars_to_simu', { p_stars_amount: amount });
    if (error) throw error;
    return data;
  } catch (e: any) {
    return { success: false, error: e.message };
  }
};
