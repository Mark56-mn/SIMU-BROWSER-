import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  balance: number;
}

export function StarsBalanceBadge({ balance }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⭐</Text>
      <Text style={styles.balance}>{balance.toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD70015',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD70040',
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  balance: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
