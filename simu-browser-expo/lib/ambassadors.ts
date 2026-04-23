import { supabase } from './supabase';

export type AmbassadorType = 'game_dev' | 'support' | 'announcements' | 'community';

export interface AmbassadorProfile {
  id: string;
  username: string;
  ambassador_type: AmbassadorType;
  is_official: boolean;
}

/**
 * Validates a user's ambassador status.
 */
export const checkAmbassadorStatus = async (userId: string): Promise<AmbassadorProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, ambassador_type, is_official')
      .eq('id', userId)
      .single();
      
    if (error || !data) return null;
    if (!data.is_official) return null;
    
    return data as AmbassadorProfile;
  } catch (error) {
    console.error('Ambassador check failed:', error);
    return null;
  }
};

/**
 * Simulates a post from an Ambassador to the community feed.
 * For use by admins and placeholder personas.
 */
export const postAmbassadorAnnouncement = async (
  authorId: string, 
  authorName: string, 
  title: string, 
  body: string
) => {
  // Verifying they are an admin/ambassador locally is skipped for placeholder use,
  // but in prod would rely on backend RPC or RLS enforcement.
  
  const { error } = await supabase.from('posts').insert([{
    title,
    body,
    author_id: authorId,
    author_name: authorName,
    upvotes: 0
  }]);
  
  if (error) throw error;
  return true;
};
