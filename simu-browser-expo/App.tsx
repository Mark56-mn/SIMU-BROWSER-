import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GamesHub } from './GamesHub';
import { CommunityFeed } from './CommunityFeed';
import { WebViewManager } from './WebViewManager';
import { OfflineCache } from './OfflineCache';

export default function App() {
  const [activeTab, setActiveTab] = useState<'games' | 'community' | 'browser'>('games');
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    OfflineCache.initCache().catch(console.error);
    // Stub network listener
    setIsOffline(false);
  }, []);

  const openDApp = (url: string) => {
    setCurrentUrl(url);
    setActiveTab('browser');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SIMU Browser</Text>
        {isOffline && <View style={styles.offlineBadge}><Text style={styles.offlineText}>Offline</Text></View>}
      </View>

      <View style={styles.content}>
        {activeTab === 'games' && <GamesHub onLaunch={openDApp} />}
        {activeTab === 'community' && <CommunityFeed />}
        {activeTab === 'browser' && currentUrl && (
          <WebViewManager url={currentUrl} onClose={() => setActiveTab('games')} />
        )}
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('games')}>
          <Text style={[styles.navText, activeTab === 'games' && styles.activeNavText]}>Games</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('community')}>
          <Text style={[styles.navText, activeTab === 'community' && styles.activeNavText]}>Community</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#1E1E1E' },
  title: { color: '#00FFA3', fontSize: 20, fontWeight: 'bold' },
  offlineBadge: { backgroundColor: '#FF4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  offlineText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  content: { flex: 1 },
  navBar: { flexDirection: 'row', backgroundColor: '#1E1E1E', padding: 16, borderTopWidth: 1, borderTopColor: '#333' },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { color: '#888', fontSize: 16 },
  activeNavText: { color: '#00FFA3', fontWeight: 'bold' },
});
