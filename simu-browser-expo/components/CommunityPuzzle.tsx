import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

interface Props {
  onComplete: () => void;
  isConnected: boolean | null;
}

export function CommunityPuzzle({ onComplete, isConnected }: Props) {
  const [loading, setLoading] = useState(true);
  const [puzzle, setPuzzle] = useState('');
  const [solution, setSolution] = useState('');
  const [input, setInput] = useState('');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (!isConnected) return;
    
    // Simulate fetching daily community puzzle from API
    setTimeout(() => {
      setPuzzle('2 + 5 * 3 - (8 / 4)');
      setSolution('15');
      setLoading(false);
    }, 1000);
  }, [isConnected]);

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Community Puzzle requires an internet connection.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00FFA3" />
        <Text style={styles.text}>Fetching latest community puzzle...</Text>
      </View>
    );
  }

  const handleSubmit = () => {
    if (input.trim() === solution) {
      onComplete();
    } else {
      setErrorText('Incorrect! The community frowns upon this answer.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LIVE: Community Puzzle</Text>
      <Text style={styles.subtitle}>Solve this to unlock the path. Rewards: 10 Stars + 5 SIMU</Text>
      
      <View style={styles.card}>
         <Text style={styles.puzzleText}>{puzzle}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter your solution..."
        placeholderTextColor="#666"
        value={input}
        onChangeText={setInput}
        autoCapitalize="none"
      />

      {!!errorText && <Text style={styles.error}>{errorText}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit to Network</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center', width: '100%' },
  title: { fontSize: 22, color: '#00FFA3', fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#AAA', marginBottom: 24, textAlign: 'center' },
  text: { color: '#FFF', marginTop: 12 },
  card: { backgroundColor: '#111', padding: 32, borderRadius: 16, borderWidth: 1, borderColor: '#333', marginBottom: 24, width: '100%', alignItems: 'center' },
  puzzleText: { fontSize: 28, color: '#FFF', fontWeight: 'bold' },
  input: { backgroundColor: '#000', color: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#444', fontSize: 18, marginBottom: 16, width: '100%' },
  button: { backgroundColor: '#00FFA3', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, alignItems: 'center', width: '100%' },
  buttonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  error: { color: '#FF4444', marginBottom: 16, fontWeight: 'bold' }
});
