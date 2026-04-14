import * as FileSystem from 'expo-file-system';

const CACHE_DIR = FileSystem.cacheDirectory + 'simu_offline/';
const MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB

export class OfflineCache {
  static async initCache() {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
    }
  }

  static async saveItem(key: string, data: any) {
    const fileUri = CACHE_DIR + encodeURIComponent(key) + '.json';
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data));
    await this.enforceQuota();
  }

  static async getItem(key: string): Promise<any | null> {
    const fileUri = CACHE_DIR + encodeURIComponent(key) + '.json';
    const info = await FileSystem.getInfoAsync(fileUri);
    if (info.exists) {
      const content = await FileSystem.readAsStringAsync(fileUri);
      return JSON.parse(content);
    }
    return null;
  }

  private static async enforceQuota() {
    // Stub: Read directory, sum sizes, delete oldest if > MAX_CACHE_SIZE
  }
}
