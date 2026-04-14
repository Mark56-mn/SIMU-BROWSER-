import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { IPCManager } from './IPCManager';

interface Props {
  url: string;
  onClose: () => void;
}

export function WebViewManager({ url, onClose }: Props) {
  const webViewRef = useRef<WebView>(null);

  const injectedJS = `
    window.simu = {
      requestWallet: function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'WALLET_REQUEST' }));
      }
    };
    true;
  `;

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'WALLET_REQUEST') {
        const success = await IPCManager.sendToApp('testnet', 'connect_wallet', { origin: url });
        if (success) {
          webViewRef.current?.injectJavaScript(\`window.dispatchEvent(new CustomEvent('simu_wallet_connected'));\`);
        }
      }
    } catch (e) {
      console.error('WebView message error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={onClose}><Text style={styles.closeBtn}>Close</Text></TouchableOpacity>
        <Text style={styles.url} numberOfLines={1}>{url}</Text>
      </View>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        injectedJavaScript={injectedJS}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        cacheEnabled={true}
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  toolbar: { flexDirection: 'row', padding: 12, backgroundColor: '#222', alignItems: 'center' },
  closeBtn: { color: '#FF4444', marginRight: 16, fontWeight: 'bold' },
  url: { color: '#FFF', flex: 1 },
  webview: { flex: 1, backgroundColor: '#000' }
});
