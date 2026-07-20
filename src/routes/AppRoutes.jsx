import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import OtpVerificationPage from '../pages/auth/OtpVerificationPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import PatientsListPage from '../pages/dashboard/patients/PatientsListPage';
import PatientDetailPage from '../pages/dashboard/patients/PatientDetailPage';
import PatientHistoryPage from '../pages/dashboard/patients/PatientHistoryPage';
import DoctorsListPage from '../pages/dashboard/doctors/DoctorsListPage';
import DoctorDetailPage from '../pages/dashboard/doctors/DoctorDetailPage';
import AppointmentsPage from '../pages/dashboard/appointments/AppointmentsPage';
import AppointmentDetailPage from '../pages/dashboard/appointments/AppointmentDetailPage';
import BillingPage from '../pages/dashboard/billing/BillingPage';
import InvoiceReceiptPage from '../pages/dashboard/billing/InvoiceReceiptPage';
import OutstandingPaymentsPage from '../pages/dashboard/billing/OutstandingPaymentsPage';
import StaffPage from '../pages/dashboard/staff/StaffPage';
import PrescriptionsPage from '../pages/dashboard/prescriptions/PrescriptionsPage';
import PrescriptionDetailPage from '../pages/dashboard/prescriptions/PrescriptionDetailPage';
import InventoryPage from '../pages/dashboard/inventory/InventoryPage';
import ProfilePage from '../pages/dashboard/ProfilePage';
import SettingsPage from '../pages/dashboard/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';
import { ROUTES } from '../constants/routes';

/**
 * Centralized routing config.
 * Public auth flows -> AuthLayout
 * Protected app -> DashboardLayout with nested routes
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public, unauthenticated only */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicOnlyRoute>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </PublicOnlyRoute>
        }
      />
      <Route
        path={ROUTES.FORGOT_PASSWORD}
        element={
          <PublicOnlyRoute>
            <AuthLayout>
              <ForgotPasswordPage />
            </AuthLayout>
          </PublicOnlyRoute>
        }
      />
      <Route
        path={ROUTES.OTP_VERIFICATION}
        element={
          <AuthLayout>
            <OtpVerificationPage />
          </AuthLayout>
        }
      />
      <Route
        path={ROUTES.RESET_PASSWORD}
        element={
          <AuthLayout>
            <ResetPasswordPage />
          </AuthLayout>
        }
      />

      {/* Protected dashboard area */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />

        {/* Patients */}
        <Route path="patients" element={<PatientsListPage />} />
        <Route path="patients/new" element={<PatientsListPage />} />
        <Route path="patients/:id" element={<PatientDetailPage />} />
        <Route path="patients/:id/history" element={<PatientHistoryPage />} />

        {/* Doctors */}
        <Route path="doctors" element={<DoctorsListPage />} />
        <Route path="doctors/new" element={<DoctorsListPage />} />
        <Route path="doctors/:id" element={<DoctorDetailPage />} />

        {/* Appointments */}
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="appointments/calendar" element={<AppointmentsPage />} />
        <Route path="appointments/new" element={<AppointmentsPage />} />
        <Route path="appointments/:id" element={<AppointmentDetailPage />} />

        {/* Billing */}
        <Route path="billing" element={<BillingPage />} />
        <Route path="billing/new" element={<BillingPage />} />
        <Route path="billing/outstanding" element={<OutstandingPaymentsPage />} />
        <Route path="billing/:id" element={<InvoiceReceiptPage />} />

        {/* Prescriptions */}
        <Route path="prescriptions" element={<PrescriptionsPage />} />
        <Route path="prescriptions/new" element={<PrescriptionsPage />} />
        <Route path="prescriptions/:id" element={<PrescriptionDetailPage />} />

        {/* Inventory */}
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="inventory/new" element={<InventoryPage />} />

        {/* Staff */}
        <Route path="staff" element={<StaffPage />} />

        {/* Account */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;