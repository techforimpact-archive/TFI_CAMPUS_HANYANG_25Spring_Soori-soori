import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'

import { vehicleRepositorySoori } from '@/data/services/services'
import { VehicleModel } from '@/domain/models/models'

import { useAuthState } from './useAuthState'
import { useLoading } from './useLoading'

interface UseVehicleParams {
  vehicleId?: string
}

export const useVehicle = ({ vehicleId }: UseVehicleParams = {}) => {
  const { user, loading: authLoading } = useAuthState()
  const { showLoading, hideLoading } = useLoading()

  const query = useQuery<VehicleModel>({
    queryKey: ['vehicles', vehicleId],
    queryFn: async () => {
      if (!user) throw new Error('로그인 후 이용 가능합니다')

      const token = await user.getIdToken()

      if (vehicleId) {
        return await vehicleRepositorySoori.getVehicleById(vehicleId, token)
      } else {
        return await vehicleRepositorySoori.getUserVehicle(token)
      }
    },
    enabled: !authLoading && !!user,
  })

  useEffect(() => {
    if (query.isLoading) showLoading()
    else hideLoading()
  }, [query.isLoading, showLoading, hideLoading])

  useEffect(() => {
    if (query.error) throw query.error
  }, [query.error])

  return {
    vehicle: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}
