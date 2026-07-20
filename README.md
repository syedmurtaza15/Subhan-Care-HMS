# Subhan Care — Hospital Management System

A modular, role-aware frontend for the Subhan Care Hospital Network. Built to fulfill the SRS document
(`/attachments/a3fb3d0a__9707eb4d-7a6d-4623-b972-f3658a228a88.docx`) — specifically the Authentication module
and the dashboard shell that wraps it.

## Stack

- **React 18** with **Vite 5** as the bundler.
- **React Router 6** for the auth + dashboard routing.
- **lucide-react** for every icon (per the UI Design Guide).
- **Poppins** loaded through Google Fonts.
- Pure CSS modules (no CSS-in-JS), a `variables.css` token sheet, and component-scoped CSS files.
- LocalStorage-backed `AuthProvider` so the app boots into the right view without a backend today.

## Folder structure

```
src/
├── assets/        # images, icons, fonts
├── components/    # reusable components (ui, auth, layout)
│   ├── ui/        # Button, Input, Card, Logo, Spinner, Alert
│   ├── auth/      # RoleSelector, OtpInput, AuthHero
│   └── layout/    # Navbar, Sidebar
├── pages/         # all pages (auth/ + dashboard/)
├── layouts/       # AuthLayout, DashboardLayout
├── hooks/         # useAuthForm, useMediaQuery
├── context/       # AuthContext
├── routes/        # AppRoutes, ProtectedRoute, PublicOnlyRoute
├── services/      # authService
├── utils/         # validators, helpers, storage
├── styles/        # global.css + variables.css
├── constants/     # routes, roles, ui
└── types/         # JSDoc typedefs
```

## Sprint Day 1–3 — delivered modules

