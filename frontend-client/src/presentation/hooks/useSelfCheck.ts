import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { selfCheckRepositorySoori } from '@/data/services/services'
import { SelfCheckModel } from '@/domain/models/models'

import { useAuthState } from './useAuthState'
import { useLoading } from './useLoading'

interface UseSelfCheckParams {
  vehicleId: string
  selfCheckId?: string
}

export const useSelfCheck = ({ vehicleId, selfCheckId }: UseSelfCheckParams) => {
  const { user, loading: authLoading } = useAuthState()
  const { showLoading, hideLoading } = useLoading()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const listQuery = useQuery<SelfCheckModel[]>({
    queryKey: ['selfChecks', vehicleId],
    queryFn: async () => {
      if (!user) throw new Error('로그인 후 이용 가능합니다')

      const token = await user.getIdToken()
      return await selfCheckRepositorySoori.getSelfChecks(vehicleId, token)
    },
    enabled: !!vehicleId && !authLoading && !selfCheckId,
  })

  const detailQuery = useQuery<SelfCheckModel>({
    queryKey: ['selfCheck', vehicleId, selfCheckId],
    queryFn: async () => {
      if (!user) throw new Error('로그인 후 이용 가능합니다')
      if (!selfCheckId) throw new Error('자가점검 ID가 필요합니다')

      const token = await user.getIdToken()
      return await selfCheckRepositorySoori.getSelfCheck(vehicleId, selfCheckId, token)
    },
    enabled: !!vehicleId && !!selfCheckId && !authLoading,
  })

  useEffect(() => {
    if (selfCheckId ? detailQuery.isLoading : listQuery.isLoading) showLoading()
    else hideLoading()
  }, [listQuery.isLoading, detailQuery.isLoading, showLoading, hideLoading, selfCheckId])

  const createSelfCheck = async (selfCheckData: SelfCheckModel): Promise<SelfCheckModel | null> => {
    if (!user || !vehicleId) return null

    try {
      setLoading(true)
      setError(null)

      const token = await user.getIdToken()
      const result = await selfCheckRepositorySoori.createSelfCheck(vehicleId, selfCheckData, token)
      return result
    } catch (e) {
      const err = e instanceof Error ? e : new Error('자가점검 데이터 저장 중 오류가 발생했습니다.')
      setError(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const currentError = selfCheckId ? detailQuery.error : listQuery.error
    if (currentError) throw currentError
  }, [listQuery.error, detailQuery.error, selfCheckId])

  const refreshSelfChecks = () => {
    void listQuery.refetch()
  }

  const refreshSelfCheckDetail = () => {
    if (selfCheckId) {
      void detailQuery.refetch()
    }
  }

  return {
    createSelfCheck,
    loading,
    error,
    selfCheck: detailQuery.data ?? new SelfCheckModel({}),
    selfChecks: listQuery.data ?? [],
    refreshSelfChecks,
    refreshSelfCheckDetail,
  }
}
