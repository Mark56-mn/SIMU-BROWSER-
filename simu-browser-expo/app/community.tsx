import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { PostCard } from '../components/PostCard';
import { GroupCard } from '../components/GroupCard';
import { useNetInfo } from '@react-native-community/netinfo';

export default function CommunityScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [tab, setTab] = useState<'feed' | 'groups'>('feed');
  const { isConnected } = useNetInfo();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*, profiles(username)')
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
    // Local state upvote only (no RPC call)
    setPosts(posts.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  const mockGroups = [
    { id: '1', name: 'SIMU Validators', members: 1240, type: 'Public', description: 'Official group for Ang Node operators.' },
    { id: '2', name: 'Web3 Africa Reels', members: 850, type: 'Reels', description: 'Short video updates from the ecosystem.' },
    { id: '3', name: 'Trading & DeFi', members: 3200, type: 'Public', description: 'Discuss SIMU tokenomics and DEX strategies.' },
  ];

  return (
    <View style={styles.container}>
      {isConnected === false && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Offline Mode</Text>
        </View>
      )}
      
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
          <View style={styles.center}>
            <Text style={styles.comingSoon}>Coming Soon</Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadPosts} tintColor="#00FFA3" />}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  offlineBanner: { backgroundColor: '#FF4444', padding: 8, alignItems: 'center' },
  offlineText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  tabHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#222' },
  tabBtn: { flex: 1, padding: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#00FFA3' },
  tabText: { color: '#888', fontWeight: 'bold' },
  activeTabText: { color: '#00FFA3' },
  list: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  comingSoon: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
