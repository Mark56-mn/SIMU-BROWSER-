import { GameModule } from '../gameLoader';

export const tokenDash: GameModule = {
  id: 'token-dash',
  name: 'Token Dash',
  description: 'Quick reactions! Collect the tokens before they disappear.',
  levels: [
    { id: '1', offline: true, data: { question: 'Token dropping left! Type "left" to catch.', solution: 'left', rewardAmount: 5 } },
    { id: '2', offline: true, data: { question: 'Token dropping right! Type "right" to catch.', solution: 'right', rewardAmount: 5 } },
    { id: '3', offline: true, data: { question: 'Speed boost! Type "dash" to grab the multiplier.', solution: 'dash', rewardAmount: 5 } },
    { id: '4', offline: true, data: { question: 'Falling debris! Type "block" to protect your stash.', solution: 'block', rewardAmount: 5 } },
    { id: '5', offline: true, data: { question: 'Golden Token! Type "grab" to secure it!', solution: 'grab', rewardAmount: 10 } },
    { id: '6', offline: false, data: { question: '[GLOBAL EVENT] Meteor shower! Type "evade" to save your tokens.', solution: 'evade', rewardAmount: 25 } },
    { id: '7', offline: false, data: { question: '[GLOBAL EVENT] Boss token appears! Type "collect" to claim massive rewards.', solution: 'collect', rewardAmount: 50 } },
  ]
};
