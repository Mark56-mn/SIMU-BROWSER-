import React, { useState, useEffect } from 'react';
import { Shield, Sword, ChevronRight, Activity, Crosshair, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TribeSelector } from './TribeSelector';
import { ChallengeBanner } from './ChallengeBanner';
import { GameEconomy } from '../lib/gameEconomy';
import { Tribe, Level, TRIBES, LEVELS } from '../lib/warrior-data';

interface Props {
  onComplete: () => void;
}

export function WarriorFight({ onComplete }: Props) {
  const [stars, setStars] = useState(0);
  const [selectedTribe, setSelectedTribe] = useState<Tribe | null>(null);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{reward: number, flawless: boolean}>({reward: 0, flawless: false});
  
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [playerPose, setPlayerPose] = useState<'idle' | 'attack' | 'hurt' | 'block'>('idle');
  const [enemyPose, setEnemyPose] = useState<'idle' | 'attack' | 'hurt' | 'block'>('idle');
  const [combo, setCombo] = useState(0);
  
  const currentLevel = LEVELS[currentLevelIdx];
  const enemyTribe = TRIBES.find(t => t.id === currentLevel?.enemyTribeId) || TRIBES[0];

  // AI enemy logic
  useEffect(() => {
    if (!selectedTribe || enemyHp <= 0 || playerHp <= 0 || isCelebrating) return;
    
    const attackSpeed = 1500 / currentLevel.difficulty;
    const timer = setInterval(() => {
      if (Math.random() < 0.35) {
        triggerEnemyAttack();
      }
    }, attackSpeed);
    
    return () => clearInterval(timer);
  }, [enemyHp, playerHp, selectedTribe, currentLevelIdx, isCelebrating]);

  useEffect(() => {
    if (enemyHp <= 0 && selectedTribe && !isCelebrating) {
      handleVictory();
    } else if (playerHp <= 0) {
      alert('Defeated. The ancestors urge you to try again.');
      resetFight();
    }
  }, [enemyHp, playerHp]);

  const handleVictory = async () => {
    const isFlawless = playerHp === 100;
    const reward = 10 + (isFlawless ? 5 : 0);
    
    await GameEconomy.rewardStars(reward, `Beat ${currentLevel.name}`);
    setStars(s => s + reward);
    
    setCelebrationData({ reward, flawless: isFlawless });
    setIsCelebrating(true);
    
    setTimeout(async () => {
      setIsCelebrating(false);
      
      if (currentLevelIdx < LEVELS.length - 1) {
        setCurrentLevelIdx(idx => idx + 1);
        resetFight();
      } else {
        await GameEconomy.shareVictory(`I just unified the tribes in African Warrior as a ${selectedTribe?.name} champion!`);
        alert("Campaign Complete! Shared to Community.");
        onComplete();
      }
    }, 3000);
  };

  const resetFight = () => {
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
      setPlayerHp(h => Math.max(0, h - (12 * currentLevel.difficulty)));
      setCombo(0);
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
      
      const dmg = (8 + (combo * 2)) / currentLevel.difficulty;
      
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

  const renderWeapon = (weaponType: string) => {
    switch(weaponType) {
      case 'Spear': return <Sword className="w-16 h-16 absolute top-5 left-12" style={{ transform: 'rotate(45deg) scaleY(1.5)' }} />;
      case 'Shield': return <Shield className="w-12 h-12 absolute top-8 left-16" />;
      case 'Axe': return <Activity className="w-12 h-12 absolute top-6 left-12" />; // Mocking Axe
      case 'Staff': return <Minus className="w-16 h-16 absolute top-6 left-12" style={{ transform: 'rotate(45deg) scaleX(2)' }} />; // Mocking Staff
      case 'Bow': return <Crosshair className="w-12 h-12 absolute top-6 left-12" />; // Mocking Bow
      default: return <Sword className="w-16 h-16 absolute top-5 left-12" style={{ transform: 'rotate(45deg)' }} />;
    }
  };

  const renderFighter = (isEnemy: boolean, pose: string, tribe: Tribe) => {
    const scaleX = isEnemy ? -1 : 1;
    let offsetX = 0;
    if (pose === 'attack') offsetX = 20;
    if (pose === 'hurt') offsetX = -10;
    
    return (
      <div style={{ transform: `scaleX(${scaleX}) translateX(${offsetX}px)`, transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 80, height: 120, position: 'relative' }}>
          {/* Head */}
          <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: tribe.color, position: 'absolute', top: 0, left: 25 }} />
          {/* Body */}
          <div style={{ width: 6, height: 50, backgroundColor: tribe.color, position: 'absolute', top: 30, left: 37 }} />
          {/* Arms */}
          <div style={{ width: 60, height: 6, backgroundColor: tribe.color, position: 'absolute', top: 40, left: 10, transform: pose === 'block' ? 'rotate(-45deg)' : pose === 'attack' ? 'rotate(45deg)' : 'none' }} />
          {/* Legs */}
          <div style={{ width: 6, height: 40, backgroundColor: tribe.color, position: 'absolute', top: 80, left: 25, transform: 'rotate(20deg)' }} />
          <div style={{ width: 6, height: 40, backgroundColor: tribe.color, position: 'absolute', top: 80, left: 49, transform: 'rotate(-20deg)' }} />
          
          {/* Weapon (Enemy uses default block shield if blocking, else tribe weapon) */}
          {pose === 'block' && <Shield className="w-12 h-12 text-neutral-500 absolute top-8 left-16" />}
          <div style={{ color: isEnemy ? '#888' : '#e5e7eb', transition: 'all 0.2s', opacity: pose === 'block' ? 0 : 1 }}>
            {renderWeapon(tribe.weapon)}
          </div>
        </div>
      </div>
    );
  };

  if (!selectedTribe) {
    return <TribeSelector onSelect={setSelectedTribe} />;
  }

  return (
    <div className="flex flex-col h-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden relative">
      <AnimatePresence>
        {isCelebrating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-neutral-900 border border-neutral-700 p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-[80%]"
            >
              <div className="text-4xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-white mb-2 text-center">Victory!</h2>
              {celebrationData.flawless && (
                <span className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                  Flawless Flawless Bonus
                </span>
              )}
              <div className="text-emerald-400 font-mono text-xl font-bold">
                +{celebrationData.reward} Stars
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ChallengeBanner stars={stars} />
      
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundColor: currentLevel.themeColor }} />

      <div className="text-center py-4 z-10 border-b border-neutral-800/50 bg-neutral-950/50">
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: currentLevel.themeColor, borderColor: `${currentLevel.themeColor}50`, backgroundColor: `${currentLevel.themeColor}10` }}>
          Level {currentLevelIdx + 1}: {currentLevel.background}
        </span>
        <h2 className="text-2xl font-bold text-white mt-2">{currentLevel.name}</h2>
      </div>

      <div className="flex-1 min-h-0 flex justify-between items-end relative border-b-8 border-neutral-800 pb-4 mb-4 mt-8 px-4 sm:px-12">
        {/* Player Left */}
        <div className="flex flex-col items-center z-10 w-1/3">
           <span className="text-white text-xs font-bold mb-2">You ({selectedTribe.name}): {Math.ceil(playerHp)}</span>
           <div className="w-full h-2 bg-neutral-950 rounded-full mb-4 overflow-hidden border border-neutral-800">
             <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${playerHp}%`, backgroundColor: selectedTribe.color }} />
           </div>
           {renderFighter(false, playerPose, selectedTribe)}
        </div>

        {/* Enemy Right */}
        <div className="flex flex-col items-center z-10 w-1/3">
           <span className="text-neutral-300 text-xs font-bold mb-2">{enemyTribe.name} Foe: {Math.ceil(enemyHp)}</span>
           <div className="w-full h-2 bg-neutral-950 rounded-full mb-4 overflow-hidden border border-neutral-800">
             <div className="h-full transition-all duration-300" style={{ width: `${enemyHp}%`, backgroundColor: enemyTribe.color }} />
           </div>
           {renderFighter(true, enemyPose, enemyTribe)}
        </div>
      </div>

      {/* UI Controls */}
      <div className="bg-neutral-950 p-4 z-10 border-t border-neutral-800 shrink-0">
        <div className="text-center mb-4">
           <span className="font-mono font-bold text-lg" style={{ color: selectedTribe.color, textShadow: `0 0 10px ${selectedTribe.color}50` }}>
             COMBO x{combo}
           </span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => handleAction('block')}
            className="flex-1 h-14 sm:h-16 rounded-xl bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-all border border-neutral-700 shadow-lg active:scale-95"
          >
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </button>
          <button 
            onClick={() => handleAction('attack')}
            className="flex-[2] h-14 sm:h-16 rounded-xl flex items-center justify-center transition-all active:scale-95 border-b-4"
            style={{ backgroundColor: selectedTribe.color, borderColor: 'rgba(0,0,0,0.3)' }}
          >
             <span className="text-neutral-950 font-bold text-xl sm:text-2xl tracking-wider">
               {selectedTribe.weapon.toUpperCase()} STRIKE
             </span>
          </button>
        </div>
      </div>
    </div>
  );
}
