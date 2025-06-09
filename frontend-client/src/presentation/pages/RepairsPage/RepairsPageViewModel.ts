import { useEffect } from 'react'

import { makeAutoObservable, runInAction } from 'mobx'
import { useSearchParams } from 'react-router'

import { buildRoute } from '@/application/routers/routes'
import { RepairModel, VehicleModel } from '@/domain/models/models'
import { useRepairs, useUserRole, useVehicle } from '@/presentation/hooks/hooks'

export enum TabId {
  REPAIRS = 'repairs',
  VEHICLE = 'vehicle',
}

interface TabItem {
  id: TabId
  label: string
}

const tabItems: TabItem[] = [
  { id: TabId.REPAIRS, label: '정비 이력' },
  { id: TabId.VEHICLE, label: '전동보장구 정보' },
]

class RepairsStore {
  repairs: RepairModel[] = []
  vehicle: VehicleModel = new VehicleModel({})
  searchKeyword = ''
  activeTab: TabId = TabId.REPAIRS
  totalRepairsCount = 0
  repairBillingPriceSumThisMonth = 0
  fabExpended = false

  constructor() {
    makeAutoObservable(this)
  }

  get filteredRepairs() {
    return this.repairs
      .filter((repair) => {
        if (!this.searchKeyword) return true
        return repair.type.includes(this.searchKeyword) || repair.repairStationLabel.includes(this.searchKeyword)
      })
      .sort((a, b) => b.repairedAt.getTime() - a.repairedAt.getTime())
  }

  get totalRepairsCountDisplayString() {
    return this.totalRepairsCount.toLocaleString('ko-KR') + '회'
  }

  get repairBillingPriceSumThisMonthDisplayString() {
    return this.repairBillingPriceSumThisMonth.toLocaleString('ko-KR') + '원'
  }

  updateSearchKeyword = (term: string) => {
    this.searchKeyword = term
  }

  changeTab = (tabId: TabId) => {
    this.activeTab = tabId
  }

  toggleFab = () => {
    this.fabExpended = !this.fabExpended
  }

  setRepairs = (repairs: RepairModel[]) => {
    this.repairs = repairs
  }

  setVehicle = (vehicle: VehicleModel) => {
    this.vehicle = vehicle
  }

  calculateTotalRepairsCount = () => {
    this.totalRepairsCount = this.repairs.length
  }

  calculateRepairBillingPriceSumThisMonth = () => {
    const currentDate = new Date()
    this.repairBillingPriceSumThisMonth = this.repairs.reduce((sum, repair) => {
      if (
        repair.repairedAt.getFullYear() === currentDate.getFullYear() &&
        repair.repairedAt.getMonth() === currentDate.getMonth()
      ) {
        return sum + repair.billingPrice
      }
      return sum
    }, 0)
  }

  reset = () => {
    this.searchKeyword = ''
    this.activeTab = TabId.REPAIRS
    this.fabExpended = false
  }
}

const store = new RepairsStore()

export function useRepairsViewModel() {
  const [searchParams] = useSearchParams()
  const { isAdmin, isRepairer, isUser, isGuardian } = useUserRole()
  const vehicleId = searchParams.get('vehicleId') ?? ''

  const { repairs, isLoading: repairsLoading, isError: repairsError } = useRepairs({ vehicleId })
  const { vehicle, isLoading: vehicleLoading, isError: vehicleError } = useVehicle({ vehicleId })

  useEffect(() => {
    if (repairs.length > 0 && !repairsLoading && !repairsError) {
      runInAction(() => {
        store.setRepairs(repairs)
        store.calculateTotalRepairsCount()
        store.calculateRepairBillingPriceSumThisMonth()
      })
    }
  }, [repairs, repairsLoading, repairsError])

  useEffect(() => {
    if (vehicle && !vehicleLoading && !vehicleError) {
      runInAction(() => {
        store.setVehicle(vehicle)
      })
    }
  }, [vehicle, vehicleLoading, vehicleError])

  const buildRouteForRepairCreatePage = () => {
    return buildRoute('REPAIR_CREATE', {}, { vehicleId: vehicleId })
  }

  const buildRouteForRepairDetailPage = (repairId: string) => {
    return buildRoute('REPAIR_DETAIL', { id: repairId }, { vehicleId: vehicleId })
  }

  const buildRouteForRepairStationsPage = () => {
    return buildRoute('REPAIR_STATIONS', {}, { vehicleId: vehicleId })
  }

  const buildRouteForVehicleSelfCheckPage = () => {
    return buildRoute('VEHICLE_SELF_CHECK', {}, { vehicleId: vehicleId })
  }

  const shouldShowCTA = isAdmin || isRepairer
  const shouldShowFAB = isUser || isGuardian

  return {
    ...store,
    vehicleId,
    filteredRepairs: store.filteredRepairs,
    totalRepairsCountDisplayString: store.totalRepairsCountDisplayString,
    repairBillingPriceSumThisMonthDisplayString: store.repairBillingPriceSumThisMonthDisplayString,
    tabItems,
    buildRouteForRepairCreatePage,
    buildRouteForRepairDetailPage,
    buildRouteForRepairStationsPage,
    buildRouteForVehicleSelfCheckPage,
    isUser,
    shouldShowCTA,
    shouldShowFAB,
  }
}
