import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';

export function CommunityFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(true); // Mock network state

  useEffect(() => { loadCachedPosts(); }, []);

  const loadCachedPosts = async () => {
    // SQLite fetch mock (last 50 posts)
    setPosts([{ id: '1', title: 'SIMU Node setup guide', author: 'ang_dev', upvotes: 142 }]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (!isOffline) { /* Fetch Supabase & Update SQLite */ }
    setRefreshing(false);
  };

  const handleVote = (id: string, dir: number) => {
    if (isOffline) {
      // Insert into SQLite offline_queue table
      console.log('Queued offline vote:', id, dir);
    }
  };

  return (
    <View style={styles.container}>
      {isOffline && <View style={styles.badge}><Text style={styles.badgeTxt}>Offline Mode - Changes Queued</Text></View>}
      <FlatList
        data={posts}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00FFA3" />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.row}>
              <Text style={styles.author}>by {item.author}</Text>
              <TouchableOpacity onPress={() => handleVote(item.id, 1)}>
                <Text style={styles.vote}>▲ {item.upvotes}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  badge: { backgroundColor: '#FF4444', padding: 4, alignItems: 'center' },
  badgeTxt: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  card: { backgroundColor: '#1E1E1E', padding: 16, margin: 8, borderRadius: 8 },
  title: { color: '#FFF', fontSize: 16, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  author: { color: '#888' },
  vote: { color: '#00FFA3', fontWeight: 'bold' }
});
