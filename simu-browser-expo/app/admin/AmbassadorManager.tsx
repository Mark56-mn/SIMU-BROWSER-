import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { AmbassadorType } from '../../lib/ambassadors';
import { Ionicons } from '@expo/vector-icons';

export default function AmbassadorManager() {
  const [userId, setUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<AmbassadorType>('community');
  const [loading, setLoading] = useState(false);

  const roles: { label: string; value: AmbassadorType; icon: any }[] = [
    { label: 'Game Dev', value: 'game_dev', icon: 'game-controller' },
    { label: 'Support', value: 'support', icon: 'help-buoy' },
    { label: 'Announcements', value: 'announcements', icon: 'megaphone' },
    { label: 'Community', value: 'community', icon: 'people' },
  ];

  const handlePromote = async () => {
    if (!userId.trim()) return Alert.alert('Error', 'Please enter a User ID');
    
    setLoading(true);
    try {
      // NOTE: This calls the RPC we added in the migration.
      // If the caller is not an admin, this will fail at the RLS/Security Definer level.
      const { error } = await supabase.rpc('admin_promote_ambassador', {
        target_user_id: userId.trim(),
        role_type: selectedRole
      });

      if (error) throw error;
      Alert.alert('Success', `User promoted to ${selectedRole} Ambassador`);
      setUserId('');
    } catch (error: any) {
      Alert.alert('Promotion Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Ambassadors</Text>
      <Text style={styles.subtitle}>Promote users to official ecosystem roles.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Target User UUID</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 123e4567-e89b-12d3..."
          placeholderTextColor="#666"
          value={userId}
          onChangeText={setUserId}
        />

        <Text style={styles.label}>Select Role</Text>
        <View style={styles.roleGrid}>
          {roles.map(role => (
            <TouchableOpacity 
              key={role.value}
              style={[styles.roleCard, selectedRole === role.value && styles.roleCardActive]}
              onPress={() => setSelectedRole(role.value)}
            >
              <Ionicons name={role.icon} size={24} color={selectedRole === role.value ? '#000' : '#00FFA3'} />
              <Text style={[styles.roleText, selectedRole === role.value && styles.roleTextActive]}>
                {role.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.btn, loading && styles.btnDisabled]} 
          onPress={handlePromote}
          disabled={loading}
        >
          <Text style={styles.btnText}>{loading ? 'Applying...' : 'Promote User'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', padding: 16 },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { color: '#888', marginBottom: 24 },
  card: { backgroundColor: '#1A1A1A', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#333' },
  label: { color: '#FFF', fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: '#0A0A0A', color: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#333', marginBottom: 20 },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  roleCard: { flex: 1, minWidth: '45%', backgroundColor: '#0A0A0A', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#333', alignItems: 'center', gap: 8 },
  roleCardActive: { backgroundColor: '#00FFA3', borderColor: '#00FFA3' },
  roleText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  roleTextActive: { color: '#000' },
  btn: { backgroundColor: '#00FFA3', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});
