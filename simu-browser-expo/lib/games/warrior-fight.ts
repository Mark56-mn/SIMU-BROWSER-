import { GameModule } from '../gameLoader';

export const warriorFight: GameModule = {
  id: 'warrior-fight',
  name: 'African Warrior',
  description: 'Turn-based combat with African warrior theme. Tap sequences to perform combos.',
  levels: [
    { 
      id: '1', 
      offline: true, 
      data: { 
        question: 'Training Village', 
        solution: 'win', 
        rewardAmount: 10, 
        component: 'WarriorFight',
        difficulty: 1,
        opponentName: 'Trainee'
      } 
    },
    { 
      id: '2', 
      offline: true, 
      data: { 
        question: 'Forest Challenge', 
        solution: 'win', 
        rewardAmount: 10, 
        component: 'WarriorFight',
        difficulty: 2,
        opponentName: 'Forest Hunter'
      } 
    },
    { 
      id: '3', 
      offline: true, 
      data: { 
        question: 'Mountain Duel', 
        solution: 'win', 
        rewardAmount: 10, 
        component: 'WarriorFight',
        difficulty: 3,
        opponentName: 'Mountain Guard'
      } 
    },
    { 
      id: '4', 
      offline: true, 
      data: { 
        question: 'River Crossing', 
        solution: 'win', 
        rewardAmount: 10, 
        component: 'WarriorFight',
        difficulty: 4,
        opponentName: 'River Sentinel'
      } 
    },
    { 
      id: '5', 
      offline: true, 
      data: { 
        question: 'Chief Area', 
        solution: 'win', 
        rewardAmount: 15, 
        component: 'WarriorFight',
        difficulty: 5,
        opponentName: 'Village Chief'
      } 
    },
    { 
      id: '6', 
      offline: false, 
      data: { 
        question: 'Online Tournament', 
        solution: 'win', 
        rewardAmount: 25, 
        component: 'WarriorFight',
        difficulty: 6,
        opponentName: 'Elite Warrior'
      } 
    }
  ]
};
