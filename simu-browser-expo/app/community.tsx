import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { PostCard } from '../components/PostCard';
import { GroupCard } from '../components/GroupCard';
import { ExchangeModal } from '../components/ExchangeModal';
import { StarsBalanceBadge } from '../components/StarsBalanceBadge';
import { EditPostModal } from '../components/EditPostModal';
import { AuthorProfileModal } from '../components/AuthorProfileModal';
import { useNetInfo } from '@react-native-community/netinfo';
import { getStarsBalance, sendStars, deletePost } from '../lib/stars';
import { useRouter } from 'expo-router';

export default function CommunityScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [tab, setTab] = useState<'feed' | 'groups'>('feed');
  const [starsBalance, setStarsBalance] = useState(0);
  const [exchangeVisible, setExchangeVisible] = useState(false);
  
  // New States for Modals and Data tracking
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  
  const [authorModalVisible, setAuthorModalVisible] = useState(false);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);

  const { isConnected } = useNetInfo();
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id || null);

      const stats = await getStarsBalance();
      setStarsBalance(stats.balance);

      const { data, error } = await supabase
        .from('community_posts')
        .select('*, profiles(username, total_stars_received)')
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      setPosts(data || []);

      const { data: gData } = await supabase
        .from('groups')
        .select('*')
        .order('members', { ascending: false })
        .limit(20);
      
      setGroups(gData || []);
      setErrorState(false);
    } catch (err) {
      console.log('Error Loading Community Data:', err);
      // Don't show total failure if just the table doesn't exist yet, gracefully use empty lists
      setErrorState(true);
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpvote = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  const handleDeletePost = async (id: string) => {
    // Optimistic UI update
    setPosts(posts.filter(p => p.id !== id));
    const res = await deletePost(id);
    if (!res.success) {
      alert(res.error);
      loadData(); // Revert on failure
    }
  };

  const openEditModal = (post: any) => {
    setEditingPost(post);
    setEditModalVisible(true);
  };

  const openAuthorModal = (authorId: string | undefined) => {
    if (authorId) {
      setSelectedAuthorId(authorId);
      setAuthorModalVisible(true);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("Please check your settings and ensure you have an active Browser Account or Wallet connected.");
      return;
    }
    
    const { error } = await supabase.from('group_members').insert({ group_id: groupId, user_id: session.user.id });
    if (!error) {
      alert("Joined successfully!");
      router.push(`/group/${groupId}`);
    } else {
      alert("Could not join group or you are already a member.");
      // Navigate anyway so they can see the chat
      router.push(`/group/${groupId}`);
    }
  };

  // Fallback if no real groups are populated yet during dev
  const displayGroups = groups.length > 0 ? groups : [
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
          <Text style={styles.starsTitle}>My Balance</Text>
          <StarsBalanceBadge balance={starsBalance} />
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.getStarsBtn} onPress={() => setExchangeVisible(true)}>
            <Text style={styles.getStarsText}>Get Stars</Text>
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
            renderItem={({ item }) => (
              <PostCard 
                post={item} 
                onUpvote={() => handleUpvote(item.id)} 
                currentUserId={currentUserId}
                onEdit={() => openEditModal(item)}
                onDelete={() => handleDeletePost(item.id)}
                onAuthorPress={() => openAuthorModal(item.author_id)}
              />
            )}
          />
        )
      ) : (
        <FlatList
          data={displayGroups}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <GroupCard 
              group={item} 
              onJoin={() => handleJoinGroup(item.id)}
              onPress={() => router.push(`/group/${item.id}`)}
            />
          )}
        />
      )}

      <ExchangeModal 
        visible={exchangeVisible} 
        onClose={() => setExchangeVisible(false)} 
        onRefresh={loadData} 
      />

      <EditPostModal 
        visible={editModalVisible} 
        post={editingPost} 
        onClose={() => setEditModalVisible(false)} 
        onRefresh={loadData} 
      />

      <AuthorProfileModal 
        visible={authorModalVisible} 
        authorId={selectedAuthorId} 
        onClose={() => setAuthorModalVisible(false)} 
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
