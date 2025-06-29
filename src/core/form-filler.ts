// ==================== core/form-filler.ts ====================

import { FillResponse, FakeDataProfile } from '../types';
import { createFakeDataProfile } from '../config/fake-data';
import { Logger } from '../utils/logger';
import {
  BaseFieldProcessor,
  InputProcessor,
  SelectProcessor,
  RadioProcessor,
  CheckboxProcessor,
  TextareaProcessor,
} from '../processors';

export class EnterpriseFormFiller {
  private readonly browser: any;
  private readonly fakeData: FakeDataProfile;
  private readonly processors: ReadonlyArray<BaseFieldProcessor>;

  constructor() {
    this.browser = (globalThis as any).browser || (globalThis as any).chrome;
    this.fakeData = createFakeDataProfile();
    this.processors = this.createProcessors();
  }

  private createProcessors(): ReadonlyArray<BaseFieldProcessor> {
    return [
      new InputProcessor(this.fakeData),
      new SelectProcessor(),
      new RadioProcessor(),
      new CheckboxProcessor(),
      new TextareaProcessor(this.fakeData),
    ];
  }

  async fillAllInputs(): Promise<FillResponse> {
    Logger.info('Starting enterprise form fill process...');

    try {
      let totalFilled = 0;
      const allErrors: string[] = [];

      // Process all field types
      for (const processor of this.processors) {
        processor.process();
        const { filledCount, errors } = processor.getResults();
        totalFilled += filledCount;
        allErrors.push(...errors);
      }

      const response: FillResponse = {
        status: 'success',
        message: `Successfully filled ${totalFilled} fields`,
        fieldsFilled: totalFilled,
        errors: allErrors.length > 0 ? allErrors : undefined,
      };

      Logger.info(`Process completed: ${totalFilled} fields filled`);
      return response;
    } catch (error) {
      Logger.error('Critical error:', error);
      return {
        status: 'error',
        message: 'Critical failure during form filling process',
        fieldsFilled: 0,
        errors: [
          error instanceof Error ? error.message : 'Unknown critical error',
        ],
      };
    }
  }

  init(): void {
    if (!this.browser?.runtime?.onMessage) {
      Logger.error('Browser runtime not available');
      return;
    }

    this.browser.runtime.onMessage.addListener(
      (
        message: unknown,
        sender: unknown,
        sendResponse: (response: FillResponse) => void
      ) => {
        if (message === 'fill-form') {
          this.fillAllInputs()
            .then(sendResponse)
            .catch((error: unknown) => {
              const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
              sendResponse({
                status: 'error',
                message: errorMessage,
                fieldsFilled: 0,
                errors: [errorMessage],
              });
            });
          return true; // Keep message channel open for async response
        }
        return false;
      }
    );

    Logger.info('Enterprise form filler initialized');
  }
}
