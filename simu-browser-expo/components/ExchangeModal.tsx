import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getExchangeRate, swapSimuToStars, swapStarsToSimu } from '../lib/stars';

export function ExchangeModal({ visible, onClose, onRefresh }: { visible: boolean, onClose: () => void, onRefresh: () => void }) {
  const [rate, setRate] = useState(10);
  const [direction, setDirection] = useState<'to_stars' | 'to_simu'>('to_stars');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      getExchangeRate().then(setRate);
      setAmount('');
    }
  }, [visible]);

  const handleSwap = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return Alert.alert('Error', 'Enter a valid amount');
    
    setLoading(true);
    let res;
    if (direction === 'to_stars') {
      res = await swapSimuToStars(val);
    } else {
      res = await swapStarsToSimu(val);
    }
    setLoading(false);

    if (res?.success) {
      Alert.alert('Success', 'Exchange completed successfully!');
      onRefresh();
      onClose();
    } else {
      Alert.alert('Exchange Failed', res?.error || 'Unknown error occurred.');
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Exchange Stars</Text>
          <Text style={styles.rate}>Rate: 1 SIMU = {rate} ⭐</Text>
          
          <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tab, direction === 'to_stars' && styles.tabActive]} onPress={() => setDirection('to_stars')}>
              <Text style={direction === 'to_stars' ? styles.tabTextActive : styles.tabText}>Get Stars</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, direction === 'to_simu' && styles.tabActive]} onPress={() => setDirection('to_simu')}>
              <Text style={direction === 'to_simu' ? styles.tabTextActive : styles.tabText}>Get SIMU</Text>
            </TouchableOpacity>
          </View>

          <TextInput 
            style={styles.input} 
            placeholder={direction === 'to_stars' ? 'SIMU Amount' : 'Stars Amount'}
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          
          <Text style={styles.estimate}>
            You will receive: {amount ? (direction === 'to_stars' ? parseFloat(amount) * rate + ' ⭐' : (parseFloat(amount) / rate).toFixed(2) + ' SIMU') : '0'}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.swapBtn} onPress={handleSwap} disabled={loading}>
              {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.swapText}>Swap</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#1A1A1A', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#333' },
  title: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  rate: { color: '#00FFA3', fontSize: 14, textAlign: 'center', marginBottom: 20 },
  tabs: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#222', borderRadius: 8, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  tabActive: { backgroundColor: '#333' },
  tabText: { color: '#888', fontWeight: 'bold' },
  tabTextActive: { color: '#FFD700', fontWeight: 'bold' },
  input: { backgroundColor: '#000', color: '#FFF', padding: 16, borderRadius: 8, fontSize: 18, borderWidth: 1, borderColor: '#333', marginBottom: 12 },
  estimate: { color: '#AAA', fontSize: 14, textAlign: 'center', marginBottom: 24 },
  actions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: '#333', borderRadius: 8 },
  cancelText: { color: '#FFF', fontWeight: 'bold' },
  swapBtn: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: '#FFD700', borderRadius: 8 },
  swapText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});
