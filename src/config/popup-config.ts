// ==================== config/popup-config.ts ====================

export const POPUP_CONFIG = {
  UI_RESET_DELAY: 3000,
  DEFAULT_PROFILE: 'Default Professional',
  STATUS_MESSAGES: {
    READY: 'Ready to fill forms',
    PROCESSING: 'Filling form...',
    NO_TAB: 'No active tab found',
    SUCCESS: 'Fields filled successfully!',
    ERROR: 'Failed to fill form',
  },
  BUTTON_STATES: {
    DEFAULT: 'Fill Form',
    PROCESSING: 'Filling...',
    SUCCESS: 'Success!',
    ERROR: 'Error!',
  },
  COLORS: {
    SUCCESS: '#28a745',
    ERROR: '#dc3545',
    DEFAULT: '',
  },
} as const;

export const DOM_SELECTORS = {
  FILL_BUTTON: '#fill',
  STATUS_DIV: '#status',
  PROFILE_SELECT: '#profile-select',
  SETTINGS_BUTTON: '#settings',
} as const;
