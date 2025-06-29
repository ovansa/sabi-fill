// ==================== services/installation-service.ts ====================
import { InstallationResult, ExtensionConfig } from '../types/background';
import { createDefaultConfig } from '../config/default-config';
import { BackgroundLogger } from '../utils/background-logger';
import { StorageService } from './storage-service';

export class InstallationService {
  private readonly storageService: StorageService;

  constructor(storageService: StorageService) {
    this.storageService = storageService;
  }

  async handleInstallation(): Promise<InstallationResult> {
    try {
      BackgroundLogger.info('Extension installation detected');

      const defaultConfig = createDefaultConfig();
      await this.storageService.saveConfig(defaultConfig);

      return {
        success: true,
        message: 'Extension installed and configured successfully',
        config: defaultConfig,
      };
    } catch (error) {
      BackgroundLogger.error('Installation failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Installation failed',
      };
    }
  }

  async handleUpdate(details: any): Promise<InstallationResult> {
    try {
      BackgroundLogger.info('Extension update detected', details);

      // Preserve existing config or create default if needed
      let existingConfig = await this.storageService.getConfig();
      if (!existingConfig) {
        existingConfig = createDefaultConfig();
        await this.storageService.saveConfig(existingConfig);
      }

      return {
        success: true,
        message: 'Extension updated successfully',
        config: existingConfig,
      };
    } catch (error) {
      BackgroundLogger.error('Update handling failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Update failed',
      };
    }
  }
}
