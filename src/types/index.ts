// ==================== types/index.ts ====================

export interface FillResponse {
  readonly status: 'success' | 'error';
  readonly message: string;
  readonly fieldsFilled: number;
  readonly errors?: ReadonlyArray<string>;
}

export interface FakeDataProfile {
  readonly personal: PersonalInfo;
  readonly professional: ProfessionalInfo;
  readonly address: AddressInfo;
  readonly security: SecurityInfo;
  readonly payment: PaymentInfo;
}

export interface PersonalInfo {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly workEmail: string;
  readonly phone: string;
  readonly emergencyPhone: string;
  readonly age: string;
  readonly gender: string;
  readonly dateOfBirth: string;
  readonly bio: string;
}

export interface ProfessionalInfo {
  readonly company: string;
  readonly jobTitle: string;
  readonly salary: string;
  readonly website: string;
  readonly linkedin: string;
}

export interface AddressInfo {
  readonly street: string;
  readonly apartment: string;
  readonly city: string;
  readonly state: string;
  readonly country: string;
  readonly zipCode: string;
}

export interface SecurityInfo {
  readonly username: string;
  readonly password: string;
}

export interface PaymentInfo {
  readonly ccNumber: string;
  readonly ccName: string;
  readonly ccExpiry: string;
  readonly ccCvv: string;
}

export type FieldMatcher = (identifiers: string) => boolean;
export type ValueProvider = (identifiers: string) => string;

export interface FieldMapping {
  readonly matcher: FieldMatcher;
  readonly provider: ValueProvider;
}

export interface ProcessorResult {
  readonly filledCount: number;
  readonly errors: ReadonlyArray<string>;
}
