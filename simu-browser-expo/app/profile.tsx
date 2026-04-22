import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { getStarsBalance, donateToTreasury } from '../lib/stars';
import { ExchangeModal } from '../components/ExchangeModal';
import { StarsBalanceBadge } from '../components/StarsBalanceBadge';
import { useNetInfo } from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [donating, setDonating] = useState(false);
  const [exchangeVisible, setExchangeVisible] = useState(false);
  const { isConnected } = useNetInfo();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadData(session.user.id);
    });
  }, []);

  const loadData = async (userIdStr?: string) => {
    setRefreshing(true);
    const userId = userIdStr || session?.user?.id;
    if (userId) {
      const stats = await getStarsBalance();
      setBalance(stats.balance);
      setTotalReceived(stats.total_received);

      const { data } = await supabase.from('profiles').select('treasury_builder').eq('id', userId).single();
      if (data) setProfile(data);
    }
    setRefreshing(false);
  };

  const handleDonate = async () => {
    if (!balance || balance < 50) {
      Alert.alert('Not enough Stars', 'You need at least 50 Stars to become a Treasury Builder.');
      return;
    }
    setDonating(true);
    const res = await donateToTreasury(50);
    setDonating(false);
    
    if (res.success) {
      Alert.alert('Thank You!', 'You have successfully donated to the Ecosystem Treasury and earned the Treasury Builder Badge.');
      loadData();
    } else {
      Alert.alert('Donation Failed', res.error || 'Please try again.');
    }
  };

  if (!session) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Please log in via Settings to view your profile and Stars balance.</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData()} tintColor="#FFD700" />}
    >
      {isConnected === false && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Offline Mode</Text>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarLetter}>{session.user.email?.[0]?.toUpperCase() || 'U'}</Text>
        </View>
        <View style={styles.nameRow}>
           <Text style={styles.email}>{session.user.email}</Text>
           {profile?.treasury_builder && <Ionicons name="shield-checkmark" size={20} color="#FFD700" style={{ marginLeft: 8 }} />}
        </View>
        {profile?.treasury_builder && <Text style={styles.treasuryBadgeText}>Treasury Builder</Text>}
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Current Balance</Text>
            <StarsBalanceBadge balance={balance} />
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Received</Text>
            <Text style={styles.statValue}>⭐ {totalReceived.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stars Exchange</Text>
        <Text style={styles.sectionDesc}>Swap SIMU for Stars to appreciate creators, or convert your earned Stars back to SIMU.</Text>
        <TouchableOpacity style={styles.getStarsBtn} onPress={() => setExchangeVisible(true)}>
          <Text style={styles.getStarsText}>Open Exchange</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ecosystem Donation</Text>
        <Text style={styles.sectionDesc}>Support the SIMU ecosystem treasury directly with your Stars and earn a unique badge.</Text>
        <TouchableOpacity style={styles.donateBtn} onPress={handleDonate} disabled={donating}>
          {donating ? <ActivityIndicator color="#000" /> : <Text style={styles.donateText}>Donate 50 Stars to Ecosystem</Text>}
        </TouchableOpacity>
      </View>

      <ExchangeModal 
        visible={exchangeVisible} 
        onClose={() => setExchangeVisible(false)} 
        onRefresh={() => loadData()} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A', padding: 20 },
  emptyText: { color: '#888', textAlign: 'center' },
  offlineBanner: { backgroundColor: '#FF4444', padding: 8, alignItems: 'center' },
  offlineText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  header: { alignItems: 'center', padding: 24, backgroundColor: '#111', borderBottomWidth: 1, borderBottomColor: '#222' },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#00FFA320', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarLetter: { fontSize: 32, fontWeight: 'bold', color: '#00FFA3' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  email: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  treasuryBadgeText: { color: '#FFD700', fontSize: 12, fontWeight: 'bold', marginBottom: 20, letterSpacing: 1 },
  statsRow: { flexDirection: 'row', gap: 16, width: '100%', marginTop: 20 },
  statBox: { flex: 1, backgroundColor: '#1A1A1A', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  statLabel: { color: '#888', fontSize: 12, marginBottom: 8 },
  statValue: { color: '#FFD700', fontSize: 16, fontWeight: 'bold' },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  sectionDesc: { color: '#888', fontSize: 14, marginBottom: 16, lineHeight: 20 },
  getStarsBtn: { backgroundColor: '#00FFA3', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  getStarsText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  donateBtn: { backgroundColor: '#FFD700', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  donateText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});
