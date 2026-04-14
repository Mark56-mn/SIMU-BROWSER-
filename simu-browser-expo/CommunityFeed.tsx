import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { OfflineCache } from './OfflineCache';

interface Post {
  id: string;
  title: string;
  author: string;
  upvotes: number;
}

export function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const cached = await OfflineCache.getItem('community_posts');
    if (cached) {
      setPosts(cached);
    } else {
      // Stub fetch from Supabase
      const mockPosts = [
        { id: '1', title: 'SIMU Node setup guide for 2G', author: 'ang_dev', upvotes: 142 },
        { id: '2', title: 'New lightweight game released!', author: 'simu_games', upvotes: 89 },
      ];
      setPosts(mockPosts);
      OfflineCache.saveItem('community_posts', mockPosts);
    }
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.meta}>
        <Text style={styles.author}>by {item.author}</Text>
        <TouchableOpacity style={styles.upvoteBtn}>
          <Text style={styles.upvoteText}>▲ {item.upvotes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  postCard: { backgroundColor: '#1E1E1E', padding: 16, borderRadius: 8, marginBottom: 12 },
  title: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { color: '#888', fontSize: 12 },
  upvoteBtn: { backgroundColor: '#333', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  upvoteText: { color: '#00FFA3', fontWeight: 'bold' }
});
