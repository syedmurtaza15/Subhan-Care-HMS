/**
 * User roles defined per SRS Section 9 - Role-Permission Matrix.
 * Keep role strings in UPPER_CASE to match API contract.
 */

export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  RECEPTIONIST: 'RECEPTIONIST',
  PHARMACIST: 'PHARMACIST',
  BILLING_STAFF: 'BILLING_STAFF',
});

export const ROLE_LABEL = Object.freeze({
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.DOCTOR]: 'Doctor',
  [ROLES.RECEPTIONIST]: 'Receptionist',
  [ROLES.PHARMACIST]: 'Pharmacist',
  [ROLES.BILLING_STAFF]: 'Billing Staff',
});

/**
 * Demo accounts pre-seeded for the Authentication module preview.
 * The real backend will replace this with API-driven credentials.
 */
export const DEMO_CREDENTIALS = Object.freeze({
  [ROLES.ADMIN]: {
    email: 'admin@subancare.com',
    password: 'admin123',
    name: 'Ayesha Khan',
  },
  [ROLES.DOCTOR]: {
    email: 'doctor@subancare.com',
    password: 'doctor123',
    name: 'Dr. Hamza Iqbal',
  },
  [ROLES.RECEPTIONIST]: {
    email: 'reception@subancare.com',
    password: 'reception123',
    name: 'Fatima Riaz',
  },
  [ROLES.PHARMACIST]: {
    email: 'pharmacy@subancare.com',
    password: 'pharmacy123',
    name: 'Bilal Ahmed',
  },
  [ROLES.BILLING_STAFF]: {
    email: 'billing@subancare.com',
    password: 'billing123',
    name: 'Hina Tariq',
  },
});
