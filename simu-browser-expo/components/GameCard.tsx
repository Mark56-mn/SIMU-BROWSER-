import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function GameCard({ game, onLaunch }: { game: any; onLaunch: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onLaunch}>
      <View style={styles.iconPlaceholder} />
      {game.is_cached && <View style={styles.badge}><Text style={styles.badgeText}>Offline Ready</Text></View>}
      <Text style={styles.name} numberOfLines={1}>{game.name}</Text>
      <Text style={styles.meta}>{game.size_mb} MB • {game.category}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: '#1A1A1A', margin: 6, padding: 16, borderRadius: 16, alignItems: 'center', position: 'relative' },
  iconPlaceholder: { width: 64, height: 64, backgroundColor: '#333', borderRadius: 16, marginBottom: 12 },
  badge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#00FFA320', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  badgeText: { color: '#00FFA3', fontSize: 8, fontWeight: 'bold' },
  name: { color: '#FFF', fontWeight: 'bold', fontSize: 14, marginBottom: 4, textAlign: 'center' },
  meta: { color: '#888', fontSize: 10 },
});
