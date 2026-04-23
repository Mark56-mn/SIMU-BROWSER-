import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNetInfo } from '@react-native-community/netinfo';
import { GameEngine } from '../../lib/gameEngine';
import { GameProgress } from '../../components/GameProgress';
import { CommunityPuzzle } from '../../components/CommunityPuzzle';
import { MarketDataScanner } from '../../components/MarketDataScanner';
import { MultiplayerRace } from '../../components/MultiplayerRace';
import { WarriorFight } from '../../components/WarriorFight';

export default function GamePlayer() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isConnected } = useNetInfo();
  
  const [engine, setEngine] = useState<GameEngine | null>(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState<any>(null);
  const [input, setInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    const initGame = async () => {
      const e = new GameEngine(id as string);
      await e.initialize();
      setEngine(e);
      setLevel(e.getCurrentLevel());
      setLoading(false);
    };
    initGame();
  }, [id]);

  const handleSubmit = async () => {
    if (!engine || !level) return;

    if (!engine.checkAnswer(input)) {
      setErrorMsg('Incorrect answer. Try again.');
      return;
    }

    setErrorMsg('');
    const res = await engine.completeLevel(!!isConnected);
    
    if (res.isComplete) {
      Alert.alert('Game Complete!', 'You have completed all levels in this module.', [
        { text: 'Awesome', onPress: () => router.back() }
      ]);
    } else {
      if (res.rewarded) {
         Alert.alert('Level Complete!', `You earned ${res.amount} Stars!`);
      } else {
         Alert.alert('Level Complete!', 'Progress saved offline. Rewards will sync when online.');
      }
      
      setInput('');
      setLevel(engine.getCurrentLevel());
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#00FFA3" /></View>;
  }

  if (!engine?.module) {
    return <View style={styles.center}><Text style={styles.errorText}>Game Module not found.</Text></View>;
  }

  // Check offline blocking
  const isBlockedOffline = !isConnected && level && !level.offline;

  const handleCustomComplete = async () => {
    if (!engine || !level) return;
    const res = await engine.completeLevel(!!isConnected);
    
    if (res.isComplete) {
      Alert.alert('Game Complete!', 'You have completed all levels in this module.', [
        { text: 'Awesome', onPress: () => router.back() }
      ]);
    } else {
      if (res.rewarded) {
         Alert.alert('Challenge Complete!', `You earned ${res.amount} Stars!`);
      } else {
         Alert.alert('Challenge Complete!', 'Rewards synced to network.');
      }
      setLevel(engine.getCurrentLevel());
    }
  };

  const renderGameContent = () => {
    if (level.data.component === 'WarriorFight') {
      return <WarriorFight isConnected={isConnected} onComplete={handleCustomComplete} levelData={level.data} />;
    }
    if (level.data.component === 'CommunityPuzzle') {
      return <CommunityPuzzle isConnected={isConnected} onComplete={handleCustomComplete} />;
    }
    if (level.data.component === 'MarketDataScanner') {
      return <MarketDataScanner isConnected={isConnected} onComplete={handleCustomComplete} />;
    }
    if (level.data.component === 'MultiplayerRace') {
      return <MultiplayerRace isConnected={isConnected} onComplete={handleCustomComplete} />;
    }

    return (
      <>
        <Text style={styles.levelTitle}>Level {engine.currentLevelIndex + 1}</Text>
        <Text style={styles.questionText}>{level.data.question}</Text>
        
        <TextInput 
          style={styles.input}
          placeholder="Your answer"
          placeholderTextColor="#666"
          value={input}
          onChangeText={(val) => { setInput(val); setErrorMsg(''); }}
          onSubmitEditing={handleSubmit}
          autoCapitalize="none"
        />
        
        {!!errorMsg && <Text style={styles.errorFeedback}>{errorMsg}</Text>}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Answer</Text>
        </TouchableOpacity>

        <Text style={styles.rewardHint}>Reward: {level.data.rewardAmount} SIMU Stars</Text>
      </>
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{engine.module.name}</Text>
        {!isConnected && <View style={styles.offlineBadge}><Text style={styles.offlineText}>OFFLINE</Text></View>}
      </View>

      <View style={styles.content}>
        <GameProgress current={engine.currentLevelIndex} total={engine.getTotalLevels()} />
        
        {level ? (
          <View style={styles.card}>
            {isBlockedOffline ? (
              <View style={styles.blockedState}>
                <Ionicons name="cloud-offline" size={64} color="#888" />
                <Text style={styles.blockedText}>This level requires an internet connection.</Text>
                <Text style={styles.blockedSub}>Please reconnect to continue playing and earning rewards.</Text>
              </View>
            ) : (
              renderGameContent()
            )}
          </View>
        ) : (
          <View style={styles.blockedState}>
            <Text style={styles.blockedText}>Congratulations!</Text>
            <Text style={styles.blockedSub}>You have completed this game module.</Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' },
  errorText: { color: '#FF4444', fontSize: 16 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#111', borderBottomWidth: 1, borderBottomColor: '#222' },
  backBtn: { marginRight: 16 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', flex: 1 },
  offlineBadge: { backgroundColor: '#FFD700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  offlineText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  content: { flex: 1, padding: 20 },
  card: { backgroundColor: '#1A1A1A', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#333', marginTop: 20 },
  levelTitle: { color: '#00FFA3', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  questionText: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 32, lineHeight: 30 },
  input: { backgroundColor: '#000', color: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#444', fontSize: 18, marginBottom: 16 },
  errorFeedback: { color: '#FF4444', marginBottom: 16, fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#00FFA3', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  submitText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  rewardHint: { color: '#FFD700', textAlign: 'center', fontSize: 12, fontWeight: 'bold' },
  blockedState: { alignItems: 'center', paddingVertical: 40 },
  blockedText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 16, textAlign: 'center' },
  blockedSub: { color: '#888', fontSize: 14, marginTop: 8, textAlign: 'center', lineHeight: 22 }
});
