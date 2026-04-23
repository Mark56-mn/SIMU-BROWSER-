import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WarriorSprite } from './WarriorSprite';

interface Props {
  onComplete: () => void;
  isConnected: boolean | null;
  levelData: any;
}

export function WarriorFight({ onComplete, isConnected, levelData }: Props) {
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [playerPose, setPlayerPose] = useState<'idle' | 'attack' | 'hurt' | 'block'>('idle');
  const [enemyPose, setEnemyPose] = useState<'idle' | 'attack' | 'hurt' | 'block'>('idle');
  const [combo, setCombo] = useState(0);

  const difficulty = levelData.difficulty || 1;
  const isOnlineOnly = difficulty > 5;

  if (isOnlineOnly && !isConnected) {
    return (
      <View style={styles.container}>
         <Ionicons name="cloud-offline" size={64} color="#888" />
         <Text style={styles.title}>Online Tournament Offline</Text>
         <Text style={styles.sub}>Please connect to network.</Text>
      </View>
    );
  }

  // AI enemy logic
  useEffect(() => {
    if (enemyHp <= 0 || playerHp <= 0) return;
    
    // AI attacks randomly based on difficulty
    const timer = setInterval(() => {
      // Small chance to auto-attack
      if (Math.random() < (0.1 * difficulty)) {
        triggerEnemyAttack();
      }
    }, 1500);
    
    return () => clearInterval(timer);
  }, [enemyHp, playerHp, difficulty]);

  useEffect(() => {
    if (enemyHp <= 0) {
      setTimeout(() => onComplete(), 1500);
    } else if (playerHp <= 0) {
      Alert.alert('Defeated', 'The ancestors urge you to try again.', [{ text: 'Retry', onPress: reset }]);
    }
  }, [enemyHp, playerHp]);

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
      setPlayerHp(h => Math.max(0, h - (10 + difficulty * 2)));
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
      
      // Damage calculation
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

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>African Warrior Theme</Text>
      <Text style={styles.title}>{levelData.question}</Text>

      {/* Arena */}
      <View style={styles.arena}>
        <View style={styles.arenaFloor} />
        
        {/* Player Left */}
        <View style={styles.fighterSlotLeft}>
           <Text style={styles.hpLabel}>You: {playerHp} HP</Text>
           <View style={styles.hpBarBg}><View style={[styles.hpBarFill, { width: `${playerHp}%`, backgroundColor: '#00FFA3' }]} /></View>
           <WarriorSprite pose={playerPose} color="#00FFA3" weapon="spear" />
        </View>

        {/* Enemy Right */}
        <View style={styles.fighterSlotRight}>
           <Text style={styles.hpLabel}>{levelData.opponentName || 'Enemy'}: {enemyHp} HP</Text>
           <View style={styles.hpBarBg}><View style={[styles.hpBarFill, { width: `${enemyHp}%`, backgroundColor: '#FF4444' }]} /></View>
           <WarriorSprite pose={enemyPose} color="#FF4444" weapon={difficulty > 3 ? 'shield' : 'axe'} facingLeft />
        </View>
      </View>

      {/* UI Controls */}
      <View style={styles.controls}>
        <View style={styles.comboBox}>
           <Text style={styles.comboText}>COMBO x{combo}</Text>
        </View>
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#444' }]} onPress={() => handleAction('block')}>
            <Ionicons name="shield" size={32} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#FFD700', flex: 2 }]} onPress={() => handleAction('attack')}>
             <Text style={styles.attackText}>ATK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A', borderRadius: 16, overflow: 'hidden', padding: 16 },
  badge: { color: '#FFD700', fontSize: 12, fontWeight: 'bold', alignSelf: 'center', marginBottom: 8 },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold', alignSelf: 'center', marginBottom: 16 },
  sub: { color: '#888', alignSelf: 'center' },
  arena: { height: 250, flexDirection: 'row', justifyContent: 'space-between', position: 'relative', marginBottom: 24 },
  arenaFloor: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, backgroundColor: '#333', borderRadius: 8 },
  fighterSlotLeft: { alignItems: 'center', zIndex: 10 },
  fighterSlotRight: { alignItems: 'center', zIndex: 10 },
  hpLabel: { color: '#FFF', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  hpBarBg: { width: 100, height: 8, backgroundColor: '#000', borderRadius: 4, marginBottom: 8, overflow: 'hidden' },
  hpBarFill: { height: '100%' },
  controls: { padding: 16, backgroundColor: '#000', borderRadius: 16 },
  comboBox: { alignItems: 'center', marginBottom: 16 },
  comboText: { color: '#00FFA3', fontSize: 16, fontWeight: 'bold' },
  btnRow: { flexDirection: 'row', gap: 16 },
  btn: { flex: 1, height: 60, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  attackText: { color: '#000', fontSize: 24, fontWeight: 'bold' }
});
