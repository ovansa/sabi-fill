// ==================== processors/input-processor.ts ====================

import { BaseFieldProcessor } from './base-processor';
import { FakeDataProfile, FieldMapping } from '../types';
import { DOMUtils } from '../utils/dom-utils';

export class InputProcessor extends BaseFieldProcessor {
  private readonly fakeData: FakeDataProfile;
  private readonly fieldMappings: ReadonlyArray<FieldMapping>;

  constructor(fakeData: FakeDataProfile) {
    super();
    this.fakeData = fakeData;
    this.fieldMappings = this.createFieldMappings();
  }

  private createFieldMappings(): ReadonlyArray<FieldMapping> {
    return [
      // Password fields (including confirm password)
      {
        matcher: (id) => this.isPasswordField(id),
        provider: () => this.fakeData.security.password,
      },
      // Name fields
      {
        matcher: (id) => id.includes('first') && id.includes('name'),
        provider: () => this.fakeData.personal.firstName,
      },
      {
        matcher: (id) => id.includes('last') && id.includes('name'),
        provider: () => this.fakeData.personal.lastName,
      },
      // Email fields
      {
        matcher: (id) => id.includes('email') && id.includes('work'),
        provider: () => this.fakeData.personal.workEmail,
      },
      {
        matcher: (id) => id.includes('email'),
        provider: () => this.fakeData.personal.email,
      },
      // Phone fields
      {
        matcher: (id) => id.includes('phone') && id.includes('emergency'),
        provider: () => this.fakeData.personal.emergencyPhone,
      },
      {
        matcher: (id) => id.includes('phone') || id.includes('tel'),
        provider: () => this.fakeData.personal.phone,
      },
      // Professional fields
      {
        matcher: (id) => id.includes('company') || id.includes('organization'),
        provider: () => this.fakeData.professional.company,
      },
      {
        matcher: (id) =>
          id.includes('job') || id.includes('title') || id.includes('position'),
        provider: () => this.fakeData.professional.jobTitle,
      },
      // Address fields
      {
        matcher: (id) => id.includes('street') || id.includes('address'),
        provider: () => this.fakeData.address.street,
      },
      {
        matcher: (id) =>
          id.includes('apartment') || id.includes('apt') || id.includes('unit'),
        provider: () => this.fakeData.address.apartment,
      },
      {
        matcher: (id) => id.includes('city'),
        provider: () => this.fakeData.address.city,
      },
      {
        matcher: (id) => id.includes('zip') || id.includes('postal'),
        provider: () => this.fakeData.address.zipCode,
      },
      // Credit card fields
      {
        matcher: (id) =>
          id.includes('card') && (id.includes('name') || id.includes('holder')),
        provider: () => this.fakeData.payment.ccName,
      },
      {
        matcher: (id) =>
          id.includes('card') && (id.includes('number') || id.includes('cc')),
        provider: () => this.fakeData.payment.ccNumber,
      },
      {
        matcher: (id) =>
          id.includes('expiry') ||
          id.includes('exp') ||
          id.includes('expiration'),
        provider: () => this.fakeData.payment.ccExpiry,
      },
      {
        matcher: (id) =>
          id.includes('cvv') || id.includes('cvc') || id.includes('security'),
        provider: () => this.fakeData.payment.ccCvv,
      },
      // Miscellaneous
      {
        matcher: (id) => id.includes('username') || id.includes('login'),
        provider: () => this.fakeData.security.username,
      },
      {
        matcher: (id) => id.includes('age'),
        provider: () => this.fakeData.personal.age,
      },
      {
        matcher: (id) => id.includes('salary') || id.includes('income'),
        provider: () => this.fakeData.professional.salary,
      },
      {
        matcher: (id) => id.includes('website') || id.includes('url'),
        provider: () => this.fakeData.professional.website,
      },
      {
        matcher: (id) => id.includes('linkedin'),
        provider: () => this.fakeData.professional.linkedin,
      },
      {
        matcher: (id) => id.includes('birth') || id.includes('dob'),
        provider: () => this.fakeData.personal.dateOfBirth,
      },
    ];
  }

  private isPasswordField(identifiers: string): boolean {
    const passwordIndicators = [
      'password',
      'pass',
      'pwd',
      'confirm',
      'verify',
      'repeat',
    ];
    return passwordIndicators.some((indicator) =>
      identifiers.includes(indicator)
    );
  }

  process(): void {
    const selector =
      'input:not([type="radio"]):not([type="checkbox"]):not([type="file"]):not([type="button"]):not([type="submit"]):not([type="reset"])';
    const inputs = document.querySelectorAll(selector);

    inputs.forEach((input) => this.processInput(input as HTMLInputElement));
  }

  private processInput(input: HTMLInputElement): void {
    try {
      const identifier = DOMUtils.getElementIdentifier(input);
      this.logProcessing(input, identifier);

      const value = this.getInputValue(input, identifier);
      if (value) {
        DOMUtils.setInputValueWithReactSupport(input, value);
        this.filledCount++;
      }
    } catch (error) {
      this.handleError(
        error,
        `Failed to process input: ${DOMUtils.getElementIdentifier(input)}`
      );
    }
  }

  private getInputValue(input: HTMLInputElement, identifiers: string): string {
    // Check type-based values first
    const typeValue = this.getValueByType(input.type, identifiers);
    if (typeValue) return typeValue;

    // Check pattern-based matches
    for (const mapping of this.fieldMappings) {
      if (mapping.matcher(identifiers)) {
        return mapping.provider(identifiers);
      }
    }

    // Default fallback
    return `${this.fakeData.personal.firstName} ${this.fakeData.personal.lastName}`;
  }

  private getValueByType(type: string, identifiers: string): string | null {
    const typeHandlers: Record<string, () => string> = {
      email: () =>
        identifiers.includes('work')
          ? this.fakeData.personal.workEmail
          : this.fakeData.personal.email,
      tel: () =>
        identifiers.includes('emergency')
          ? this.fakeData.personal.emergencyPhone
          : this.fakeData.personal.phone,
      url: () =>
        identifiers.includes('linkedin')
          ? this.fakeData.professional.linkedin
          : this.fakeData.professional.website,
      date: () =>
        identifiers.includes('birth')
          ? this.fakeData.personal.dateOfBirth
          : DOMUtils.generateRandomDate(),
      time: () => '14:30',
      'datetime-local': () =>
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 16),
      color: () => '#3B82F6',
      range: () => '50',
      number: () => this.getNumberValue(identifiers),
    };

    return typeHandlers[type]?.() || null;
  }

  private getNumberValue(identifiers: string): string {
    if (identifiers.includes('age')) return this.fakeData.personal.age;
    if (identifiers.includes('salary') || identifiers.includes('income')) {
      return this.fakeData.professional.salary;
    }
    return '25';
  }
}
