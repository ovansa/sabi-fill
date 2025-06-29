// ==================== services/message-service.ts ====================

import { BackgroundMessage, MessageResponse } from '../types/background';
import { BackgroundLogger } from '../utils/background-logger';

export class MessageService {
  private readonly browserAPI: any;
  private readonly messageHandlers: Map<
    string,
    (payload: unknown) => Promise<MessageResponse>
  >;

  constructor(browserAPI: any) {
    this.browserAPI = browserAPI;
    this.messageHandlers = new Map();
    this.initializeMessageHandlers();
  }

  private initializeMessageHandlers(): void {
    this.registerHandler('ping', this.handlePing.bind(this));
    this.registerHandler('get-config', this.handleGetConfig.bind(this));
    this.registerHandler('update-config', this.handleUpdateConfig.bind(this));
  }

  registerHandler(
    messageType: string,
    handler: (payload: unknown) => Promise<MessageResponse>
  ): void {
    this.messageHandlers.set(messageType, handler);
    BackgroundLogger.debug(
      `Registered handler for message type: ${messageType}`
    );
  }

  init(): void {
    if (!this.browserAPI?.runtime?.onMessage) {
      BackgroundLogger.error(
        'Browser runtime not available for message handling'
      );
      return;
    }

    this.browserAPI.runtime.onMessage.addListener(
      (
        message: BackgroundMessage,
        sender: any,
        sendResponse: (response: MessageResponse) => void
      ) => {
        this.handleMessage(message, sender)
          .then(sendResponse)
          .catch((error: unknown) => {
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error';
            BackgroundLogger.error('Message handling failed:', error);
            sendResponse({
              status: 'error',
              message: errorMessage,
            });
          });
        return true; // Keep message channel open for async response
      }
    );

    BackgroundLogger.info('Message service initialized');
  }

  private async handleMessage(
    message: BackgroundMessage,
    sender: any
  ): Promise<MessageResponse> {
    BackgroundLogger.debug('Received message:', message);

    const handler = this.messageHandlers.get(message.type);
    if (!handler) {
      BackgroundLogger.warn(
        `No handler found for message type: ${message.type}`
      );
      return {
        status: 'error',
        message: `Unknown message type: ${message.type}`,
      };
    }

    try {
      return await handler(message.payload);
    } catch (error) {
      BackgroundLogger.error(
        `Handler failed for message type ${message.type}:`,
        error
      );
      throw error;
    }
  }

  private async handlePing(payload: unknown): Promise<MessageResponse> {
    return {
      status: 'received',
      message: 'Background script is active',
      data: { timestamp: Date.now() },
    };
  }

  private async handleGetConfig(payload: unknown): Promise<MessageResponse> {
    // This would integrate with StorageService in a real implementation
    return {
      status: 'success',
      message: 'Configuration retrieved',
      data: { config: 'placeholder' },
    };
  }

  private async handleUpdateConfig(payload: unknown): Promise<MessageResponse> {
    // This would integrate with StorageService in a real implementation
    return {
      status: 'success',
      message: 'Configuration updated',
    };
  }
}
