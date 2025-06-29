// ==================== types/background.ts ====================

export interface ExtensionConfig {
  readonly animationSpeed: 'slow' | 'medium' | 'fast';
  readonly visualFeedback: boolean;
  readonly skipHiddenFields: boolean;
  readonly respectRequiredOnly: boolean;
  readonly currentProfile: string;
}

export interface BackgroundMessage {
  readonly type: string;
  readonly payload?: unknown;
}

export interface MessageResponse {
  readonly status: 'success' | 'error' | 'received';
  readonly message?: string;
  readonly data?: unknown;
}

export interface InstallationResult {
  readonly success: boolean;
  readonly message: string;
  readonly config?: ExtensionConfig;
}
