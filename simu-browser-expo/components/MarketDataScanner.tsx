import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onComplete: () => void;
  isConnected: boolean | null;
}

export function MarketDataScanner({ onComplete, isConnected }: Props) {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Market scanner offline.</Text>
      </View>
    );
  }

  const handleStartScan = () => {
    setScanning(true);
    let current = 0;
    
    // Simulate real-world scanning via sensors
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 50) + 10;
      if (current >= 500) {
        current = 500;
        clearInterval(interval);
        setTimeout(() => {
          setScanning(false);
          onComplete(); // Triggers reward 25 Stars + 10 SIMU
        }, 500);
      }
      setProgress(current);
    }, 400);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real-World Data Challenge</Text>
      <Text style={styles.subtitle}>Collect 500 local market data points utilizing GPS and Camera sensors to earn the Economist Badge.</Text>
      
      <View style={styles.sensorCard}>
        <Ionicons name="camera-outline" size={48} color={scanning ? "#00FFA3" : "#444"} />
        <Ionicons name="location-outline" size={48} color={scanning ? "#00FFA3" : "#444"} />
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>{progress} / 500 Data Points</Text>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${(progress / 500) * 100}%` }]} />
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, scanning && styles.buttonDisabled]} 
        onPress={handleStartScan}
        disabled={scanning}
      >
        <Text style={styles.buttonText}>{scanning ? 'Scanning environment...' : 'Deploy Sensors'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center', width: '100%' },
  title: { fontSize: 22, color: '#00FFA3', fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#AAA', marginBottom: 32, textAlign: 'center', lineHeight: 20 },
  sensorCard: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 32, padding: 24, backgroundColor: '#111', borderRadius: 16, borderWidth: 1, borderColor: '#333' },
  progressContainer: { width: '100%', marginBottom: 32 },
  progressText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  barBg: { height: 16, backgroundColor: '#222', borderRadius: 8, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#00FFA3' },
  button: { backgroundColor: '#00FFA3', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, alignItems: 'center', width: '100%' },
  buttonDisabled: { backgroundColor: '#444' },
  buttonText: { color: '#000', fontSize: 16, fontWeight: 'bold' }
});
