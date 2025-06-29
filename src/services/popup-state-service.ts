// ==================== services/popup-state-service.ts ====================
import { PopupState, OperationResult } from '../types/popup';
import { POPUP_CONFIG } from '../config/popup-config';
import { PopupLogger } from '../utils/popup-logger';

export class PopupStateService {
  private state: PopupState;
  private readonly stateChangeListeners: Set<(state: PopupState) => void>;

  constructor() {
    this.state = this.createInitialState();
    this.stateChangeListeners = new Set();
  }

  private createInitialState(): PopupState {
    return {
      isProcessing: false,
      currentProfile: POPUP_CONFIG.DEFAULT_PROFILE,
      lastOperation: null,
    };
  }

  getState(): PopupState {
    return { ...this.state };
  }

  setProcessing(isProcessing: boolean): void {
    this.updateState({ isProcessing });
  }

  setCurrentProfile(profile: string): void {
    this.updateState({ currentProfile: profile });
  }

  setLastOperation(operation: OperationResult): void {
    this.updateState({ lastOperation: operation });
  }

  private updateState(updates: Partial<PopupState>): void {
    const previousState = { ...this.state };
    this.state = { ...this.state, ...updates };

    PopupLogger.debug('State updated:', {
      previous: previousState,
      current: this.state,
    });
    this.notifyStateChange();
  }

  addStateChangeListener(listener: (state: PopupState) => void): void {
    this.stateChangeListeners.add(listener);
  }

  removeStateChangeListener(listener: (state: PopupState) => void): void {
    this.stateChangeListeners.delete(listener);
  }

  private notifyStateChange(): void {
    this.stateChangeListeners.forEach((listener) => {
      try {
        listener(this.getState());
      } catch (error) {
        PopupLogger.error('State change listener failed:', error);
      }
    });
  }
}
