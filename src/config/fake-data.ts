// ==================== config/fake-data.ts ====================

import { FakeDataProfile } from '../types';

export const createFakeDataProfile = (): FakeDataProfile => ({
  personal: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    workEmail: 'john.doe@company.com',
    phone: '08012345678',
    emergencyPhone: '08087654321',
    age: '30',
    gender: 'male',
    dateOfBirth: '1990-01-01',
    bio: 'Experienced software developer with a passion for creating innovative solutions and building scalable applications.',
  },
  professional: {
    company: 'Tech Solutions Inc',
    jobTitle: 'Senior Software Developer',
    salary: '75000',
    website: 'https://johndoe.dev',
    linkedin: 'https://linkedin.com/in/johndoe',
  },
  address: {
    street: '123 Main Street',
    apartment: 'Apt 4B',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    zipCode: '100001',
  },
  security: {
    username: 'johndoe123',
    password: 'SecurePass123!',
  },
  payment: {
    ccNumber: '4532 1234 5678 9012',
    ccName: 'John Doe',
    ccExpiry: '12/26',
    ccCvv: '123',
  },
});
