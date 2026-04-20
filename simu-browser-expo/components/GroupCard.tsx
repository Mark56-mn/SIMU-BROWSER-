import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StarsButton } from './StarsButton';

export function GroupCard({ group }: { group: any }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{group.name}</Text>
          <Text style={styles.typeText}>{group.type}</Text>
        </View>
        <TouchableOpacity style={styles.joinBtn}>
          <Text style={styles.joinText}>Join</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.description}>{group.description}</Text>
      
      <View style={styles.footer}>
        <Text style={styles.members}>{group.members.toLocaleString()} members</Text>
        <View style={styles.actions}>
          {group.owner_id && (
             <StarsButton 
               receiverId={group.owner_id} 
               referenceId={group.id} 
               type="appreciation" 
               amount={50} 
               label="⭐ Donate to Group" 
             />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1A1A1A', padding: 16, borderRadius: 12, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  name: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  typeText: { color: '#00FFA3', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 2 },
  description: { color: '#AAA', fontSize: 14, marginBottom: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#333', paddingTop: 12 },
  members: { color: '#888', fontSize: 12 },
  actions: { flexDirection: 'row', gap: 8 },
  joinBtn: { backgroundColor: '#00FFA320', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  joinText: { color: '#00FFA3', fontWeight: 'bold', fontSize: 12 },
});
