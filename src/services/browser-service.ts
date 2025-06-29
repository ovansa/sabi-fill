// ==================== services/browser-service.ts ====================

import { TabInfo, FillResponse } from '../types/popup';
import { PopupLogger } from '../utils/popup-logger';

export class BrowserService {
  private readonly browserAPI: any;

  constructor() {
    this.browserAPI = (globalThis as any).browser || (globalThis as any).chrome;
    this.validateBrowserAPI();
  }

  private validateBrowserAPI(): void {
    if (!this.browserAPI) {
      const error = new Error('Browser API not available');
      PopupLogger.error('Browser API validation failed:', error);
      throw error;
    }
  }

  async getActiveTab(): Promise<TabInfo> {
    try {
      const [tab] = await this.browserAPI.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.id) {
        throw new Error('No active tab found');
      }

      return {
        id: tab.id,
        url: tab.url,
        title: tab.title,
      };
    } catch (error) {
      PopupLogger.error('Failed to get active tab:', error);
      throw new Error('Unable to access active tab');
    }
  }

  async sendMessageToContentScript(
    tabId: number,
    message: string
  ): Promise<FillResponse> {
    return new Promise((resolve, reject) => {
      this.browserAPI.tabs.sendMessage(
        tabId,
        message,
        (response: FillResponse) => {
          if (this.browserAPI.runtime.lastError) {
            const error = new Error(this.browserAPI.runtime.lastError.message);
            PopupLogger.error('Content script communication failed:', error);
            reject(error);
          } else if (!response) {
            const error = new Error('No response from content script');
            PopupLogger.error('Empty response from content script');
            reject(error);
          } else {
            PopupLogger.debug('Content script response received:', response);
            resolve(response);
          }
        }
      );
    });
  }

  async openOptionsPage(): Promise<void> {
    try {
      if (this.browserAPI.runtime.openOptionsPage) {
        await this.browserAPI.runtime.openOptionsPage();
      } else {
        PopupLogger.warn('Options page API not available');
      }
    } catch (error) {
      PopupLogger.error('Failed to open options page:', error);
      throw new Error('Unable to open settings');
    }
  }
}
