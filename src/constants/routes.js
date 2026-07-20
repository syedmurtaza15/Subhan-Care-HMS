/**
 * Application route paths - central source of truth.
 * Keep naming lowercase + hyphenated for URL readability.
 */

export const ROUTES = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  OTP_VERIFICATION: '/otp-verification',
  RESET_PASSWORD: '/reset-password',

  DASHBOARD: '/dashboard',
  PATIENTS: '/dashboard/patients',
  DOCTORS: '/dashboard/doctors',
  APPOINTMENTS: '/dashboard/appointments',
  PRESCRIPTIONS: '/dashboard/prescriptions',
  BILLING: '/dashboard/billing',
  INVENTORY: '/dashboard/inventory',
  REPORTS: '/dashboard/reports',
  SETTINGS: '/dashboard/settings',
  PROFILE: '/dashboard/profile',
});

/**
 * Default landing page per role after login (per Trello Auth task: Role Redirect).
 */
export const ROLE_LANDING = Object.freeze({
  ADMIN: ROUTES.DASHBOARD,
  DOCTOR: ROUTES.DASHBOARD,
  RECEPTIONIST: ROUTES.APPOINTMENTS,
  PHARMACIST: ROUTES.INVENTORY,
  BILLING_STAFF: ROUTES.BILLING,
});
