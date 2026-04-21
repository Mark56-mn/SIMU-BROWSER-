import { GameModule } from '../gameLoader';

export const simuRunnerOnline: GameModule = {
  id: 'simu-runner-online',
  name: 'SIMU Runner (Online Edition)',
  description: 'Fast-paced action reflexes with community challenges and real-world data gathering and multiplayer races!',
  levels: [
    { id: '1', offline: true, data: { question: 'Wall approaching! Type "jump" to vault over it.', solution: 'jump', rewardAmount: 5 } },
    { id: '2', offline: true, data: { question: 'Low ceiling! Type "duck" to slide under.', solution: 'duck', rewardAmount: 5 } },
    { id: '3', offline: true, data: { question: 'Gap in the bridge! Type "dash" to cross it.', solution: 'dash', rewardAmount: 5 } },
    { id: '4', offline: true, data: { question: 'Security laser! Type "roll" to evade.', solution: 'roll', rewardAmount: 5 } },
    { id: '5', offline: true, data: { question: 'Incoming drone! Type "smash" to destroy it.', solution: 'smash', rewardAmount: 5 } },
    { 
      id: '6', 
      offline: false, 
      data: { 
        question: 'Community Puzzle', 
        solution: '', 
        rewardAmount: 10,
        simuReward: 5,
        component: 'CommunityPuzzle' 
      } 
    },
    { 
      id: '7', 
      offline: false, 
      data: { 
        question: 'Real-World Data Challenge', 
        solution: '', 
        rewardAmount: 25,
        simuReward: 10,
        component: 'MarketDataScanner' 
      } 
    },
    { 
      id: '8', 
      offline: false, 
      data: { 
        question: 'Multiplayer Race', 
        solution: '', 
        rewardAmount: 50,
        simuReward: 20,
        component: 'MultiplayerRace' 
      } 
    },
  ]
};
