import { useEffect } from 'react'

import { makeAutoObservable } from 'mobx'
import { useNavigate, useParams, useSearchParams } from 'react-router'

import { buildRoute } from '@/application/routers/routes'
import { RepairModel } from '@/domain/models/repair_model'
import { useRepairs } from '@/presentation/hooks/hooks'

class RepairDetailStore {
  repairModel: RepairModel | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setRepairModel = (repair: RepairModel) => {
    this.repairModel = repair
  }

  get billingPriceDisplayString(): string {
    return this.repairModel?.billingPriceDisplayString ?? '0원'
  }
}

const store = new RepairDetailStore()

export function useRepairDetailViewModel() {
  const navigate = useNavigate()
  const { id: repairId } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const vehicleId = searchParams.get('vehicleId') ?? ''

  console.log('RepairDetailViewModel - vehicleId:', vehicleId, 'repairId:', repairId)

  const { repair, isLoading, isError } = useRepairs({ vehicleId, repairId: repairId ?? '' })

  console.log('RepairDetailViewModel - repair:', repair, 'isLoading:', isLoading, 'isError:', isError)

  // useEffect를 사용해서 안전하게 store 업데이트
  useEffect(() => {
    if (repair) {
      console.log('RepairDetailViewModel - Setting repair model:', repair)
      store.setRepairModel(repair)
    }
  }, [repair])

  const goBack = () => {
    void navigate(buildRoute('REPAIRS', {}, { vehicleId: vehicleId }))
  }

  return {
    ...store,
    repairModel: store.repairModel,
    billingPriceDisplayString: store.billingPriceDisplayString,
    isLoading,
    isError,
    goBack,
  }
}
