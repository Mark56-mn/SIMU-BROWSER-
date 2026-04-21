import { GameModule } from '../gameLoader';

export const cryptoPuzzle: GameModule = {
  id: 'crypto-puzzle',
  name: 'Crypto Puzzle',
  description: 'Logic challenges and cryptographic pattern recognition to train your brain.',
  levels: [
    { id: '1', offline: true, data: { question: 'Logic Sequence: 2, 4, 8, 16, ?', solution: '32', rewardAmount: 10 } },
    { id: '2', offline: true, data: { question: 'Binary to Decimal: What is 1010 in base 10?', solution: '10', rewardAmount: 10 } },
    { id: '3', offline: true, data: { question: 'Hex to Text: 0x53 0x49 0x4D 0x55 (hint: caps)', solution: 'SIMU', rewardAmount: 10 } },
    { id: '4', offline: true, data: { question: 'Caesar Cipher (+1 shift): IFMMP', solution: 'HELLO', rewardAmount: 10 } },
    { id: '5', offline: true, data: { question: 'How many blocks are in a 3x3x3 cube?', solution: '27', rewardAmount: 10 } },
    { id: '6', offline: false, data: { question: '[LIVE NETWORK] Hash collision test: Type "verified"', solution: 'verified', rewardAmount: 50 } },
    { id: '7', offline: false, data: { question: '[LIVE NETWORK] Gas optimization puzzle: Calculate 256 / 16', solution: '16', rewardAmount: 50 } },
  ]
};
