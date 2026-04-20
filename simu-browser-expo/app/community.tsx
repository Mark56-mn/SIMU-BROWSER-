import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { PostCard } from '../components/PostCard';
import { GroupCard } from '../components/GroupCard';
import { ExchangeModal } from '../components/ExchangeModal';
import { useNetInfo } from '@react-native-community/netinfo';
import { getStarsBalance, sendStars } from '../lib/stars';

export default function CommunityScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [tab, setTab] = useState<'feed' | 'groups'>('feed');
  const [starsBalance, setStarsBalance] = useState(0);
  const [exchangeVisible, setExchangeVisible] = useState(false);
  const { isConnected } = useNetInfo();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const balance = await getStarsBalance();
      setStarsBalance(balance);

      const { data, error } = await supabase
        .from('community_posts')
        .select('*, profiles(username, total_stars_received)')
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      setPosts(data || []);
      setErrorState(false);
    } catch (err) {
      setErrorState(true);
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpvote = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  const handleDonateEcosystem = async () => {
    await sendStars('ecosystem_treasury', 50, 'donation');
    loadData();
  };

  const mockGroups = [
    { id: '1', name: 'SIMU Validators', members: 1240, type: 'Public', description: 'Official group for Ang Node operators.', owner_id: 'mock_owner' },
    { id: '2', name: 'Web3 Africa Reels', members: 850, type: 'Reels', description: 'Short video updates from the ecosystem.', owner_id: 'mock_owner' },
  ];

  return (
    <View style={styles.container}>
      {isConnected === false && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Offline Mode</Text>
        </View>
      )}

      {/* Stars Header */}
      <View style={styles.starsHeader}>
        <View>
          <Text style={styles.starsTitle}>My Stars Balance</Text>
          <Text style={styles.starsBalance}>⭐ {starsBalance.toLocaleString()}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.getStarsBtn} onPress={() => setExchangeVisible(true)}>
            <Text style={styles.getStarsText}>Get Stars</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.donateBtn} onPress={handleDonateEcosystem}>
            <Text style={styles.donateText}>Donate</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.tabHeader}>
        <TouchableOpacity style={[styles.tabBtn, tab === 'feed' && styles.activeTab]} onPress={() => setTab('feed')}>
          <Text style={[styles.tabText, tab === 'feed' && styles.activeTabText]}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, tab === 'groups' && styles.activeTab]} onPress={() => setTab('groups')}>
          <Text style={[styles.tabText, tab === 'groups' && styles.activeTabText]}>Groups & Reels</Text>
        </TouchableOpacity>
      </View>

      {tab === 'feed' ? (
        errorState ? (
          <View style={styles.center}><Text style={styles.comingSoon}>Coming Soon</Text></View>
        ) : (
          <FlatList
            data={posts}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} tintColor="#00FFA3" />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => <PostCard post={item} onUpvote={() => handleUpvote(item.id)} />}
          />
        )
      ) : (
        <FlatList
          data={mockGroups}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <GroupCard group={item} />}
        />
      )}

      <ExchangeModal 
        visible={exchangeVisible} 
        onClose={() => setExchangeVisible(false)} 
        onRefresh={loadData} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  offlineBanner: { backgroundColor: '#FF4444', padding: 8, alignItems: 'center' },
  offlineText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  starsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#111', borderBottomWidth: 1, borderBottomColor: '#222' },
  starsTitle: { color: '#888', fontSize: 12, fontWeight: 'bold' },
  starsBalance: { color: '#FFD700', fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  headerActions: { flexDirection: 'row', gap: 8 },
  getStarsBtn: { backgroundColor: '#FFD700', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  getStarsText: { color: '#000', fontWeight: 'bold', fontSize: 12 },
  donateBtn: { backgroundColor: '#333', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  donateText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  tabHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#222' },
  tabBtn: { flex: 1, padding: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#00FFA3' },
  tabText: { color: '#888', fontWeight: 'bold' },
  activeTabText: { color: '#00FFA3' },
  list: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  comingSoon: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
