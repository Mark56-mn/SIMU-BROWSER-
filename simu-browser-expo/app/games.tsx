import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import { GameCard } from '../components/GameCard';
import { WebViewScreen } from '../components/WebViewScreen';

export default function GamesScreen() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase.from('games_registry').select('*');
      if (error) throw error;
      setGames(data || []);
    } catch (err) {
      // Fallback mock data if Supabase is not connected
      setGames([
        { id: '1', name: 'SIMU Runner', size_mb: 1.2, url: 'https://games.simu.network/runner', category: 'Action', is_cached: true },
        { id: '2', name: 'Crypto Puzzle', size_mb: 0.8, url: 'https://games.simu.network/puzzle', category: 'Logic', is_cached: false },
        { id: '3', name: 'Ang Nodes Tycoon', size_mb: 2.4, url: 'https://games.simu.network/tycoon', category: 'Strategy', is_cached: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (activeUrl) {
    return <WebViewScreen url={activeUrl} onClose={() => setActiveUrl(null)} />;
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00FFA3" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={games}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <GameCard game={item} onLaunch={() => setActiveUrl(item.url)} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  grid: { padding: 8 },
});
