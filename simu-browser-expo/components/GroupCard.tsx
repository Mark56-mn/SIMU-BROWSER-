import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function GroupCard({ group }: { group: any }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{group.name}</Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{group.type}</Text>
        </View>
      </View>
      <Text style={styles.description}>{group.description}</Text>
      <View style={styles.footer}>
        <Text style={styles.members}>{group.members.toLocaleString()} members</Text>
        <TouchableOpacity style={styles.joinBtn}>
          <Text style={styles.joinText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1A1A1A', padding: 16, borderRadius: 12, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  name: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  typeBadge: { backgroundColor: '#333', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  typeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  description: { color: '#AAA', fontSize: 14, marginBottom: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  members: { color: '#888', fontSize: 12 },
  joinBtn: { backgroundColor: '#00FFA3', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  joinText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
});
