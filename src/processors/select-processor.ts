// ==================== processors/select-processor.ts ====================

import { BaseFieldProcessor } from './base-processor';
import { DOMUtils } from '../utils/dom-utils';

export class SelectProcessor extends BaseFieldProcessor {
  private readonly optionMappings = new Map([
    ['country', ['Nigeria', 'NG', 'nigeria']],
    ['state', ['Lagos', 'lagos']],
    ['gender', ['male', 'Male', 'M', 'm']],
    ['title', ['Mr', 'Mr.', 'Mister']],
  ]);

  process(): void {
    const selects = document.querySelectorAll('select');
    selects.forEach((select) => this.processSelect(select));
  }

  private processSelect(select: HTMLSelectElement): void {
    try {
      if (select.options.length <= 1) return;

      const identifier = DOMUtils.getElementIdentifier(select);
      this.logProcessing(select, identifier);

      const wasSelected = this.selectBestOption(select, identifier);
      if (wasSelected) {
        DOMUtils.triggerEvents(select);
        this.filledCount++;
      }
    } catch (error) {
      this.handleError(
        error,
        `Failed to process select: ${select.id || select.name}`
      );
    }
  }

  private selectBestOption(
    select: HTMLSelectElement,
    identifier: string
  ): boolean {
    // Try specific mappings first
    for (const [key, values] of this.optionMappings) {
      if (identifier.includes(key)) {
        if (this.selectByValues(select, values)) {
          return true;
        }
      }
    }

    // Fallback to first non-empty option
    const validOption = Array.from(select.options).find(
      (opt, index) => index > 0 && opt.value.trim() !== ''
    );

    if (validOption) {
      validOption.selected = true;
      return true;
    }

    return false;
  }

  private selectByValues(
    select: HTMLSelectElement,
    targetValues: string[]
  ): boolean {
    const option = Array.from(select.options).find((opt) =>
      targetValues.some(
        (value) =>
          opt.value.toLowerCase().includes(value.toLowerCase()) ||
          opt.text.toLowerCase().includes(value.toLowerCase())
      )
    );

    if (option) {
      option.selected = true;
      return true;
    }

    return false;
  }
}
