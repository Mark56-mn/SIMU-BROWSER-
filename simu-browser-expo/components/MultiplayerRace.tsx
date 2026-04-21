import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onComplete: () => void;
  isConnected: boolean | null;
}

export function MultiplayerRace({ onComplete, isConnected }: Props) {
  const [countdown, setCountdown] = useState(3);
  const [racing, setRacing] = useState(false);
  const [myProgress, setMyProgress] = useState(0);
  const [opponents, setOpponents] = useState([0, 0, 0]);

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Multiplayer lobby offline.</Text>
      </View>
    );
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !racing) {
      setRacing(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (!racing) return;
    
    // Simulate opponent websocket events
    const interval = setInterval(() => {
      setOpponents(prev => prev.map(p => {
        const newP = p + (Math.random() * 8);
        return newP > 100 ? 100 : newP;
      }));
    }, 500);

    return () => clearInterval(interval);
  }, [racing]);

  const tapToRun = () => {
    if (!racing) return;
    setMyProgress(prev => {
      const next = prev + 5;
      if (next >= 100) {
        setRacing(false);
        setTimeout(onComplete, 1000); // Winner!
        return 100;
      }
      return next;
    });
  };

  const renderTrack = (name: string, progress: number, isMe: boolean = false) => (
    <View style={styles.track}>
      <Text style={[styles.racerName, isMe && styles.meText]}>{name}</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${progress}%`, backgroundColor: isMe ? '#00FFA3' : '#FF4444' }]} />
      </View>
      <Ionicons name="body" size={24} color={isMe ? '#00FFA3' : '#FFF'} style={{ position: 'absolute', left: `${progress}%`, marginLeft: -12, marginTop: 24 }} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>4-Player Global Sprint</Text>
      
      {!racing && countdown > 0 ? (
        <View style={styles.countdownBox}>
           <Text style={styles.subtitle}>Matchmaking complete...</Text>
           <Text style={styles.countdown}>{countdown}</Text>
        </View>
      ) : (
        <View style={styles.raceArena}>
          {renderTrack('Player 1 (You)', myProgress, true)}
          {renderTrack('CyberNinja', opponents[0])}
          {renderTrack('BlockRunner', opponents[1])}
          {renderTrack('Node_0x', opponents[2])}
        </View>
      )}

      {racing && (
        <TouchableOpacity style={styles.button} onPress={tapToRun}>
          <Text style={styles.buttonText}>TAP TO RUN RAPIDLY!</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center', width: '100%' },
  title: { fontSize: 22, color: '#00FFA3', fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#AAA', marginBottom: 12 },
  countdownBox: { alignItems: 'center', justifyContent: 'center', height: 200 },
  countdown: { fontSize: 72, color: '#FFF', fontWeight: 'bold' },
  raceArena: { width: '100%', marginBottom: 32 },
  track: { marginBottom: 24, position: 'relative' },
  racerName: { color: '#888', fontSize: 12, marginBottom: 4 },
  meText: { color: '#00FFA3', fontWeight: 'bold' },
  barBg: { height: 8, backgroundColor: '#222', borderRadius: 4, width: '100%' },
  barFill: { height: '100%', borderRadius: 4 },
  button: { backgroundColor: '#00FFA3', paddingVertical: 24, paddingHorizontal: 32, borderRadius: 12, alignItems: 'center', width: '100%' },
  buttonText: { color: '#000', fontSize: 20, fontWeight: 'bold' }
});
