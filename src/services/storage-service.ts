// ==================== services/storage-service.ts ====================

import { ExtensionConfig } from '../types/background';
import { BackgroundLogger } from '../utils/background-logger';

export class StorageService {
  private readonly browserAPI: any;

  constructor(browserAPI: any) {
    this.browserAPI = browserAPI;
    this.validateStorageAPI();
  }

  private validateStorageAPI(): void {
    if (!this.browserAPI?.storage?.sync) {
      const error = new Error('Browser storage API not available');
      BackgroundLogger.error('Storage API validation failed:', error);
      throw error;
    }
  }

  async saveConfig(config: ExtensionConfig): Promise<void> {
    try {
      await this.browserAPI.storage.sync.set({ config });
      BackgroundLogger.info('Configuration saved successfully');
    } catch (error) {
      BackgroundLogger.error('Failed to save configuration:', error);
      throw new Error('Configuration save failed');
    }
  }

  async getConfig(): Promise<ExtensionConfig | null> {
    try {
      const result = await this.browserAPI.storage.sync.get('config');
      return result.config || null;
    } catch (error) {
      BackgroundLogger.error('Failed to retrieve configuration:', error);
      throw new Error('Configuration retrieval failed');
    }
  }

  async clearStorage(): Promise<void> {
    try {
      await this.browserAPI.storage.sync.clear();
      BackgroundLogger.info('Storage cleared successfully');
    } catch (error) {
      BackgroundLogger.error('Failed to clear storage:', error);
      throw new Error('Storage clear failed');
    }
  }
}
