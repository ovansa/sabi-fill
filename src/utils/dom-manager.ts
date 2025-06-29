// ==================== utils/dom-manager.ts ====================

import { UIElements, StatusType } from '../types/popup';
import { DOM_SELECTORS, POPUP_CONFIG } from '../config/popup-config';
import { PopupLogger } from './popup-logger';

export class DOMManager {
  private readonly elements: UIElements;

  constructor() {
    this.elements = this.initializeElements();
  }

  private initializeElements(): UIElements {
    const elements = {
      fillButton: this.getElementById(DOM_SELECTORS.FILL_BUTTON),
      statusDiv: this.getElementById(DOM_SELECTORS.STATUS_DIV),
      profileSelect: this.getElementById(DOM_SELECTORS.PROFILE_SELECT),
      settingsButton: this.getElementById(DOM_SELECTORS.SETTINGS_BUTTON),
    };

    PopupLogger.debug('DOM elements initialized');
    return elements;
  }

  private getElementById(selector: string): HTMLElement {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) {
      const error = new Error(`Required element not found: ${selector}`);
      PopupLogger.error('DOM element missing:', error);
      throw error;
    }
    return element;
  }

  getElements(): UIElements {
    return this.elements;
  }

  updateButtonState(
    text: string,
    disabled: boolean = false,
    color: string = ''
  ): void {
    const button = this.elements.fillButton;
    button.textContent = text;

    if (disabled) {
      button.setAttribute('disabled', 'true');
    } else {
      button.removeAttribute('disabled');
    }

    (button as HTMLElement).style.backgroundColor = color;
  }

  updateStatus(message: string, type: StatusType): void {
    if (!this.elements.statusDiv) {
      PopupLogger.warn('Status div not available for update');
      return;
    }

    this.elements.statusDiv.textContent = message;
    this.elements.statusDiv.className = `status status-${type}`;
    PopupLogger.debug(`Status updated: ${message} (${type})`);
  }

  setProcessingState(): void {
    this.updateButtonState(POPUP_CONFIG.BUTTON_STATES.PROCESSING, true);
    this.updateStatus(POPUP_CONFIG.STATUS_MESSAGES.PROCESSING, 'processing');
  }

  setSuccessState(fieldCount: number): void {
    this.updateButtonState(
      POPUP_CONFIG.BUTTON_STATES.SUCCESS,
      true,
      POPUP_CONFIG.COLORS.SUCCESS
    );
    this.updateStatus(
      `Filled ${fieldCount} ${POPUP_CONFIG.STATUS_MESSAGES.SUCCESS}`,
      'success'
    );
  }

  setErrorState(errorMessage: string): void {
    this.updateButtonState(
      POPUP_CONFIG.BUTTON_STATES.ERROR,
      true,
      POPUP_CONFIG.COLORS.ERROR
    );
    this.updateStatus(
      `${POPUP_CONFIG.STATUS_MESSAGES.ERROR}: ${errorMessage}`,
      'error'
    );
  }

  setReadyState(): void {
    this.updateButtonState(POPUP_CONFIG.BUTTON_STATES.DEFAULT);
    this.updateStatus(POPUP_CONFIG.STATUS_MESSAGES.READY, 'ready');
  }
}
