import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { getStarsBalance } from '../lib/stars';
import { ExchangeModal } from '../components/ExchangeModal';
import { StarsButton } from '../components/StarsButton';
import { StarsBalanceBadge } from '../components/StarsBalanceBadge';
import { useNetInfo } from '@react-native-community/netinfo';

export default function ProfileScreen() {
  const [session, setSession] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [exchangeVisible, setExchangeVisible] = useState(false);
  const { isConnected } = useNetInfo();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadData();
    });
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    const stats = await getStarsBalance();
    setBalance(stats.balance);
    setTotalReceived(stats.total_received);
    setRefreshing(false);
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} tintColor="#FFD700" />}
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
        <Text style={styles.email}>{session.user.email}</Text>
        
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
        <Text style={styles.sectionDesc}>Support the SIMU ecosystem treasury directly with your Stars.</Text>
        <StarsButton 
          receiverId={null} 
          type="donation" 
          amount={50} 
          label="Donate 50 Stars to Ecosystem" 
        />
      </View>

      <ExchangeModal 
        visible={exchangeVisible} 
        onClose={() => setExchangeVisible(false)} 
        onRefresh={loadData} 
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
  email: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 24 },
  statsRow: { flexDirection: 'row', gap: 16, width: '100%' },
  statBox: { flex: 1, backgroundColor: '#1A1A1A', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  statLabel: { color: '#888', fontSize: 12, marginBottom: 8 },
  statValue: { color: '#FFD700', fontSize: 16, fontWeight: 'bold' },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  sectionDesc: { color: '#888', fontSize: 14, marginBottom: 16, lineHeight: 20 },
  getStarsBtn: { backgroundColor: '#00FFA3', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  getStarsText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});
