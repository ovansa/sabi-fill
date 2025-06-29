// const popupBrowser = (globalThis as any).browser || (globalThis as any).chrome;

// console.log('[SharpFilla] Popup script loaded');

// interface PopupUI {
//   fillButton: HTMLElement;
//   statusDiv: HTMLElement;
//   profileSelect: HTMLElement;
//   settingsButton: HTMLElement;
// }

// class PopupController {
//   private ui: PopupUI;

//   constructor() {
//     this.ui = {
//       fillButton: document.getElementById('fill')!,
//       statusDiv: document.getElementById('status')!,
//       profileSelect: document.getElementById('profile-select')!,
//       settingsButton: document.getElementById('settings')!,
//     };
//   }

//   init(): void {
//     this.setupEventListeners();
//     // this.loadProfiles();
//     this.updateUI();
//   }

//   private setupEventListeners(): void {
//     this.ui.fillButton.addEventListener('click', () => this.handleFillClick());
//     // this.ui.profileSelect.addEventListener('change', () =>
//     // 	this.handleProfileChange()
//     // );
//     this.ui.settingsButton.addEventListener('click', () =>
//       this.handleSettingsClick()
//     );
//   }

//   // private loadProfiles(): void {
//   // 	const select = this.ui.profileSelect as HTMLSelectElement;
//   // 	const profiles = DataProfileManager.getAllProfiles();

//   // 	select.innerHTML = '';
//   // 	profiles.forEach((profile) => {
//   // 		const option = document.createElement('option');
//   // 		option.value = profile.name;
//   // 		option.textContent = profile.name;
//   // 		select.appendChild(option);
//   // 	});
//   // }

//   private async handleFillClick(): Promise<void> {
//     const button = this.ui.fillButton;
//     const originalText = button.textContent;

//     try {
//       // Update UI state
//       button.textContent = 'Filling...';
//       button.setAttribute('disabled', 'true');
//       this.updateStatus('Filling form...', 'info');

//       // Get active tab
//       const [tab] = await popupBrowser.tabs.query({
//         active: true,
//         currentWindow: true,
//       });

//       if (!tab?.id) {
//         throw new Error('No active tab found');
//       }

//       // Send message to content script
//       const response = await new Promise<FillResponse>((resolve, reject) => {
//         popupBrowser.tabs.sendMessage(
//           tab.id!,
//           'fill-form',
//           (response: FillResponse) => {
//             if (popupBrowser.runtime.lastError) {
//               reject(new Error(popupBrowser.runtime.lastError.message));
//             } else {
//               resolve(response);
//             }
//           }
//         );
//       });

//       if (response.status === 'success') {
//         button.textContent = 'Success!';
//         button.style.backgroundColor = '#28a745';
//         this.updateStatus(
//           `Filled ${response.fieldsFilled} fields successfully!`,
//           'success'
//         );
//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error) {
//       console.error('[SharpFilla] Error:', error);
//       button.textContent = 'Error!';
//       button.style.backgroundColor = '#dc3545';
//       this.updateStatus(
//         `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
//         'error'
//       );
//     }

//     // Reset button after delay
//     setTimeout(() => {
//       button.textContent = originalText;
//       button.style.backgroundColor = '';
//       button.removeAttribute('disabled');
//       this.updateStatus('Ready to fill forms', 'ready');
//     }, 3000);
//   }

//   private handleProfileChange(): void {
//     const select = this.ui.profileSelect as HTMLSelectElement;
//     console.log('Profile changed to:', select.value);
//     // TODO: Update current profile in storage
//   }

//   private handleSettingsClick(): void {
//     console.log('Settings clicked');
//     // TODO: Open settings page
//   }

//   private updateStatus(
//     message: string,
//     type: 'info' | 'success' | 'error' | 'ready'
//   ): void {
//     if (!this.ui.statusDiv) return;

//     this.ui.statusDiv.textContent = message;
//     this.ui.statusDiv.className = `status status-${type}`;
//   }

//   private updateUI(): void {
//     this.updateStatus('Ready to fill forms', 'ready');
//   }
// }

// document.addEventListener('DOMContentLoaded', () => {
//   const popup = new PopupController();
//   popup.init();
// });

// ==================== popup.ts (Main Entry Point) ====================

import { PopupManager } from './core/popup-manager';
import { PopupLogger } from './utils/popup-logger';

// Global error handling
const handleGlobalError = (error: Error | ErrorEvent): void => {
  PopupLogger.error('Global popup error:', error);
};

// Set up global error handlers
globalThis.addEventListener('error', handleGlobalError);
globalThis.addEventListener(
  'unhandledrejection',
  (event: PromiseRejectionEvent) => {
    PopupLogger.error('Unhandled promise rejection:', event.reason);
  }
);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    const popupManager = new PopupManager();
    popupManager.init();
    PopupLogger.info('Popup script loaded successfully');
  } catch (error) {
    PopupLogger.error('Critical popup initialization failure:', error);
    // Could show error UI here
  }
});
