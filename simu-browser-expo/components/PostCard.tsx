import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function PostCard({ post, onUpvote }: { post: any; onUpvote: () => void }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{post.title}</Text>
      <View style={styles.footer}>
        <Text style={styles.author}>by {post.author || post.profiles?.username || 'Anonymous'}</Text>
        <TouchableOpacity style={styles.upvoteBtn} onPress={onUpvote}>
          <Text style={styles.upvoteText}>▲ {post.upvotes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1A1A1A', padding: 16, borderRadius: 12, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#00FFA3' },
  title: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { color: '#888', fontSize: 12 },
  upvoteBtn: { backgroundColor: '#333', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  upvoteText: { color: '#00FFA3', fontWeight: 'bold' },
});
