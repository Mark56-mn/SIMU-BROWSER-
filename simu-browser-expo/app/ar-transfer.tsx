import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useHandTracker } from '../lib/arCoin';
import { initNFCSystem, startNfcTransfer, startUltrasonicTransfer } from '../lib/arTransfer';
import { ARCoinOverlay } from '../components/ARCoinOverlay';
import * as Haptics from 'expo-haptics';

export default function ARTransferScreen() {
  const router = useRouter();
  const { palmPosition, setPalmPosition } = useHandTracker();
  
  const [amount, setAmount] = useState(50); // Default test amount
  const [transferMode, setTransferMode] = useState<'NFC' | 'ULTRASONIC'>('NFC');
  const [isTransferring, setIsTransferring] = useState(false);
  const [status, setStatus] = useState('Hold out your palm to reveal coin');

  useEffect(() => {
    initNFCSystem().then(supported => {
      if (!supported) setTransferMode('ULTRASONIC');
    });
    
    // Simulate detecting a hand for Web/Expo previews
    setTimeout(() => {
      setPalmPosition({ x: 200, y: 400 });
      setStatus(transferMode === 'NFC' ? 'Tap phones to send' : 'Bring hands close to send');
    }, 2000);
  }, []);

  const handleExecuteTransfer = async () => {
    if (amount > 500) return Alert.alert('Limit Exceeded', 'Max 500 SIMU per AR transfer.');
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setIsTransferring(true);
    setStatus('Authenticating Transfer...');

    const res: any = transferMode === 'NFC' 
      ? await startNfcTransfer(amount) 
      : await startUltrasonicTransfer(amount);

    if (res.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStatus('Transfer Complete!');
      Alert.alert('Success', `${amount} SIMU transferred into receiver's palm.`, [
        { text: 'Done', onPress: () => router.back() }
      ]);
    } else {
      setIsTransferring(false);
      setStatus('Failed to connect.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Fallback Camera Background Simulation */}
      <View style={styles.cameraFrame}>
        <Ionicons name="scan-outline" size={300} color="#333" style={{ opacity: 0.1 }} />
      </View>

      <ARCoinOverlay 
        position={palmPosition} 
        amount={amount} 
        animatingTransfer={isTransferring} 
      />

      {/* Header UI */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>AR Transfer</Text>
      </View>

      {/* Footer UI */}
      <View style={styles.footer}>
        <Text style={styles.instruction}>{status}</Text>
        
        {palmPosition && !isTransferring && (
          <TouchableOpacity style={styles.actionBtn} onPress={handleExecuteTransfer}>
            <Text style={styles.actionText}>🚀 Execute {amount} SIMU Transfer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', zIndex: 50 },
  backBtn: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },
  title: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 16 },
  cameraFrame: { ...StyleSheet.absoluteFillObject, backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center' },
  footer: { position: 'absolute', bottom: 50, left: 20, right: 20, alignItems: 'center', zIndex: 50 },
  instruction: { color: '#00FFA3', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 },
  actionBtn: { backgroundColor: '#FFD700', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 30, shadowColor: '#FFD700', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3 },
  actionText: { color: '#000', fontSize: 16, fontWeight: 'bold' }
});
