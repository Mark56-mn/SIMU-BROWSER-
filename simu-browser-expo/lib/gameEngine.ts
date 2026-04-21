import { supabase } from './supabase';
import { GameModule, loadGameModule } from './gameLoader';
import * as SecureStore from 'expo-secure-store';

export class GameEngine {
  gameId: string;
  module: GameModule | null = null;
  currentLevelIndex: number = 0;

  constructor(gameId: string) {
    this.gameId = gameId;
  }

  async initialize() {
    this.module = await loadGameModule(this.gameId);
    
    // Load local progress
    const progress = await SecureStore.getItemAsync(`game_progress_${this.gameId}`);
    if (progress) {
      this.currentLevelIndex = parseInt(progress, 10);
    }
    
    return this.module;
  }

  getCurrentLevel() {
    if (!this.module || this.currentLevelIndex >= this.module.levels.length) {
      return null;
    }
    return this.module.levels[this.currentLevelIndex];
  }

  checkAnswer(input: string): boolean {
    const level = this.getCurrentLevel();
    if (!level) return false;
    
    // Simple verification (could be expanded to sandboxed JS eval for logic games)
    return input.trim().toLowerCase() === level.data.solution.trim().toLowerCase();
  }

  async completeLevel(isOnline: boolean) {
    const level = this.getCurrentLevel();
    if (!level) return { success: false, error: 'No active level' };

    let rewardSuccess = false;
    
    // Only attempt RPC reward if online, otherwise queue it (simplified for demo)
    if (isOnline) {
      try {
        const { supabase } = require('./supabase');
        
        // Reward Stars
        if (level.data.rewardAmount > 0) {
           await supabase.rpc('send_stars', { 
             receiver_id: 'SYSTEM_GAME_REWARD', // In reality, we mint to the user
             amount: level.data.rewardAmount 
           });
        }

        // Reward SIMU if specified
        if (level.data.simuReward && level.data.simuReward > 0) {
           await supabase.rpc('swap_simu_to_stars', { // Example mock for rewarding SIMU
              simu_amount: level.data.simuReward 
           });
        }
        
        // Add 5 points to thinker_score
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.id) {
           await supabase.rpc('increment_thinker_score', {
              user_id: userData.user.id,
              points: 5
           });
        }

        console.log(`Rewarded ${level.data.rewardAmount} stars and ${level.data.simuReward || 0} SIMU for completing ${level.id}`);
        rewardSuccess = true;
      } catch (e) {
        console.log('Reward failed:', e);
      }
    }

    // Advance Level
    this.currentLevelIndex += 1;
    await SecureStore.setItemAsync(`game_progress_${this.gameId}`, this.currentLevelIndex.toString());

    return { 
      success: true, 
      rewarded: rewardSuccess, 
      amount: level.data.rewardAmount,
      isComplete: this.currentLevelIndex >= (this.module?.levels.length || 0)
    };
  }

  getTotalLevels() {
    return this.module?.levels.length || 0;
  }
}
