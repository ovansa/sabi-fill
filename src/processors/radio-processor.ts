// ==================== processors/radio-processor.ts ====================

import { BaseFieldProcessor } from './base-processor';
import { DOMUtils } from '../utils/dom-utils';

export class RadioProcessor extends BaseFieldProcessor {
  process(): void {
    const radioGroups = this.groupRadiosByName();
    radioGroups.forEach((radios, groupName) =>
      this.processRadioGroup(radios, groupName)
    );
  }

  private groupRadiosByName(): Map<string, HTMLInputElement[]> {
    const groups = new Map<string, HTMLInputElement[]>();

    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      const input = radio as HTMLInputElement;
      const groupName = input.name || 'unnamed';

      if (!groups.has(groupName)) {
        groups.set(groupName, []);
      }
      groups.get(groupName)!.push(input);
    });

    return groups;
  }

  private processRadioGroup(
    radios: HTMLInputElement[],
    groupName: string
  ): void {
    try {
      if (radios.length === 0) return;

      this.logProcessing(radios[0], groupName);
      const selectedRadio = this.selectBestRadio(radios, groupName);

      if (selectedRadio) {
        selectedRadio.checked = true;
        DOMUtils.triggerEvents(selectedRadio);
        this.filledCount++;
      }
    } catch (error) {
      this.handleError(error, `Failed to process radio group: ${groupName}`);
    }
  }

  private selectBestRadio(
    radios: HTMLInputElement[],
    groupName: string
  ): HTMLInputElement | null {
    const lowerGroupName = groupName.toLowerCase();

    // Gender-specific selection
    if (lowerGroupName.includes('gender') || lowerGroupName.includes('sex')) {
      const maleRadio = radios.find(
        (r) =>
          r.value.toLowerCase().includes('male') ||
          r.value.toLowerCase() === 'm'
      );
      if (maleRadio) return maleRadio;
    }

    // Return first available option
    return radios[0] || null;
  }
}
