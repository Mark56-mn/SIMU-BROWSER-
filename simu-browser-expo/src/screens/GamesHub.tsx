import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AppDetector, AppStatus } from '../lib/AppDetector';

export function GamesHub({ onLaunch }: { onLaunch: (url: string) => void }) {
  const [testnetStatus, setTestnetStatus] = useState<AppStatus>('not_installed');
  const [nodesStatus, setNodesStatus] = useState<AppStatus>('not_installed');

  useEffect(() => {
    AppDetector.checkTestnet().then(setTestnetStatus);
    AppDetector.checkAngNodes().then(status => {
      setNodesStatus(status);
      if (status === 'installed') {
        console.log("Toast: Connected to Ang Nodes for faster validation.");
      }
    });
  }, []);

  const handlePlay = (url: string) => {
    if (testnetStatus === 'not_installed') {
      Alert.alert("Notice", "Install SIMU Testnet to play games with rewards.");
      return;
    }
    onLaunch(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {testnetStatus === 'installed' && <Text style={styles.badge}>Testnet Connected</Text>}
        {nodesStatus === 'installed' && <Text style={styles.badge}>Nodes Active</Text>}
      </View>
      <FlatList
        data={[{ id: '1', name: 'SIMU Runner', url: 'https://games.simu.network/runner' }]}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.card, testnetStatus === 'not_installed' && styles.disabled]} 
            onPress={() => handlePlay(item.url)}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.playBtn}>Play</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  header: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  badge: { backgroundColor: '#00FFA3', color: '#000', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 10, fontWeight: 'bold' },
  card: { backgroundColor: '#1E1E1E', padding: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  disabled: { opacity: 0.5 },
  name: { color: '#FFF', fontWeight: 'bold' },
  playBtn: { color: '#00FFA3', fontWeight: 'bold' }
});
