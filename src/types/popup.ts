// ==================== types/popup.ts ====================

export interface FillResponse {
  readonly status: 'success' | 'error';
  readonly message: string;
  readonly fieldsFilled: number;
  readonly errors?: ReadonlyArray<string>;
}

export interface PopupState {
  readonly isProcessing: boolean;
  readonly currentProfile: string;
  readonly lastOperation: OperationResult | null;
}

export interface OperationResult {
  readonly success: boolean;
  readonly message: string;
  readonly timestamp: number;
  readonly fieldsFilled?: number;
}

export interface UIElements {
  readonly fillButton: HTMLElement;
  readonly statusDiv: HTMLElement;
  readonly profileSelect: HTMLElement;
  readonly settingsButton: HTMLElement;
}

export interface TabInfo {
  readonly id: number;
  readonly url?: string;
  readonly title?: string;
}

export type StatusType = 'info' | 'success' | 'error' | 'ready' | 'processing';

export interface PopupMessage {
  readonly type: string;
  readonly payload?: unknown;
}
