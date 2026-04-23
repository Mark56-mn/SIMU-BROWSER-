import React, { useState, useEffect } from 'react';
import { Shield, Sword } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export function WarriorFight({ onComplete }: Props) {
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [playerPose, setPlayerPose] = useState<'idle' | 'attack' | 'hurt' | 'block'>('idle');
  const [enemyPose, setEnemyPose] = useState<'idle' | 'attack' | 'hurt' | 'block'>('idle');
  const [combo, setCombo] = useState(0);

  // AI enemy logic
  useEffect(() => {
    if (enemyHp <= 0 || playerHp <= 0) return;
    
    const timer = setInterval(() => {
      if (Math.random() < 0.3) {
        triggerEnemyAttack();
      }
    }, 1500);
    
    return () => clearInterval(timer);
  }, [enemyHp, playerHp]);

  useEffect(() => {
    if (enemyHp <= 0) {
      setTimeout(() => onComplete(), 1500);
    } else if (playerHp <= 0) {
      alert('Defeated. The ancestors urge you to try again.');
      reset();
    }
  }, [enemyHp, playerHp, onComplete]);

  const reset = () => {
    setPlayerHp(100);
    setEnemyHp(100);
    setCombo(0);
    setPlayerPose('idle');
    setEnemyPose('idle');
  };

  const triggerEnemyAttack = () => {
    setEnemyPose('attack');
    if (playerPose !== 'block') {
      setPlayerPose('hurt');
      setPlayerHp(h => Math.max(0, h - 15));
      setCombo(0); // break combo
    }
    
    setTimeout(() => {
      setEnemyPose('idle');
      setPlayerPose('idle');
    }, 500);
  };

  const handleAction = (action: 'attack' | 'block') => {
    if (playerHp <= 0 || enemyHp <= 0) return;

    if (action === 'attack') {
      setPlayerPose('attack');
      setCombo(c => c + 1);
      
      const dmg = 8 + (combo * 2);
      
      setEnemyPose('hurt');
      setEnemyHp(h => Math.max(0, h - dmg));
    } else if (action === 'block') {
      setPlayerPose('block');
    }

    setTimeout(() => {
      setPlayerPose('idle');
      setEnemyPose('idle');
    }, 400);
  };

  const renderFighter = (isEnemy: boolean, pose: string, color: string) => {
    const scaleX = isEnemy ? -1 : 1;
    let offsetX = 0;
    if (pose === 'attack') offsetX = 20;
    if (pose === 'hurt') offsetX = -10;
    
    return (
      <div style={{ transform: `scaleX(${scaleX}) translateX(${offsetX}px)`, transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 80, height: 120, position: 'relative' }}>
          {/* Head */}
          <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: color, position: 'absolute', top: 0, left: 25 }} />
          {/* Body */}
          <div style={{ width: 6, height: 50, backgroundColor: color, position: 'absolute', top: 30, left: 37 }} />
          {/* Arms */}
          <div style={{ width: 60, height: 6, backgroundColor: color, position: 'absolute', top: 40, left: 10, transform: pose === 'block' ? 'rotate(-45deg)' : pose === 'attack' ? 'rotate(45deg)' : 'none' }} />
          {/* Legs */}
          <div style={{ width: 6, height: 40, backgroundColor: color, position: 'absolute', top: 80, left: 25, transform: 'rotate(20deg)' }} />
          <div style={{ width: 6, height: 40, backgroundColor: color, position: 'absolute', top: 80, left: 49, transform: 'rotate(-20deg)' }} />
          
          {/* Weapon */}
          {pose === 'block' && <Shield className="w-12 h-12 text-amber-700 absolute top-8 left-16" />}
          {pose !== 'block' && <Sword className="w-16 h-16 text-gray-300 absolute top-5 left-12" style={{ transform: 'rotate(45deg)' }} />}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden p-4">
      <div className="text-center mb-6">
        <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">African Warrior Theme</span>
        <h2 className="text-2xl font-bold text-white mt-4">Training Village</h2>
      </div>

      <div className="flex-1 flex justify-between items-end relative border-b-8 border-neutral-800 pb-4 mb-8">
        {/* Player Left */}
        <div className="flex flex-col items-center z-10 w-1/3">
           <span className="text-white text-xs font-bold mb-2">You: {playerHp} HP</span>
           <div className="w-full h-2 bg-neutral-950 rounded-full mb-4 overflow-hidden border border-neutral-800">
             <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${playerHp}%` }} />
           </div>
           {renderFighter(false, playerPose, '#10b981')}
        </div>

        {/* Enemy Right */}
        <div className="flex flex-col items-center z-10 w-1/3">
           <span className="text-white text-xs font-bold mb-2">Enemy: {enemyHp} HP</span>
           <div className="w-full h-2 bg-neutral-950 rounded-full mb-4 overflow-hidden border border-neutral-800">
             <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${enemyHp}%` }} />
           </div>
           {renderFighter(true, enemyPose, '#ef4444')}
        </div>
      </div>

      {/* UI Controls */}
      <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
        <div className="text-center mb-4">
           <span className="text-emerald-400 font-mono font-bold text-lg drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">COMBO x{combo}</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => handleAction('block')}
            className="flex-1 h-16 rounded-xl bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-all border border-neutral-700 shadow-lg active:scale-95"
          >
            <Shield className="w-8 h-8 text-white" />
          </button>
          <button 
            onClick={() => handleAction('attack')}
            className="flex-[2] h-16 rounded-xl bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95"
          >
             <span className="text-neutral-950 font-bold text-2xl tracking-wider">ATK</span>
          </button>
        </div>
      </div>
    </div>
  );
}
