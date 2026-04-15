import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props { 
  url: string; 
  walletData: { address: string; balance: number } | null; 
}

export function SecureWebView({ url, walletData }: Props) {
  const webViewRef = useRef<WebView>(null);

  const injectedJS = walletData ? `
    window.simu = {
      address: '${walletData.address}',
      balance: ${walletData.balance},
      sign: function(msg) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SIGN_MSG', payload: msg }));
      }
    };
    true;
  ` : 'true;';

  const onShouldStartLoadWithRequest = (request: any) => {
    return request.url.includes('simu.network');
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        injectedJavaScript={injectedJS}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        originWhitelist={['https://*.simu.network']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={false}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1, backgroundColor: '#000' }
});
