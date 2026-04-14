import * as Linking from 'expo-linking';

export interface IPCMessage {
  type: string;
  payload: any;
  signature: string;
  timestamp: number;
}

export class IPCManager {
  private static SECRET_KEY = 'simu_shared_secret_stub'; // In production, use secure keystore

  static verifySignature(message: IPCMessage): boolean {
    // Stub: In production, verify cryptographic signature
    // e.g., using crypto.subtle or a native crypto module
    const timeDiff = Date.now() - message.timestamp;
    if (timeDiff > 5 * 60 * 1000) return false; // 5 min expiry
    return message.signature.length > 0;
  }

  static async sendToApp(targetApp: 'testnet' | 'nodes' | 'devcore', action: string, data: any): Promise<boolean> {
    const timestamp = Date.now();
    const message: IPCMessage = {
      type: action,
      payload: data,
      timestamp,
      signature: this.generateSignature(action, data, timestamp),
    };

    const encodedPayload = encodeURIComponent(JSON.stringify(message));
    const url = `simu://${targetApp}/${action}?data=${encodedPayload}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        return true;
      }
      console.warn(`App ${targetApp} not installed. Fallback triggered.`);
      return false;
    } catch (error) {
      console.error('IPC Error:', error);
      return false;
    }
  }

  private static generateSignature(action: string, data: any, timestamp: number): string {
    // Stub signature generation
    return `sig_${action}_${timestamp}`;
  }
}
