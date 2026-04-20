import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export function AuthorProfileModal({ visible, authorId, onClose }: { visible: boolean, authorId: string | null, onClose: () => void }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && authorId) {
      setLoading(true);
      setProfile(null);
      supabase.from('profiles').select('username, total_stars_received').eq('id', authorId).single()
        .then(({ data }) => {
          setProfile(data);
          setLoading(false);
        });
    }
  }, [visible, authorId]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {loading ? (
             <ActivityIndicator size="large" color="#00FFA3" style={{ margin: 20 }} />
          ) : profile ? (
             <>
               <View style={styles.avatar}>
                 <Text style={styles.avatarLetter}>{profile.username?.[0]?.toUpperCase() || 'U'}</Text>
               </View>
               <Text style={styles.username}>@{profile.username || 'Anonymous'}</Text>
               <View style={styles.starsBadge}>
                 <Text style={styles.starsText}>⭐ {profile.total_stars_received || 0} Total Stars Received</Text>
               </View>
             </>
          ) : (
             <Text style={styles.error}>User not found.</Text>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 40 },
  card: { backgroundColor: '#1A1A1A', padding: 24, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#00FFA320', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarLetter: { fontSize: 36, fontWeight: 'bold', color: '#00FFA3' },
  username: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  starsBadge: { backgroundColor: '#FFD70015', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#FFD70040', marginBottom: 24 },
  starsText: { color: '#FFD700', fontWeight: 'bold' },
  closeBtn: { backgroundColor: '#333', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 12 },
  closeText: { color: '#FFF', fontWeight: 'bold' },
  error: { color: '#FF4444', marginBottom: 20 }
});
