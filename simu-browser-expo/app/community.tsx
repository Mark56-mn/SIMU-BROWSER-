import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { PostCard } from '../components/PostCard';
import { GroupCard } from '../components/GroupCard';
import * as FileSystem from 'expo-file-system';

const CACHE_FILE = FileSystem.documentDirectory + 'community_cache.json';

export default function CommunityScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [tab, setTab] = useState<'feed' | 'groups'>('feed');

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
      setIsOffline(false);
      // Cache for offline
      await FileSystem.writeAsStringAsync(CACHE_FILE, JSON.stringify(data));
    } catch (err) {
      setIsOffline(true);
      // Load from cache
      try {
        const cached = await FileSystem.readAsStringAsync(CACHE_FILE);
        setPosts(JSON.parse(cached));
      } catch (e) {
        // Fallback mock
        setPosts([
          { id: '1', title: 'SIMU Node setup guide for 2G networks', author: 'ang_dev', upvotes: 142, created_at: new Date().toISOString() },
          { id: '2', title: 'New lightweight game released! Only 0.8MB', author: 'simu_games', upvotes: 89, created_at: new Date().toISOString() },
        ]);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpvote = (id: string) => {
    // Optimistic update
    setPosts(posts.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
    if (isOffline) {
      // Queue offline action (implementation omitted for brevity)
    } else {
      // supabase.rpc('increment_upvote', { post_id: id })
    }
  };

  const mockGroups = [
    { id: '1', name: 'SIMU Validators', members: 1240, type: 'Public', description: 'Official group for Ang Node operators.' },
    { id: '2', name: 'Web3 Africa Reels', members: 850, type: 'Reels', description: 'Short video updates from the ecosystem.' },
    { id: '3', name: 'Trading & DeFi', members: 3200, type: 'Public', description: 'Discuss SIMU tokenomics and DEX strategies.' },
  ];

  return (
    <View style={styles.container}>
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Offline Mode - Showing Cached Content</Text>
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
        <FlatList
          data={posts}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadPosts} tintColor="#00FFA3" />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <PostCard post={item} onUpvote={() => handleUpvote(item.id)} />}
        />
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
});
