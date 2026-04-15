import React, { useState, useRef } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props { url: string; walletAddress: string; balance: number; }

export function GameWebView({ url, walletAddress, balance }: Props) {
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  const injectedJS = `
    window.simu = {
      address: '${walletAddress}',
      balance: ${balance},
      signTX: function(tx) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SIGN_TX', payload: tx }));
      }
    };
    true;
  `;

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#00FFA3" />
          <Text style={styles.speed}>2G/3G Optimized - Caching Assets...</Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        injectedJavaScript={injectedJS}
        onMessage={(e) => console.log('IPC:', e.nativeEvent.data)}
        onLoadEnd={() => setLoading(false)}
        cacheEnabled={true}
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1, backgroundColor: '#000' },
  loader: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212', zIndex: 10 },
  speed: { color: '#00FFA3', marginTop: 10, fontSize: 12 }
});
