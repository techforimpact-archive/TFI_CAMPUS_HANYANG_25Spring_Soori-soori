import { makeAutoObservable } from 'mobx'
import { useNavigate, useSearchParams } from 'react-router'

import { buildRoute } from '@/application/routers/routes'
import { RepairCategory, RepairModel } from '@/domain/models/models'
import { useRepairs, useUserRole } from '@/presentation/hooks/hooks'

class RepairCreateStore {
  repairModel: RepairModel = new RepairModel({})

  constructor() {
    makeAutoObservable(this)
  }

  dateInputFormatString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year.toString()}-${month}-${day}`
  }

  billingPriceInputFormatString = (billingPrice: number): string => {
    return billingPrice.toLocaleString('ko-KR')
  }

  parseBillingPrice = (value: string): number => {
    return Number(value.replace(/,/g, ''))
  }

  get valid(): boolean {
    const batteryFieldValid = !this.hasBattery || this.repairModel.batteryVoltage > 0
    const etcFieldValid = !this.hasEtc || this.repairModel.etcRepairParts.trim() !== ''

    return Boolean(
      this.repairModel.type !== '' &&
        this.repairModel.billingPrice >= 0 &&
        this.repairModel.repairCategories.length > 0 &&
        batteryFieldValid &&
        etcFieldValid
    )
  }

  get hasBattery(): boolean {
    return this.repairModel.repairCategories.includes('배터리')
  }

  get hasEtc(): boolean {
    return this.repairModel.repairCategories.includes('기타')
  }

  updateIsAccident = (isAccident: boolean) => {
    this.repairModel = this.repairModel.copyWith({
      isAccident: isAccident,
    })
  }

  updateRepairDate = (value: string) => {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      this.repairModel = this.repairModel.copyWith({
        repairedAt: new Date(),
      })
      return
    }
    this.repairModel = this.repairModel.copyWith({
      repairedAt: date,
    })
  }

  updateBillingPrice = (value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '')
    const numericValue = cleanValue ? parseInt(cleanValue, 10) : 0

    this.repairModel = this.repairModel.copyWith({
      billingPrice: numericValue,
    })
  }

  updateBatteryVoltage = (value: string) => {
    const numericValue = value.trim() ? parseFloat(value) : 0
    this.repairModel = this.repairModel.copyWith({
      batteryVoltage: numericValue,
    })
  }

  updateEtcRepairParts = (value: string) => {
    this.repairModel = this.repairModel.copyWith({
      etcRepairParts: value,
    })
  }

  updateMemo = (value: string) => {
    this.repairModel = this.repairModel.copyWith({
      memo: value,
    })
  }

  toggleCategory = (category: RepairCategory) => {
    const currentRepairCategories = [...this.repairModel.repairCategories]
    const categoryIndex = currentRepairCategories.indexOf(category)

    if (categoryIndex >= 0) {
      currentRepairCategories.splice(categoryIndex, 1)
    } else {
      currentRepairCategories.push(category)
    }

    this.repairModel = this.repairModel.copyWith({
      repairCategories: currentRepairCategories,
    })
  }

  categorySelected = (category: RepairCategory): boolean => {
    return this.repairModel.repairCategories.includes(category)
  }

  resetForm = () => {
    this.repairModel = new RepairModel({})
  }
}
const store = new RepairCreateStore()

export function useRepairCreateViewModel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isUser, isGuardian } = useUserRole()
  const vehicleId = searchParams.get('vehicleId') ?? ''
  const { createRepair, isCreating } = useRepairs({ vehicleId })

  const submitRepair = async () => {
    if (!store.valid) return
    if (isUser || isGuardian) {
      alert('정비사항은 관리자만 등록할 수 있습니다.')
      return
    }

    try {
      const repairToCreate = store.repairModel.copyWith({
        vehicleId: vehicleId,
      })

      await createRepair(repairToCreate)
      alert('정비사항이 저장되었습니다.')
      store.resetForm()
      goBack()
    } catch (error) {
      console.error('수리 등록 실패:', error)
      alert('정비사항 저장에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const goBack = () => {
    void navigate(buildRoute('REPAIRS', {}, { vehicleId: vehicleId }))
  }

  return {
    ...store,
    vehicleId,
    valid: store.valid,
    hasBattery: store.hasBattery,
    hasEtc: store.hasEtc,
    submitRepair,
    goBack,
    isSubmitting: isCreating,
  }
}
