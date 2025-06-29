// ==================== processors/checkbox-processor.ts ====================

import { BaseFieldProcessor } from './base-processor';
import { DOMUtils } from '../utils/dom-utils';

export class CheckboxProcessor extends BaseFieldProcessor {
  private readonly autoCheckPatterns = [
    'terms',
    'agree',
    'accept',
    'consent',
    'privacy',
    'newsletter',
    'updates',
  ];

  process(): void {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) =>
      this.processCheckbox(checkbox as HTMLInputElement)
    );
  }

  private processCheckbox(checkbox: HTMLInputElement): void {
    try {
      const identifier = DOMUtils.getElementIdentifier(checkbox);
      this.logProcessing(checkbox, identifier);

      if (this.shouldCheck(checkbox, identifier)) {
        checkbox.checked = true;
        DOMUtils.triggerEvents(checkbox);
        this.filledCount++;
      }
    } catch (error) {
      this.handleError(
        error,
        `Failed to process checkbox: ${checkbox.id || checkbox.name}`
      );
    }
  }

  private shouldCheck(checkbox: HTMLInputElement, identifier: string): boolean {
    // Always check required checkboxes
    if (checkbox.required) return true;

    // Check based on common patterns
    return this.autoCheckPatterns.some((pattern) =>
      identifier.includes(pattern)
    );
  }
}
