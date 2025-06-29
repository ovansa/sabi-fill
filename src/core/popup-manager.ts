// ==================== core/popup-manager.ts ====================

import { DOMManager } from '../utils/dom-manager';
import { BrowserService } from '../services/browser-service';
import { FormFillService } from '../services/fillform-service';
import { PopupStateService } from '../services/popup-state-service';
import { EventController } from '../controllers/event-controller';
import { PopupLogger } from '../utils/popup-logger';

export class PopupManager {
  private readonly domManager: DOMManager;
  private readonly browserService: BrowserService;
  private readonly formFillService: FormFillService;
  private readonly stateService: PopupStateService;
  private readonly eventController: EventController;

  constructor() {
    this.domManager = new DOMManager();
    this.browserService = new BrowserService();
    this.formFillService = new FormFillService(this.browserService);
    this.stateService = new PopupStateService();
    this.eventController = new EventController(
      this.domManager,
      this.formFillService,
      this.stateService,
      this.browserService
    );
  }

  init(): void {
    try {
      this.eventController.setupEventListeners();
      this.initializeUI();
      this.setupStateObserver();

      PopupLogger.info('Popup manager initialized successfully');
    } catch (error) {
      PopupLogger.error('Popup manager initialization failed:', error);
      throw error;
    }
  }

  private initializeUI(): void {
    this.domManager.setReadyState();
    // TODO: Load and apply saved profile selection
    // TODO: Load and apply saved settings
  }

  private setupStateObserver(): void {
    this.stateService.addStateChangeListener((state) => {
      PopupLogger.debug('State changed:', state);
      // React to state changes if needed
    });
  }

  // Public API for external access if needed
  getDOMManager(): DOMManager {
    return this.domManager;
  }

  getStateService(): PopupStateService {
    return this.stateService;
  }
}
