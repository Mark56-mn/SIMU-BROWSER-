import * as Linking from 'expo-linking';

export type AppStatus = 'installed' | 'not_installed';

export class AppDetector {
  static async checkTestnet(): Promise<AppStatus> {
    try {
      const canOpen = await Linking.canOpenURL('simu-testnet://');
      return canOpen ? 'installed' : 'not_installed';
    } catch {
      return 'not_installed';
    }
  }

  static async checkAngNodes(): Promise<AppStatus> {
    try {
      const canOpen = await Linking.canOpenURL('simu-nodes://');
      return canOpen ? 'installed' : 'not_installed';
    } catch {
      return 'not_installed';
    }
  }
}