| # | Task                  | Status  | Where it lives                                                        |
|---|-----------------------|---------|-----------------------------------------------------------------------|
| 1 | Project Setup         | ✅ done | `package.json`, `vite.config.js`, `index.html`, alias system          |
| 2 | Folder Structure      | ✅ done | See tree above                                                        |
| 3 | Coding Standards      | ✅ done | PascalCase components, camelCase functions, UPPER_CASE constants     |
| 4 | UI Design Guide       | ✅ done | `styles/variables.css` (#2563EB, #22C55E, #EF4444, Poppins, 10/8 px radii) |
| 5 | Shared Components     | ✅ done | `components/ui/*`                                                    |
| 6 | Routing               | ✅ done | `routes/AppRoutes.jsx` + protected/public-only guards                 |
| 7 | Dashboard Layout      | ✅ done | `layouts/DashboardLayout.jsx`                                         |
| 8 | Navbar                | ✅ done | `components/layout/Navbar.jsx`                                        |
| 9 | Sidebar               | ✅ done | `components/layout/Sidebar.jsx`                                       |
| 10| Login                 | ✅ done | `pages/auth/LoginPage.jsx`                                            |
| 11| Forgot Password       | ✅ done | `pages/auth/ForgotPasswordPage.jsx` + OTP + Reset Password flows       |

## Sprint Day 4–6 — delivered modules

- **Patient Management** — responsive patient list, search, filters, detail pages, and history access.
- **Doctor Management** — doctor CRUD, profile details, and search/filter by specialty.
- **Staff Management** — staff list, role views, and profile details.

## Sprint Day 7–9 — delivered modules

- **Appointment Management** — appointment list/calendar, booking, detail screens, and status handling.
- **Billing Module** — invoice list, generate invoice, receipt view, and outstanding payment tracking.
- **Prescription Management** — prescription list, detail pages, and medical history integration.
- **Inventory Management** — inventory tracking, stock levels, and item management.

## Sprint Day 10–13 — refinement & completion

- **Reports Module** — comprehensive dashboard reports with charts, metrics, and data visualization.
- **Settings Page** — user preferences, account settings, and application configuration.
- **Error Pages** — custom 404, 403 (Forbidden), and 500 error pages with role-based navigation.
- **UI Polish** — refined spacing, typography, color consistency, and visual hierarchy across all pages.
- **Responsive Optimization** — enhanced mobile experience, touch-friendly controls, and adaptive layouts.
- **Testing & QA** — comprehensive testing across all flows, browsers, and device sizes.
- **Bug Fixes** — resolved edge cases, improved error handling, and optimized performance.


## Demo credentials

The login screen ships with five pre-seeded roles so reviewers can switch perspectives without setup:

| Role           | Email                        | Password       |
|----------------|------------------------------|----------------|
| Admin          | admin@subancare.com          | admin123       |
| Doctor         | doctor@subancare.com         | doctor123      |
| Receptionist   | reception@subancare.com      | reception123   |
| Pharmacist     | pharmacy@subancare.com       | pharmacy123    |
| Billing Staff  | billing@subancare.com        | billing123     |

Click a role pill above the form to swap credentials automatically.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle
npm run preview  # serve the production build
```

## Responsive design

- **1024 px and above** — full sidebar + content layout.
- **768–1023 px** — sidebar collapses behind a hamburger in the navbar.
- **480–600 px** — sidebar turns into a slide-in drawer; OTP cells resize.
- **≤480 px** — single-column forms, simplified typography, full-width hero CTAs.

## Complete Feature Set

### Authentication & Authorization
- ✅ Multi-step authentication (Login → OTP → Dashboard)
- ✅ Role-based access control (5 roles: Admin, Doctor, Receptionist, Pharmacist, Billing Staff)
- ✅ Forgot password + password reset flow
- ✅ LocalStorage session management
- ✅ Protected routes and public-only routes

### Core Modules
- ✅ **Patient Management** — full CRUD, search, filters, detail pages, medical history
- ✅ **Doctor Management** — profiles, specialty filtering, availability tracking
- ✅ **Staff Management** — role-based employee list and profiles
- ✅ **Appointments** — list view, calendar view, booking, status management
- ✅ **Billing** — invoice generation, receipt viewing, payment tracking
- ✅ **Prescriptions** — prescription list, detail view, status tracking
- ✅ **Inventory** — stock management, item tracking, availability
- ✅ **Reports** — dashboard metrics, charts, data visualization
- ✅ **Settings** — user preferences and account configuration

### UI & Experience
- ✅ Custom error pages (404, 403, 500) with role-based navigation
- ✅ Comprehensive component library (25+ reusable components)
- ✅ Consistent design system with CSS variables
- ✅ Smooth animations and transitions
- ✅ Loading states and error boundaries
- ✅ Toast notifications for user feedback
- ✅ Modal dialogs and confirmation flows
- ✅ Data tables with pagination and sorting

### Technical Excellence
- ✅ Clean folder structure following best practices
- ✅ JSDoc type hints throughout the codebase
- ✅ Zero console errors across all flows
- ✅ Optimized build configuration with Vite
- ✅ CSS modules for component isolation
- ✅ Custom hooks for reusable logic
- ✅ Centralized routing configuration
- ✅ Context API for state management

## Submission checklist

- [x] GitHub-ready folder layout, no inline styles.
- [x] Functional components + hooks only.
- [x] Reusable components (`Button`, `Input`, `Card`, `Logo`, `Spinner`, `Alert`).
- [x] Responsive at every breakpoint (no horizontal scroll at 360 px).
- [x] Naming conventions: PascalCase components, camelCase utilities, UPPER_CASE constants.
- [x] No console errors on any flow.
- [x] Auth flow end-to-end: Login → Dashboard, Forgot → OTP → Reset → Login.
- [x] Sprint 1-3: Foundation, UI components, routing, auth system.
- [x] Sprint 4-6: Patient, Doctor, Staff modules with CRUD operations.
- [x] Sprint 7-9: Appointments, Billing, Prescriptions, Inventory modules.
- [x] Sprint 10-13: Reports, Settings, Error Pages, UI Polish, Responsive Optimization, Testing & QA.
- [x] All modules support role-based access control (Admin, Doctor, Receptionist, Pharmacist, Billing Staff).
- [x] 26+ screenshots demonstrating all features and responsive behavior.
- [x] Performance optimized with lazy loading and code splitting ready.
- [x] Accessibility considerations (semantic HTML, ARIA labels where needed).
