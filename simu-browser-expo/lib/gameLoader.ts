export interface LevelData {
  question: string;
  solution: string;
  rewardAmount: number;
}

export interface GameLevel {
  id: string;
  offline: boolean;
  data: LevelData;
}

export interface GameModule {
  id: string;
  name: string;
  description: string;
  levels: GameLevel[];
}

// Minimal JSON registry acting as our lightweight game cache/DB
const MOCK_GAMES: GameModule[] = [
  {
    id: 'simu-math',
    name: 'SIMU Validator Math',
    description: 'Solve cryptographic scaling puzzles to earn SIMU Stars.',
    levels: [
      { id: '1', offline: true, data: { question: 'What is the sum of 5 and 7?', solution: '12', rewardAmount: 10 } },
      { id: '2', offline: true, data: { question: 'Calculate: 8 * 3', solution: '24', rewardAmount: 15 } },
      { id: '3', offline: true, data: { question: '100 / 4 = ?', solution: '25', rewardAmount: 20 } },
      { id: '4', offline: true, data: { question: '12 - 9?', solution: '3', rewardAmount: 5 } },
      { id: '5', offline: true, data: { question: '2 cubed (2^3) = ?', solution: '8', rewardAmount: 25 } },
      // Level 6 requires online sync (e.g., dynamic daily puzzle or heavier module)
      { id: '6', offline: false, data: { question: '144 / 12?', solution: '12', rewardAmount: 50 } },
    ]
  }
];

export const loadGameModule = async (gameId: string): Promise<GameModule | null> => {
  // In a real environment, this checks SQLite/AsyncStorage first.
  // If not found or outdated, it fetches the JSON from Supabase.
  // For the <500KB constraint, we use minimal static JSON objects.
  return new Promise((resolve) => {
    setTimeout(() => {
      const game = MOCK_GAMES.find(g => g.id === gameId);
      resolve(game || null);
    }, 500); // Simulate local load time
  });
};
