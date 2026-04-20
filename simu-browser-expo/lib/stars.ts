import { supabase } from './supabase';

export const getStarsBalance = async (): Promise<{ balance: number, total_received: number }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { balance: 0, total_received: 0 };
    const { data, error } = await supabase
      .from('profiles')
      .select('stars_balance, total_stars_received')
      .eq('id', session.user.id)
      .single();
    if (error) throw error;
    return { 
      balance: data.stars_balance || 0, 
      total_received: data.total_stars_received || 0 
    };
  } catch (e) {
    console.error('getStarsBalance err:', e);
    return { balance: 0, total_received: 0 };
  }
};

export const getExchangeRate = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('rate')
      .eq('pair', 'SIMU_STARS')
      .single();
    if (error) throw error;
    return data.rate || 10;
  } catch (e) {
    console.error('getExchangeRate err:', e);
    return 10; // Default fallback
  }
};

export const sendStars = async (receiverId: string | null, amount: number, type: string, referenceId?: string) => {
  try {
    const { data, error } = await supabase.rpc('send_stars', {
      p_receiver_id: receiverId, // null = ecosystem treasury
      p_amount: amount,
      p_type: type,
      p_reference_id: referenceId || null
    });
    if (error) throw error;
    return data; 
  } catch (e: any) {
    return { success: false, error: e.message || 'Network error' };
  }
};

export const swapSimuToStars = async (amount: number) => {
  try {
    const { data, error } = await supabase.rpc('swap_simu_to_stars', { p_simu_amount: amount });
    if (error) throw error;
    return data;
  } catch (e: any) {
    return { success: false, error: e.message || 'Network error' };
  }
};

export const swapStarsToSimu = async (amount: number) => {
  try {
    const { data, error } = await supabase.rpc('swap_stars_to_simu', { p_stars_amount: amount });
    if (error) throw error;
    return data;
  } catch (e: any) {
    return { success: false, error: e.message || 'Network error' };
  }
};

export const deletePost = async (postId: string) => {
  try {
    const { error } = await supabase.from('community_posts').delete().eq('id', postId);
    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || 'Network error' };
  }
};

export const updatePost = async (postId: string, title: string, body: string) => {
  try {
    // using eq('id') - RLS will enforce author_id == auth.uid()
    const { error } = await supabase.from('community_posts').update({ title, body: body || null }).eq('id', postId);
    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || 'Network error' };
  }
};

