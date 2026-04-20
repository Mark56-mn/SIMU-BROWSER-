import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { updatePost } from '../lib/stars';

export function EditPostModal({ visible, post, onClose, onRefresh }: { visible: boolean, post: any, onClose: () => void, onRefresh: () => void }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setBody(post.body || '');
    }
  }, [post]);

  const handleSave = async () => {
    if (!title.trim()) return Alert.alert('Error', 'Title cannot be empty');
    setLoading(true);
    const res = await updatePost(post.id, title, body);
    setLoading(false);
    
    if (res.success) {
      Alert.alert('Success', 'Post updated successfully.');
      onRefresh();
      onClose();
    } else {
      Alert.alert('Error', res.error || 'Failed to update post.');
    }
  };

  if (!visible || !post) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.header}>Edit Post</Text>
          
          <Text style={styles.label}>Title</Text>
          <TextInput 
            style={styles.input} 
            value={title}
            onChangeText={setTitle}
            placeholder="Post Title"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Body (Optional)</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={body}
            onChangeText={setBody}
            placeholder="What's on your mind?"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={loading}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
              {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.saveText}>Save Changes</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#1A1A1A', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#333' },
  header: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  label: { color: '#888', fontSize: 12, marginBottom: 8, fontWeight: 'bold' },
  input: { backgroundColor: '#000', color: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#333', marginBottom: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, padding: 14, alignItems: 'center', backgroundColor: '#333', borderRadius: 8 },
  cancelText: { color: '#FFF', fontWeight: 'bold' },
  saveBtn: { flex: 1, padding: 14, alignItems: 'center', backgroundColor: '#00FFA3', borderRadius: 8 },
  saveText: { color: '#000', fontWeight: 'bold' },
});
