import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import { GameCard } from '../components/GameCard';
import { SecureWebView } from '../components/SecureWebView';
import { useNetInfo } from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';

export default function GamesScreen() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(false);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const { isConnected } = useNetInfo();
  const router = useRouter();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const offlineGames = [
      { id: 'math_engine', name: 'SIMU Math', url: 'NATIVE_ENGINE:simu-math', size_mb: 0.2, category: 'education' },
      { id: 'simu_runner', name: 'SIMU Runner', url: 'NATIVE_ENGINE:simu-runner-online', size_mb: 0.1, category: 'action' },
      { id: 'crypto_puzzle', name: 'Crypto Puzzle', url: 'NATIVE_ENGINE:crypto-puzzle', size_mb: 0.3, category: 'logic' },
      { id: 'simu_chess', name: 'SIMU Chess', url: 'NATIVE_ENGINE:simu-chess', size_mb: 0.5, category: 'board' },
      { id: 'token_dash', name: 'Token Dash', url: 'NATIVE_ENGINE:token-dash', size_mb: 0.2, category: 'action' },
    ];

    try {
      const { data, error } = await supabase.from('games_registry').select('*');
      if (error) throw error;
      
      // Filter out remote placeholders so they don't duplicate/override our native engine modules
      const remoteGames = (data || []).filter(remote => {
        const isDuplicate = offlineGames.some(o => o.name === remote.name);
        const isPlaceholder = remote.url.includes('games.simu.network');
        return !isDuplicate && !isPlaceholder;
      });

      setGames([...offlineGames, ...remoteGames]);
    } catch (err) {
      setGames(offlineGames);
      setErrorState(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = (url: string) => {
    // Failsafe intercept for old placeholder URLs
    if (url.includes('games.simu.network/runner')) url = 'NATIVE_ENGINE:simu-runner-online';
    if (url.includes('games.simu.network/puzzle')) url = 'NATIVE_ENGINE:crypto-puzzle';
    if (url.includes('games.simu.network/chess')) url = 'NATIVE_ENGINE:simu-chess';

    if (url.startsWith('NATIVE_ENGINE:')) {
      const gameId = url.split(':')[1];
      router.push(`/games/GamePlayer?id=${gameId}`);
    } else {
      setActiveUrl(url);
    }
  };

  if (activeUrl) {
    return <SecureWebView url={activeUrl} onClose={() => setActiveUrl(null)} />;
  }

  return (
    <View style={styles.container}>
      {isConnected === false && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Offline Mode</Text>
        </View>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#00FFA3" style={{ marginTop: 50 }} />
      ) : errorState ? (
        <View style={styles.center}>
          <Text style={styles.comingSoon}>Coming Soon</Text>
        </View>
      ) : (
        <FlatList
          data={games}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <GameCard game={item} onLaunch={() => handleLaunch(item.url)} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  grid: { padding: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  comingSoon: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  offlineBanner: { backgroundColor: '#FF4444', padding: 8, alignItems: 'center' },
  offlineText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
});
