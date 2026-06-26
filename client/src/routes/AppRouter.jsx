import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { RootLayout } from '@/layouts/RootLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { PageLayout } from '@/layouts/PageLayout';

import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ComposePage } from '@/pages/compose/ComposePage';
import { TemplatesPage } from '@/pages/templates/TemplatesPage';
import { ResumesPage } from '@/pages/resumes/ResumesPage';
import { ContactsPage } from '@/pages/contacts/ContactsPage';
import { HistoryPage } from '@/pages/history/HistoryPage';
import { ScheduledPage } from '@/pages/scheduled/ScheduledPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { NotFoundPage } from '@/pages/errors/NotFoundPage';
import { UnauthorizedPage } from '@/pages/errors/UnauthorizedPage';

export function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <Navigate to={ROUTES.DASHBOARD} replace />
        }
      />
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </PublicRoute>
        }
      />

      {/* Protected routes with app shell */}
      <Route
        element={
          <ProtectedRoute>
            <RootLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <PageLayout>
              <DashboardPage />
            </PageLayout>
          }
        />
        <Route
          path={ROUTES.COMPOSE}
          element={
            <PageLayout>
              <ComposePage />
            </PageLayout>
          }
        />
        <Route
          path={ROUTES.TEMPLATES}
          element={
            <PageLayout>
              <TemplatesPage />
            </PageLayout>
          }
        />
        <Route
          path={ROUTES.RESUMES}
          element={
            <PageLayout>
              <ResumesPage />
            </PageLayout>
          }
        />
        <Route
          path={ROUTES.CONTACTS}
          element={
            <PageLayout>
              <ContactsPage />
            </PageLayout>
          }
        />
        <Route
          path={ROUTES.HISTORY}
          element={
            <PageLayout>
              <HistoryPage />
            </PageLayout>
          }
        />
        <Route
          path={ROUTES.SCHEDULED}
          element={
            <PageLayout>
              <ScheduledPage />
            </PageLayout>
          }
        />
        <Route
          path={ROUTES.SETTINGS}
          element={
            <PageLayout>
              <SettingsPage />
            </PageLayout>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <PageLayout>
              <ProfilePage />
            </PageLayout>
          }
        />
      </Route>

      {/* Error routes */}
      <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}