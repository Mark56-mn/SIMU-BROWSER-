import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { OfflineCache } from './OfflineCache';

interface Game {
  id: string;
  name: string;
  url: string;
  data_usage_mb: number;
}

interface Props {
  onLaunch: (url: string) => void;
}

export function GamesHub({ onLaunch }: Props) {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    const cached = await OfflineCache.getItem('games_list');
    if (cached) {
      setGames(cached);
    } else {
      const mockGames = [
        { id: '1', name: 'SIMU Runner', url: 'https://games.simu.network/runner', data_usage_mb: 1.2 },
        { id: '2', name: 'Crypto Puzzle', url: 'https://games.simu.network/puzzle', data_usage_mb: 0.8 },
      ];
      setGames(mockGames);
      OfflineCache.saveItem('games_list', mockGames);
    }
  };

  const renderItem = ({ item }: { item: Game }) => (
    <TouchableOpacity style={styles.card} onPress={() => onLaunch(item.url)}>
      <View style={styles.iconPlaceholder} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.data}>{item.data_usage_mb} MB</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={games}
      numColumns={2}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.grid}
    />
  );
}

const styles = StyleSheet.create({
  grid: { padding: 8 },
  card: { flex: 1, backgroundColor: '#1E1E1E', margin: 8, padding: 16, borderRadius: 12, alignItems: 'center' },
  iconPlaceholder: { width: 64, height: 64, backgroundColor: '#333', borderRadius: 16, marginBottom: 12 },
  name: { color: '#FFF', fontWeight: 'bold', marginBottom: 4 },
  data: { color: '#888', fontSize: 12 }
});
