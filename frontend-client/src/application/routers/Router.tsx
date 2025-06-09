import { lazy } from 'react'

import { createBrowserRouter } from 'react-router'

import { ErrorBoundary } from '@/presentation/components/ErrorBoundary'

import { ProtectedRoute } from './ProtectedRoutes'
import { ROUTES } from './routes'

const HomePage = lazy(() => import('@/presentation/pages/HomePage/HomePageView'))
const SignInPage = lazy(() => import('@/presentation/pages/SignInPage/SignInPageView'))
const RepairsPage = lazy(() => import('@/presentation/pages/RepairsPage/RepairsPageView'))
const RepairCreatePage = lazy(() => import('@/presentation/pages/RepairCreatePage/RepairCreatePageView'))
const RepairDetailPage = lazy(() => import('@/presentation/pages/RepairDetailPage/RepairDetailPageView'))
const RepairStationsPage = lazy(() => import('@/presentation/pages/RepairStationsPage/RepairStationsPageView'))
const VehicleSelfCheckPage = lazy(() => import('@/presentation/pages/VehicleSelfCheckPage/VehicleSelfCheckPageView'))
const VehicleSelfCheckDetailPage = lazy(
  () => import('@/presentation/pages/VehicleSelfCheckDetailPage/VehicleSelfCheckDetailPageView')
)

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <ProtectedRoute requireAuth={false}>
        <HomePage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.SIGN_IN,
    element: <SignInPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.REPAIRS,
    element: (
      <ProtectedRoute requireAuth={true}>
        <RepairsPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.REPAIR_CREATE,
    element: (
      <ProtectedRoute requireAuth={true}>
        <RepairCreatePage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.REPAIR_DETAIL,
    element: (
      <ProtectedRoute requireAuth={true}>
        <RepairDetailPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.REPAIR_STATIONS,
    element: (
      <ProtectedRoute requireAuth={true}>
        <RepairStationsPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.VEHICLE_SELF_CHECK,
    element: (
      <ProtectedRoute requireAuth={true}>
        <VehicleSelfCheckPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.VEHICLE_SELF_CHECK_DETAIL,
    element: (
      <ProtectedRoute requireAuth={true}>
        <VehicleSelfCheckDetailPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
])
