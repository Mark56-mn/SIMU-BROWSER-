import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { BrowserIPC } from '../lib/BrowserIPC';

export default function SettingsScreen() {
  const [session, setSession] = useState<any>(null);
  const [authMethod, setAuthMethod] = useState<'wallet' | 'browser'>('wallet');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  const handleBrowserAuth = async (isSignUp: boolean) => {
    if (!email || !password) return Alert.alert('Error', 'Please enter email and password');
    setLoading(true);
    let error;
    if (isSignUp) {
      const res = await supabase.auth.signUp({ email, password });
      error = res.error;
    } else {
      const res = await supabase.auth.signInWithPassword({ email, password });
      error = res.error;
    }
    setLoading(false);
    if (error) Alert.alert('Error', error.message);
  };

  const handleWalletAuth = async () => {
    // Attempt to invoke IPC to log in using SIMU Testnet App
    setLoading(true);
    try {
      await BrowserIPC.requestWalletAccess();
      // In a real flow, the app resumes from deep link with a JWT or signed payload
      Alert.alert('Notice', 'Requested wallet access from SIMU Testnet App.');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not connect to Wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (session) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Account Settings</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Logged in as</Text>
          <Text style={styles.value}>{session.user?.email || 'Wallet User'}</Text>
          
          <TouchableOpacity style={styles.dangerBtn} onPress={handleLogout}>
            <Text style={styles.dangerBtnText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.header}>Browser Data</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Offline Cache Size</Text>
            <Text style={styles.value}>14.2 MB</Text>
          </View>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => Alert.alert('Cleared!', 'Offline cache cleared.')}>
            <Text style={styles.secondaryBtnText}>Clear Cache</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>Welcome to SIMU Browser</Text>
      <Text style={styles.subHeader}>Connect to post in communities and save your game progress.</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, authMethod === 'wallet' && styles.activeTab]} onPress={() => setAuthMethod('wallet')}>
          <Text style={[styles.tabText, authMethod === 'wallet' && styles.activeTabText]}>SIMU Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, authMethod === 'browser' && styles.activeTab]} onPress={() => setAuthMethod('browser')}>
          <Text style={[styles.tabText, authMethod === 'browser' && styles.activeTabText]}>Browser Account</Text>
        </TouchableOpacity>
      </View>

      {authMethod === 'wallet' ? (
        <View style={styles.card}>
          <Text style={styles.instructions}>
            Use the exact same details as your SIMU Wallet, or connect seamlessly via the SIMU Testnet app using secure IPC intent.
          </Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleWalletAuth} disabled={loading}>
            <Text style={styles.primaryBtnText}>Connect via SIMU App</Text>
          </TouchableOpacity>
          
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR ENTER SEED</Text>
            <View style={styles.line} />
          </View>

          <TextInput
            style={styles.input}
            placeholder="12-word seed phrase"
            placeholderTextColor="#666"
            secureTextEntry
          />
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => Alert.alert('Coming Soon', 'Seed import will securely derive your wallet.')}>
            <Text style={styles.secondaryBtnText}>Import Wallet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.instructions}>
            Create an isolated email/password account just for community features, separate from your SIMU funds.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#666"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.primaryBtn, { flex: 1, marginRight: 8 }]} onPress={() => handleBrowserAuth(false)} disabled={loading}>
              {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.primaryBtnText}>Sign In</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryBtn, { flex: 1, marginLeft: 8 }]} onPress={() => handleBrowserAuth(true)} disabled={loading}>
              <Text style={styles.secondaryBtnText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', padding: 16 },
  header: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 8, marginTop: 16 },
  subHeader: { color: '#888', fontSize: 14, marginBottom: 24 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#1A1A1A', borderRadius: 8, pading: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 6 },
  activeTab: { backgroundColor: '#333' },
  tabText: { color: '#888', fontWeight: 'bold' },
  activeTabText: { color: '#00FFA3' },
  card: { backgroundColor: '#1A1A1A', padding: 20, borderRadius: 16, borderLeftWidth: 3, borderLeftColor: '#00FFA3' },
  instructions: { color: '#AAA', fontSize: 14, marginBottom: 20, lineHeight: 20 },
  input: { backgroundColor: '#000', color: '#FFF', padding: 16, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#333', marginBottom: 16 },
  primaryBtn: { backgroundColor: '#00FFA3', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  secondaryBtn: { backgroundColor: '#333', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  secondaryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  dangerBtn: { backgroundColor: '#FF444420', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  dangerBtnText: { color: '#FF4444', fontWeight: 'bold', fontSize: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  line: { flex: 1, height: 1, backgroundColor: '#333' },
  orText: { color: '#666', paddingHorizontal: 16, fontSize: 12, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' },
  label: { color: '#888', fontSize: 14, marginBottom: 4 },
  value: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between' }
});
