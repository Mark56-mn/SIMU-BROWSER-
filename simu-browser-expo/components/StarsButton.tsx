import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { sendStars } from '../lib/stars';

interface Props {
  receiverId: string | null;
  referenceId?: string;
  type?: 'appreciation' | 'donation';
  amount?: number;
  label?: string;
}

export function StarsButton({ receiverId, referenceId, type = 'appreciation', amount = 10, label = '⭐ Appreciate' }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    const res = await sendStars(receiverId, amount, type, referenceId);
    setLoading(false);
    
    if (res?.success) {
      Alert.alert('Success', `Sent ${amount} Stars successfully! 🌟`);
    } else {
      Alert.alert('Failed', res?.error || 'Could not send stars. Please check your balance or internet connection.');
    }
  };

  return (
    <TouchableOpacity style={styles.btn} onPress={handleSend} disabled={loading}>
      {loading ? (
        <ActivityIndicator size="small" color="#FFD700" />
      ) : (
        <Text style={styles.text}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { 
    backgroundColor: '#FFD70015', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16, 
    borderColor: '#FFD70040', 
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { 
    color: '#FFD700', 
    fontWeight: 'bold', 
    fontSize: 12 
  },
});
