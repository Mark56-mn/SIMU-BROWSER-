import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNetInfo } from '@react-native-community/netinfo';
import { supabase } from '../lib/supabase';
import { SecureWebView } from '../components/SecureWebView';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - 32 - CARD_MARGIN * 2) / 2;

const NATIVE_GAMES = [
  { id: 'warrior_fight', name: 'African Warrior', url: 'NATIVE_ENGINE:warrior-fight', size: '200KB', category: 'Action', icon: 'shield-outline', color: '#FFD700' },
  { id: 'simu_runner', name: 'SIMU Runner', url: 'NATIVE_ENGINE:simu-runner-online', size: '100KB', category: 'Action', icon: 'walk-outline', color: '#00FFA3' },
  { id: 'math_engine', name: 'SIMU Math', url: 'NATIVE_ENGINE:simu-math', size: '200KB', category: 'Education', icon: 'calculator-outline', color: '#FF4444' },
  { id: 'crypto_puzzle', name: 'Crypto Puzzle', url: 'NATIVE_ENGINE:crypto-puzzle', size: '300KB', category: 'Logic', icon: 'extension-puzzle-outline', color: '#9D4EDD' },
  { id: 'simu_chess', name: 'SIMU Chess', url: 'NATIVE_ENGINE:simu-chess', size: '500KB', category: 'Board', icon: 'grid-outline', color: '#FFA07A' },
  { id: 'token_dash', name: 'Token Dash', url: 'NATIVE_ENGINE:token-dash', size: '200KB', category: 'Arcade', icon: 'flash-outline', color: '#00E5FF' }
];

export default function GamesScreen() {
  const router = useRouter();
  const { isConnected } = useNetInfo();
  
  const [games, setGames] = useState([...NATIVE_GAMES]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeWebViewUrl, setActiveWebViewUrl] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('games_registry').select('*');
      if (!error && data) {
         const remoteGames = data.filter(remote => {
            if (remote.url.includes('games.simu.network')) return false;
            // Filter native games from backend to prevent dupes
            if (NATIVE_GAMES.some(n => n.name.toLowerCase() === remote.name.toLowerCase())) return false;
            if (NATIVE_GAMES.some(n => remote.name.toLowerCase().includes(n.name.toLowerCase().split(' ')[1]))) return false;
            return true;
         }).map(g => ({
            id: g.id,
            name: g.name,
            url: g.url,
            size: `${g.size_mb || 0}MB`,
            category: g.category || 'Web',
            icon: 'globe-outline',
            color: '#888'
         }));
         setGames([...NATIVE_GAMES, ...remoteGames]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGames();
  };

  const handleLaunch = (game: any) => {
    if (game.url.startsWith('NATIVE_ENGINE:')) {
      const gameId = game.url.split(':')[1];
      router.push(`/games/GamePlayer?id=${gameId}`);
      return;
    }
    setActiveWebViewUrl(game.url);
  };

  if (activeWebViewUrl) {
    return <SecureWebView url={activeWebViewUrl} onClose={() => setActiveWebViewUrl(null)} />;
  }

  const renderGameCard = ({ item }: { item: any }) => {
    const isNative = item.url.startsWith('NATIVE_ENGINE:');
    
    return (
      <TouchableOpacity style={styles.card} onPress={() => handleLaunch(item)} activeOpacity={0.8}>
        <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon as any} size={32} color={item.color} />
        </View>
        
        {isNative && (
          <View style={styles.badge}>
            <Ionicons name="flash" size={10} color="#000" />
            <Text style={styles.badgeText}>INSTANT</Text>
          </View>
        )}

        <View style={styles.cardContent}>
          <Text style={styles.gameTitle} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.gameMeta} numberOfLines={1}>{item.category} • {item.size}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Arcade</Text>
        {isConnected === false && (
          <View style={styles.offlinePill}>
            <Ionicons name="cloud-offline" size={14} color="#FFD700" />
            <Text style={styles.offlineText}>Offline Mode</Text>
          </View>
        )}
      </View>

      {loading && !refreshing && games.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00FFA3" />
        </View>
      ) : (
        <FlatList
          data={games}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00FFA3" />}
          renderItem={renderGameCard}
          ListHeaderComponent={
            <View style={styles.listHeaderContainer}>
                <Text style={styles.sectionTitle}>Built-in Games</Text>
                <Text style={styles.sectionSub}>Play instantly, no downloads needed.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { color: '#FFF', fontSize: 28, fontWeight: '900', letterSpacing: 0.5 },
  offlinePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  offlineText: { color: '#FFD700', fontSize: 12, fontWeight: 'bold' },
  list: { padding: 16 - CARD_MARGIN, paddingBottom: 40 },
  listHeaderContainer: { marginBottom: 16, paddingHorizontal: CARD_MARGIN },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  sectionSub: { color: '#888', fontSize: 14, marginTop: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { 
    width: CARD_WIDTH, 
    margin: CARD_MARGIN, 
    backgroundColor: '#111', 
    borderRadius: 20, 
    padding: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  iconBox: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  badge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#00FFA3', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 2 },
  badgeText: { color: '#000', fontSize: 9, fontWeight: '900' },
  cardContent: { flex: 1 },
  gameTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  gameMeta: { color: '#888', fontSize: 12, fontWeight: '500' }
});
