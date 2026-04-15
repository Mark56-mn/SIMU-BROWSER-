import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';

export function DAppsScreen({ onLaunch }: { onLaunch: (url: string) => void }) {
  const [dapps, setDapps] = useState<any[]>([]);

  useEffect(() => {
    // Supabase fetch mock
    setDapps([{ id: '1', name: 'SIMU Dex', category: 'DeFi', url: 'https://dex.simu.network', size: 1.5 }]);
  }, []);

  const handleLaunch = (dapp: any) => {
    Alert.alert(
      "Permission Request",
      `${dapp.name} requests wallet access.`,
      [
        { text: "Deny", style: "cancel" },
        { text: "Allow", onPress: () => onLaunch(dapp.url) }
      ]
    );
  };

  return (
    <FlatList
      data={dapps}
      numColumns={2}
      style={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleLaunch(item)}>
          <View style={styles.icon} />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>{item.category} • {item.size}MB</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 8 },
  card: { flex: 1, backgroundColor: '#1E1E1E', margin: 8, padding: 16, borderRadius: 12, alignItems: 'center' },
  icon: { width: 48, height: 48, backgroundColor: '#333', borderRadius: 12, marginBottom: 8 },
  name: { color: '#FFF', fontWeight: 'bold' },
  meta: { color: '#888', fontSize: 12 }
});
