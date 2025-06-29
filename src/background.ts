// ==================== background.ts (Main Entry Point) ====================

import { BackgroundManager } from './core/background-manager';
import { BackgroundLogger } from './utils/background-logger';

// Global error handling
const handleGlobalError = (error: Error | ErrorEvent): void => {
  BackgroundLogger.error('Global background error:', error);
};

// Set up global error handlers
globalThis.addEventListener('error', handleGlobalError);
globalThis.addEventListener(
  'unhandledrejection',
  (event: PromiseRejectionEvent) => {
    BackgroundLogger.error('Unhandled promise rejection:', event.reason);
  }
);

// Initialize the background manager
try {
  const backgroundManager = new BackgroundManager();
  backgroundManager.init();
  BackgroundLogger.info('Background script loaded successfully');
} catch (error) {
  BackgroundLogger.error('Critical background script failure:', error);
  throw error;
}
