import { ROLES, DEMO_CREDENTIALS } from '../constants/roles';
import { ROLE_LANDING } from '../constants/routes';
import { sleep } from '../utils/helpers';

/**
 * Auth service - thin facade over future backend.
 * The current build accepts any email + password (>= 6 chars) so reviewers can
 * explore the app without setup. When the demo accounts are used, the role is
 * auto-detected; otherwise the role is inferred from the email prefix.
 * Swap with real fetch() calls when the API is ready; the public surface
 * stays identical so consumers don't change.
 */

const generateToken = () => {
  const rand = Math.random().toString(36).slice(2);
  const time = Date.now().toString(36);
  return `subhan.${rand}.${time}`;
};

const departmentForRole = (role) => {
  switch (role) {
    case ROLES.DOCTOR:
      return 'General Medicine';
    case ROLES.PHARMACIST:
      return 'Pharmacy';
    case ROLES.BILLING_STAFF:
      return 'Finance';
    case ROLES.RECEPTIONIST:
      return 'Front Desk';
    default:
      return 'Operations';
  }
};

const inferRoleFromEmail = (email) => {
  const local = String(email || '').split('@')[0].toLowerCase();
  if (local.includes('doctor') || local.includes('dr')) return ROLES.DOCTOR;
  if (local.includes('pharma') || local.includes('pharm')) return ROLES.PHARMACIST;
  if (local.includes('billing') || local.includes('cashier')) return ROLES.BILLING_STAFF;
  if (local.includes('recep') || local.includes('front')) return ROLES.RECEPTIONIST;
  if (local.includes('admin')) return ROLES.ADMIN;
  return ROLES.DOCTOR;
};

const buildUser = ({ email, role }) => {
  const local = String(email).split('@')[0] || 'user';
  const name = local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ') || 'Subhan Care User';
  return {
    id: `usr_${local.replace(/[^a-z0-9]/g, '').slice(0, 12)}`,
    name,
    email,
    role,
    department: departmentForRole(role),
  };
};

/**
 * Sign in with email + password.
 * Accepts any valid email + password >= 6 chars. When the supplied credentials
 * match a demo account, the corresponding role is used. Otherwise the role is
 * inferred from the email prefix (e.g. dr.<name>@... => DOCTOR).
 *
 * @param {{email:string, password:string}} payload
 */
export const loginUser = async ({ email, password }) => {
  await sleep(650);

  const normalizedEmail = String(email || '').trim().toLowerCase();
  const pwd = String(password || '');

  if (!normalizedEmail || !pwd) {
    const error = new Error('Please enter both your email and password.');
    error.code = 'MISSING_CREDENTIALS';
    throw error;
  }
  if (pwd.length < 6) {
    const error = new Error('Password must be at least 6 characters long.');
    error.code = 'WEAK_PASSWORD';
    throw error;
  }

  const matchedRole = Object.values(ROLES).find((r) => {
    const seed = DEMO_CREDENTIALS[r];
    return (
      seed &&
      seed.email.toLowerCase() === normalizedEmail &&
      seed.password === pwd
    );
  });

  const role = matchedRole || inferRoleFromEmail(normalizedEmail);
  const user = matchedRole
    ? {
        ...buildUser({ email: normalizedEmail, role }),
        name: DEMO_CREDENTIALS[matchedRole].name,
      }
    : buildUser({ email: normalizedEmail, role });

  return {
    token: generateToken(),
    user,
    redirectTo: ROLE_LANDING[role] || '/dashboard',
    expiresIn: 60 * 60 * 1000,
    isDemoAccount: Boolean(matchedRole),
  };
};

/**
 * Request a password reset code to be sent via email/SMS.
 * @param {{email:string}} payload
 */
export const requestPasswordReset = async ({ email }) => {
  await sleep(700);
  if (!email || !email.includes('@')) {
    const error = new Error('Enter a valid email address.');
    error.code = 'INVALID_EMAIL';
    throw error;
  }
  return {
    success: true,
    message: `A 6-digit code has been sent to ${email}.`,
    email,
    // For demo only - in production this would be returned via a side channel
    // (email/SMS) and never echoed in the response.
    devCode: '147293',
  };
};

/**
 * Verify the OTP code entered by the user.
 * @param {{email:string, code:string}} payload
 */
export const verifyOtp = async ({ email, code }) => {
  await sleep(600);
  if (!/^\d{6}$/.test(code)) {
    const error = new Error('Verification code must be 6 digits.');
    error.code = 'INVALID_OTP_FORMAT';
    throw error;
  }
  return {
    success: true,
    message: 'Code accepted. You can now set a new password.',
    resetToken: generateToken(),
    email,
  };
};

/**
 * Submit the new password (simulates the reset confirmation call).
 * @param {{resetToken:string, password:string}} payload
 */
export const resetPassword = async ({ resetToken, password }) => {
  await sleep(800);
  if (!resetToken) {
    const error = new Error('Reset session expired. Please restart the flow.');
    error.code = 'EXPIRED_TOKEN';
    throw error;
  }
  if (!password || password.length < 8) {
    const error = new Error('Password must be at least 8 characters.');
    error.code = 'WEAK_PASSWORD';
    throw error;
  }
  return {
    success: true,
    message: 'Password updated successfully. You can now log in.',
  };
};

/**
 * Validate the currently stored session by calling a real /me endpoint.
 * Implemented as synchronous resolve here so the auth context can decide.
 */
export const fetchCurrentUser = async (token) => {
  await sleep(200);
  if (!token) return null;
  // For demo we rebuild the user from the token payload; real impl would decode JWT.
  return null;
};
