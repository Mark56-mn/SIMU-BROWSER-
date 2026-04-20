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
        // MOCK: using send_stars to self/ecosystem or specific reward mint RPC.
        // In real backend, 'claim_game_reward' RPC would validate and send SIMU/Stars
        console.log(`Rewarding ${level.data.rewardAmount} stars for completing ${level.id}`);
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
