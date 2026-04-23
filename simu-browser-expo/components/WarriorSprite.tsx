import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Path, Polygon } from 'react-native-svg';

interface Props {
  pose: 'idle' | 'attack' | 'hurt' | 'block';
  color: string;
  weapon: 'spear' | 'shield' | 'axe' | 'bow';
  facingLeft?: boolean;
}

export function WarriorSprite({ pose, color, weapon, facingLeft }: Props) {
  const getPoseOffset = () => {
    switch (pose) {
      case 'attack': return { x: 20, armA: -30, armB: 60 };
      case 'block': return { x: -10, armA: -80, armB: -10 };
      case 'hurt': return { x: -20, armA: -120, armB: 120 };
      case 'idle':
      default: return { x: 0, armA: 30, armB: 30 };
    }
  };

  const p = getPoseOffset();
  const scaleX = facingLeft ? -1 : 1;

  return (
    <View style={[styles.container, { transform: [{ scaleX }] }]}>
      <Svg height="200" width="150" viewBox="0 0 150 200">
        {/* Weapon rendering behind/front */}
        {weapon === 'spear' && (
          <Line x1="40" y1="40" x2="160" y2="40" stroke="#FFF" strokeWidth="4" 
            transform={`rotate(${pose === 'attack' ? 15 : -30} 75 100)`} 
          />
        )}

        {/* Head */}
        <Circle cx={75 + p.x/4} cy="40" r="15" fill={color} />
        
        {/* Tribal Headband */}
        <Path d={`M ${60 + p.x/4} 35 Q ${75 + p.x/4} 45 ${90 + p.x/4} 35`} stroke="#FFD700" strokeWidth="4" fill="none" />

        {/* Body */}
        <Line x1={75 + p.x/4} y1="55" x2={75 + p.x} y2="120" stroke={color} strokeWidth="6" strokeLinecap="round" />

        {/* Left Arm */}
        <Line x1={75 + p.x/4} y1="70" x2={40 + p.x} y2={100 + p.armA} stroke={color} strokeWidth="5" strokeLinecap="round" />

        {/* Right Arm */}
        <Line x1={75 + p.x/4} y1="70" x2={110 + p.x} y2={100 + p.armB} stroke={color} strokeWidth="5" strokeLinecap="round" />

        {/* Left Leg */}
        <Line x1={75 + p.x} y1="120" x2={50} y2={190} stroke={color} strokeWidth="6" strokeLinecap="round" />

        {/* Right Leg */}
        <Line x1={75 + p.x} y1="120" x2={100 + p.x*2} y2={190} stroke={color} strokeWidth="6" strokeLinecap="round" />
        
        {/* Tribal accessories: Anklet */}
        <Line x1={45} y1={170} x2={55} y2={175} stroke="#FFD700" strokeWidth="3" />
        <Line x1={95 + p.x*2} y1={170} x2={105 + p.x*2} y2={175} stroke="#FFD700" strokeWidth="3" />

        {/* Shield rendering front */}
        {weapon === 'shield' && (
          <Polygon points="90,60 130,60 110,130" fill="#8B4513" stroke="#FFF" strokeWidth="2" 
            transform={`translate(${p.x}, ${p.armB / 2})`}
          />
        )}
        {weapon === 'axe' && (
           <Path d={`M 100 ${100 + p.armB} L 120 ${80 + p.armB} L 100 ${60 + p.armB} Z`} fill="#CCC" stroke="#FFF" />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
