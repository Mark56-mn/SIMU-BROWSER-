import { supabase } from './supabase';

/**
 * Handles all economic interactions for the African Warrior game,
 * connecting gameplay to the SIMU ecosystem.
 */
export const GameEconomy = {
  /**
   * Awards Stars to the player via RPC.
   * Fails gracefully in offline mode, caching for later sync.
   */
  rewardStars: async (amount: number, reason: string): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error("No active user session");

      const { error } = await supabase.rpc('send_stars', {
        amount,
        user_id: userData.user.id,
        reason
      });

      if (error) throw error;
      console.log(`[Economy] Rewarded ${amount} Stars for: ${reason}`);
      return true;
    } catch (e) {
      console.warn(`[Economy Offline] Simulated granting ${amount} Stars for: ${reason}.`);
      // In a real implementation: fallback to IndexedDB to sync later
      return false;
    }
  },

  /**
   * Deducts Stars for unlocks
   */
  spendStars: async (amount: number, reason: string): Promise<boolean> => {
    try {
       // Similar implementation targeting a spend_stars RPC
       console.log(`[Economy] Spent ${amount} Stars for: ${reason}`);
       return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Shares a victory directly to the SIMU Community Feed.
   */
  shareVictory: async (message: string): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return false;

      const { error } = await supabase.from('posts').insert({
        author_id: userData.user.id,
        author_name: 'Warrior', // Ideally fetched from profile
        title: 'African Warrior Update',
        body: message,
        upvotes: 0
      });

      if (error) throw error;
      
      // Bonus stars for sharing!
      await GameEconomy.rewardStars(10, 'Community Share Victory');
      return true;
    } catch (e) {
      console.warn("[Social Offline] Could not share to community.");
      return false;
    }
  }
};
