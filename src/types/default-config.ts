// ==================== config/default-config.ts ====================

import { ExtensionConfig } from '../types/background';

export const createDefaultConfig = (): ExtensionConfig => ({
  animationSpeed: 'medium',
  visualFeedback: true,
  skipHiddenFields: true,
  respectRequiredOnly: false,
  currentProfile: 'Default Professional',
});

export const STORAGE_KEYS = {
  CONFIG: 'config',
  PROFILES: 'profiles',
  SETTINGS: 'settings',
} as const;
