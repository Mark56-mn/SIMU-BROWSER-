import { GameModule } from '../gameLoader';

export const simuChess: GameModule = {
  id: 'simu-chess',
  name: 'SIMU Chess',
  description: 'Classic tactics and board knowledge puzzles. Master the 64 squares.',
  levels: [
    { id: '1', offline: true, data: { question: 'What is the most popular first move for white? (Hint: Kings Pawn, 2 spaces)', solution: 'e4', rewardAmount: 15 } },
    { id: '2', offline: true, data: { question: 'What piece moves entirely diagonally?', solution: 'bishop', rewardAmount: 15 } },
    { id: '3', offline: true, data: { question: 'White plays e4, Black responds c5. What defense is this?', solution: 'sicilian', rewardAmount: 15 } },
    { id: '4', offline: true, data: { question: 'How many knights does a player start with?', solution: '2', rewardAmount: 15 } },
    { id: '5', offline: true, data: { question: 'Mate in 1: White Queen on g6, Black King on h8. Move Queen to where to checkmate? (Hint: rank starts with h)', solution: 'h7', rewardAmount: 15 } },
    { id: '6', offline: false, data: { question: '[MULTIPLAYER LOBBY] Type "join" to enter matchmaking Queue.', solution: 'join', rewardAmount: 100 } },
    { id: '7', offline: false, data: { question: '[MULTIPLAYER LOBBY] Opponent found: Grandmaster AI. Type "ready".', solution: 'ready', rewardAmount: 0 } },
  ]
};
