import { JSX, useEffect, useMemo } from 'react'

import { Navigate, useLocation, useNavigate } from 'react-router'

import { useLoading, useUserRole, useVehicle } from '@/presentation/hooks/hooks'

import { buildRoute } from './routes'

interface LocationState {
  from?: {
    pathname: string
    search?: string
  }
}

interface ProtectedRouteProps {
  children: JSX.Element
  requireAuth: boolean
}

function isLocationState(state: unknown): state is LocationState {
  return state !== null && typeof state === 'object' && 'from' in state
}

export const ProtectedRoute = ({ children, requireAuth }: ProtectedRouteProps) => {
  const { userRole, isLoading, isUser, isGuardian } = useUserRole()
  const { showLoading, hideLoading } = useLoading()
  const location = useLocation()
  const navigate = useNavigate()
  const { vehicle, isLoading: isVehicleLoading } = useVehicle()

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {}
    new URLSearchParams(location.search).forEach((value, key) => {
      params[key] = value
    })
    return params
  }, [location.search])

  const locationState = isLocationState(location.state) ? location.state : undefined

  useEffect(() => {
    if (isLoading || isVehicleLoading) {
      showLoading()
    } else {
      hideLoading()
    }
  }, [isLoading, isVehicleLoading, showLoading, hideLoading])

  useEffect(() => {
    if (!userRole || !vehicle || isVehicleLoading) return

    if (!isUser && !isGuardian) return

    const currentVehicleId = new URLSearchParams(location.search).get('vehicleId')

    if (vehicle.id && (!currentVehicleId || currentVehicleId !== vehicle.id)) {
      const updatedParams = { ...queryParams, vehicleId: vehicle.id }
      void navigate(
        {
          pathname: location.pathname,
          search: new URLSearchParams(updatedParams).toString(),
        },
        { replace: true }
      )
    }
  }, [
    userRole,
    vehicle,
    location.pathname,
    location.search,
    navigate,
    queryParams,
    isVehicleLoading,
    isUser,
    isGuardian,
  ])

  if (isLoading) return null

  if (requireAuth && !userRole) {
    return (
      <Navigate
        to={buildRoute('SIGN_IN')}
        replace
        state={{ from: { pathname: location.pathname, search: location.search } }}
      />
    )
  }

  if (!requireAuth && userRole) {
    if (locationState?.from?.pathname) {
      return <Navigate to={`${locationState.from.pathname}${locationState.from.search ?? ''}`} replace />
    } else {
      return <Navigate to={buildRoute('REPAIRS', {}, queryParams)} replace />
    }
  }

  return children
}
