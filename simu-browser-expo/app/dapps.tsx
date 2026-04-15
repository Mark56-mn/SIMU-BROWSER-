import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { WebViewScreen } from '../components/WebViewScreen';

export default function DAppsScreen() {
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  const dapps = [
    { id: '1', name: 'SIMU DEX', category: 'DeFi', url: 'https://dex.simu.network', verified: true },
    { id: '2', name: 'NFT Marketplace', category: 'Collectibles', url: 'https://nft.simu.network', verified: true },
    { id: '3', name: 'Community Faucet', category: 'Utility', url: 'https://faucet.simu.network', verified: false },
  ];

  const handleLaunch = (dapp: any) => {
    Alert.alert(
      "Permission Request",
      `${dapp.name} wants to access your SIMU wallet address and read-only balance.`,
      [
        { text: "Deny", style: "cancel" },
        { text: "Allow", onPress: () => setActiveUrl(dapp.url) }
      ]
    );
  };

  if (activeUrl) {
    return <WebViewScreen url={activeUrl} onClose={() => setActiveUrl(null)} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={dapps}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleLaunch(item)}>
            <View style={styles.iconPlaceholder} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.category} {item.verified ? '✓ Verified' : ''}</Text>
            </View>
            <View style={styles.launchBtn}>
              <Text style={styles.launchText}>Launch</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  list: { padding: 16 },
  card: { flexDirection: 'row', backgroundColor: '#1A1A1A', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  iconPlaceholder: { width: 48, height: 48, backgroundColor: '#333', borderRadius: 12, marginRight: 16 },
  info: { flex: 1 },
  name: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  meta: { color: '#888', fontSize: 12, marginTop: 4 },
  launchBtn: { backgroundColor: '#00FFA320', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  launchText: { color: '#00FFA3', fontWeight: 'bold', fontSize: 12 },
});
