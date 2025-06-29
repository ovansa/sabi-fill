// ==================== controllers/event-controller.ts ====================

import { UIElements } from '../types/popup';
import { FormFillService } from '../services/fillform-service';
import { PopupStateService } from '../services/popup-state-service';
import { BrowserService } from '../services/browser-service';
import { DOMManager } from '../utils/dom-manager';
import { POPUP_CONFIG } from '../config/popup-config';
import { PopupLogger } from '../utils/popup-logger';

export class EventController {
  private readonly domManager: DOMManager;
  private readonly formFillService: FormFillService;
  private readonly stateService: PopupStateService;
  private readonly browserService: BrowserService;

  constructor(
    domManager: DOMManager,
    formFillService: FormFillService,
    stateService: PopupStateService,
    browserService: BrowserService
  ) {
    this.domManager = domManager;
    this.formFillService = formFillService;
    this.stateService = stateService;
    this.browserService = browserService;
  }

  setupEventListeners(): void {
    const elements = this.domManager.getElements();

    elements.fillButton.addEventListener('click', () => this.handleFillClick());
    elements.settingsButton.addEventListener('click', () =>
      this.handleSettingsClick()
    );

    // Profile selection is currently disabled but kept for future use
    // elements.profileSelect.addEventListener('change', () => this.handleProfileChange());

    PopupLogger.debug('Event listeners registered');
  }

  private async handleFillClick(): Promise<void> {
    const state = this.stateService.getState();

    if (state.isProcessing) {
      PopupLogger.warn('Fill operation already in progress');
      return;
    }

    try {
      this.stateService.setProcessing(true);
      this.domManager.setProcessingState();

      const result = await this.formFillService.executeFormFill();
      this.stateService.setLastOperation(result);

      if (result.success) {
        this.domManager.setSuccessState(result.fieldsFilled || 0);
      } else {
        this.domManager.setErrorState(result.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      PopupLogger.error('Fill click handler failed:', error);
      this.domManager.setErrorState(errorMessage);
    } finally {
      // Reset UI after delay
      setTimeout(() => {
        this.stateService.setProcessing(false);
        this.domManager.setReadyState();
      }, POPUP_CONFIG.UI_RESET_DELAY);
    }
  }

  private async handleSettingsClick(): Promise<void> {
    try {
      PopupLogger.info('Opening settings page');
      await this.browserService.openOptionsPage();
    } catch (error) {
      PopupLogger.error('Settings click handler failed:', error);
      // Could show error state here if needed
    }
  }

  private handleProfileChange(): void {
    const elements = this.domManager.getElements();
    const select = elements.profileSelect as HTMLSelectElement;
    const selectedProfile = select.value;

    PopupLogger.info('Profile changed to:', selectedProfile);
    this.stateService.setCurrentProfile(selectedProfile);

    // TODO: Persist profile selection to storage
  }
}
