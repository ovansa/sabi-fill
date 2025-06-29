// ==================== processors/textarea-processor.ts ====================

import { BaseFieldProcessor } from './base-processor';
import { FakeDataProfile } from '../types';
import { DOMUtils } from '../utils/dom-utils';

export class TextareaProcessor extends BaseFieldProcessor {
  private readonly fakeData: FakeDataProfile;

  constructor(fakeData: FakeDataProfile) {
    super();
    this.fakeData = fakeData;
  }

  process(): void {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach((textarea) => this.processTextarea(textarea));
  }

  private processTextarea(textarea: HTMLTextAreaElement): void {
    try {
      const identifier = DOMUtils.getElementIdentifier(textarea);
      this.logProcessing(textarea, identifier);

      const value =
        identifier.includes('bio') || identifier.includes('about')
          ? this.fakeData.personal.bio
          : 'This is sample text content for testing purposes. It provides meaningful placeholder text for textarea fields.';

      textarea.value = value;
      DOMUtils.triggerEvents(textarea);
      this.filledCount++;
    } catch (error) {
      this.handleError(
        error,
        `Failed to process textarea: ${textarea.id || textarea.name}`
      );
    }
  }
}
