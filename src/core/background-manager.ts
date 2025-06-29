// ==================== core/background-manager.ts ====================
import { BackgroundLogger } from '../utils/background-logger';
import { StorageService } from '../services/storage-service';
import { MessageService } from '../services/message-service';
import { InstallationService } from '../services/installation-service';

export class BackgroundManager {
  private readonly browserAPI: any;
  private readonly storageService: StorageService;
  private readonly messageService: MessageService;
  private readonly installationService: InstallationService;

  constructor() {
    this.browserAPI = (globalThis as any).browser || (globalThis as any).chrome;
    this.validateBrowserAPI();

    this.storageService = new StorageService(this.browserAPI);
    this.messageService = new MessageService(this.browserAPI);
    this.installationService = new InstallationService(this.storageService);
  }

  private validateBrowserAPI(): void {
    if (!this.browserAPI) {
      const error = new Error('Browser API not available');
      BackgroundLogger.error('Browser API validation failed:', error);
      throw error;
    }
  }

  init(): void {
    try {
      this.setupInstallationHandlers();
      this.messageService.init();
      BackgroundLogger.info('Background manager initialized successfully');
    } catch (error) {
      BackgroundLogger.error(
        'Background manager initialization failed:',
        error
      );
      throw error;
    }
  }

  private setupInstallationHandlers(): void {
    if (!this.browserAPI.runtime?.onInstalled) {
      BackgroundLogger.warn('onInstalled API not available');
      return;
    }

    this.browserAPI.runtime.onInstalled.addListener(async (details: any) => {
      try {
        let result;

        if (details.reason === 'install') {
          result = await this.installationService.handleInstallation();
        } else if (details.reason === 'update') {
          result = await this.installationService.handleUpdate(details);
        } else {
          BackgroundLogger.info(`Installation event: ${details.reason}`);
          return;
        }

        if (result.success) {
          BackgroundLogger.info(result.message);
        } else {
          BackgroundLogger.error(result.message);
        }
      } catch (error) {
        BackgroundLogger.error('Installation handler failed:', error);
      }
    });
  }

  // Public API for external access if needed
  getStorageService(): StorageService {
    return this.storageService;
  }

  getMessageService(): MessageService {
    return this.messageService;
  }
}
