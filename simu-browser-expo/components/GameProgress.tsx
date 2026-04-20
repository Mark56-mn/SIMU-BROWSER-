import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  current: number;
  total: number;
}

export function GameProgress({ current, total }: Props) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Level Progress</Text>
        <Text style={styles.text}>{current} / {total}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  text: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
  },
  track: {
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#00FFA3',
  }
});
