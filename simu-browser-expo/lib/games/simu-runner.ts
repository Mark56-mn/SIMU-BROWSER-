import { GameModule } from '../gameLoader';

export const simuRunner: GameModule = {
  id: 'simu-runner',
  name: 'SIMU Runner',
  description: 'Fast-paced action reflexes! Type commands quickly to dodge obstacles and keep running.',
  levels: [
    { id: '1', offline: true, data: { question: 'Wall approaching! Type "jump" to vault over it.', solution: 'jump', rewardAmount: 5 } },
    { id: '2', offline: true, data: { question: 'Low ceiling! Type "duck" to slide under.', solution: 'duck', rewardAmount: 5 } },
    { id: '3', offline: true, data: { question: 'Gap in the bridge! Type "dash" to cross it.', solution: 'dash', rewardAmount: 5 } },
    { id: '4', offline: true, data: { question: 'Security laser! Type "roll" to evade.', solution: 'roll', rewardAmount: 5 } },
    { id: '5', offline: true, data: { question: 'Incoming drone! Type "smash" to destroy it.', solution: 'smash', rewardAmount: 5 } },
    { id: '6', offline: false, data: { question: '[ONLINE MULTIPLAYER EVENT] Avoid the EMP blast! Type "shield"', solution: 'shield', rewardAmount: 25 } },
    { id: '7', offline: false, data: { question: '[ONLINE MULTIPLAYER EVENT] Outrun the rival! Type "sprint"', solution: 'sprint', rewardAmount: 25 } },
  ]
};
