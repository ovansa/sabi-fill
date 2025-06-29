// ==================== services/form-fill-service.ts ====================

import { FillResponse, OperationResult } from '../types/popup';
import { BrowserService } from './browser-service';
import { PopupLogger } from '../utils/popup-logger';

export class FormFillService {
  private readonly browserService: BrowserService;

  constructor(browserService: BrowserService) {
    this.browserService = browserService;
  }

  async executeFormFill(): Promise<OperationResult> {
    try {
      PopupLogger.info('Starting form fill operation');

      const activeTab = await this.browserService.getActiveTab();
      PopupLogger.debug('Active tab obtained:', activeTab);

      const response = await this.browserService.sendMessageToContentScript(
        activeTab.id,
        'fill-form'
      );

      if (response.status === 'success') {
        const result: OperationResult = {
          success: true,
          message: response.message,
          timestamp: Date.now(),
          fieldsFilled: response.fieldsFilled,
        };

        PopupLogger.info(
          `Form fill completed successfully: ${response.fieldsFilled} fields`
        );
        return result;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      PopupLogger.error('Form fill operation failed:', error);

      return {
        success: false,
        message: errorMessage,
        timestamp: Date.now(),
      };
    }
  }
}
