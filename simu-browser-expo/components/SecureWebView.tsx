import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props {
  url: string;
  onClose: () => void;
}

export function SecureWebView({ url, onClose }: Props) {
  const webViewRef = useRef<WebView>(null);

  const injectedJS = `
    // Inject SIMU object
    window.simu = { connected: true, network: 'testnet' };
    
    // Block popups from JavaScript side
    window.open = function() {
      console.warn("Popups are blocked by SIMU Browser");
      return null;
    };
    
    true;
  `;

  // Stricter URL whitelisting
  const isAllowedUrl = (targetUrl: string) => {
    // Allows https://simu.network or https://*.simu.network (including sub-paths)
    // Prevents bypasses like https://malicious.com/?q=simu.network
    const regex = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)*simu\.network(?:\/|$)/i;
    return regex.test(targetUrl);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>Done</Text>
        </TouchableOpacity>
        <Text style={styles.url} numberOfLines={1}>{url}</Text>
      </View>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        injectedJavaScript={injectedJS}
        injectedJavaScriptBeforeContentLoaded={injectedJS}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        cacheEnabled={true}
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={(request) => isAllowedUrl(request.url)}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#121212', borderBottomWidth: 1, borderBottomColor: '#333' },
  closeBtn: { padding: 8 },
  closeText: { color: '#00FFA3', fontWeight: 'bold' },
  url: { color: '#888', flex: 1, textAlign: 'center', marginRight: 40 },
  webview: { flex: 1, backgroundColor: '#000' },
});
