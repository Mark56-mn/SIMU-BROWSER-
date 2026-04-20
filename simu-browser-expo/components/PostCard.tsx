import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StarsButton } from './StarsButton';

export function PostCard({ post, onUpvote }: { post: any; onUpvote: () => void }) {
  const authorName = post.author || post.profiles?.username || 'Anonymous';
  const totalStars = post.profiles?.total_stars_received || 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{post.title}</Text>
      
      <View style={styles.metaRow}>
        <Text style={styles.author}>by {authorName}</Text>
        {totalStars > 0 && <Text style={styles.starsReceived}>⭐ {totalStars} received</Text>}
      </View>

      <View style={styles.footer}>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.upvoteBtn} onPress={onUpvote}>
            <Text style={styles.upvoteText}>▲ {post.upvotes}</Text>
          </TouchableOpacity>
          {post.author_id && (
             <StarsButton 
               receiverId={post.author_id} 
               referenceId={post.id} 
               type="appreciation" 
               amount={10} 
               label="⭐ 10" 
             />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1A1A1A', padding: 16, borderRadius: 12, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#00FFA3' },
  title: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  author: { color: '#888', fontSize: 12 },
  starsReceived: { color: '#FFD700', fontSize: 10, fontWeight: 'bold', backgroundColor: '#FFD70020', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  upvoteBtn: { backgroundColor: '#333', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  upvoteText: { color: '#00FFA3', fontWeight: 'bold' },
});
