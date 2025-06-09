import { useEffect } from 'react'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { repairRepositorySoori } from '@/data/services/services'
import { RepairModel } from '@/domain/models/models'

import { useAuthState } from './useAuthState'
import { useLoading } from './useLoading'

interface UseRepairsProps {
  vehicleId: string
  repairId?: string
}

export const useRepairs = ({ vehicleId, repairId }: UseRepairsProps) => {
  const { user, loading: authLoading } = useAuthState()
  const { showLoading, hideLoading } = useLoading()
  const queryClient = useQueryClient()

  const repairsQuery = useQuery<RepairModel[]>({
    queryKey: ['repairs', vehicleId],
    queryFn: async () => {
      if (!user) throw new Error('로그인 후 이용 가능합니다')

      const token = await user.getIdToken()
      return await repairRepositorySoori.getRepairsByVehicleId(token, vehicleId)
    },
    enabled: !!vehicleId && !authLoading && !repairId,
  })

  const repairDetailQuery = useQuery<RepairModel>({
    queryKey: ['repair', vehicleId, repairId],
    queryFn: async () => {
      if (!user) throw new Error('로그인 후 이용 가능합니다')
      if (!repairId) throw new Error('수리내역 ID가 필요합니다')

      const token = await user.getIdToken()
      return await repairRepositorySoori.getRepairById(token, vehicleId, repairId)
    },
    enabled: !!vehicleId && !!repairId && !authLoading,
  })

  const createRepairMutation = useMutation({
    mutationFn: async (repair: RepairModel) => {
      if (!user) throw new Error('로그인 후 이용 가능합니다')

      const token = await user.getIdToken()
      await repairRepositorySoori.createRepair(token, vehicleId, repair)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['repairs', vehicleId] })
    },
  })

  const activeQuery = repairId ? repairDetailQuery : repairsQuery

  useEffect(() => {
    if (activeQuery.isLoading) showLoading()
    else hideLoading()
  }, [activeQuery.isLoading, showLoading, hideLoading])

  useEffect(() => {
    if (createRepairMutation.isPending) showLoading()
    else hideLoading()
  }, [createRepairMutation.isPending, showLoading, hideLoading])

  useEffect(() => {
    if (activeQuery.error) throw activeQuery.error
  }, [activeQuery.error])

  useEffect(() => {
    if (createRepairMutation.error) throw createRepairMutation.error
  }, [createRepairMutation.error])

  return {
    repairs: repairsQuery.data ?? [],
    repair: repairDetailQuery.data,
    isLoading: activeQuery.isLoading,
    isError: activeQuery.isError,
    error: activeQuery.error,
    createRepair: createRepairMutation.mutateAsync,
    isCreating: createRepairMutation.isPending,
    createError: createRepairMutation.error,
  }
}
