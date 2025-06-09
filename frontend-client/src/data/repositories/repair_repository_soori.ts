import { RepairModel } from '@/domain/models/models'
import { RepairRepository } from '@/domain/repositories/repositories'

import { HttpClientAdapter } from '../adapters/adapters'

export class RepairRepositorySoori implements RepairRepository {
  constructor(private readonly httpClient: HttpClientAdapter) {}

  async getRepairsByVehicleId(token: string, vehicleId: string): Promise<RepairModel[]> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await this.httpClient.get<{ repairs: RepairModel[] }>(`/vehicles/${vehicleId}/repairs`, config)
      return response.repairs.map((repair) => new RepairModel(repair))
    } catch (error) {
      console.error('전동보장구 수리 내역 조회 실패:', error)
      throw error
    }
  }

  async getRepairById(token: string, vehicleId: string, repairId: string): Promise<RepairModel> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await this.httpClient.get<RepairModel>(`/vehicles/${vehicleId}/repairs/${repairId}`, config)
      return new RepairModel(response)
    } catch (error) {
      console.error('수리 내역 상세 조회 실패:', error)
      throw error
    }
  }

  async createRepair(token: string, vehicleId: string, repair: RepairModel): Promise<void> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }

      const requestData = {
        repairedAt: repair.repairedAt.toISOString(),
        billingPrice: repair.billingPrice,
        isAccident: repair.isAccident,
        repairCategories: repair.repairCategories,
        batteryVoltage: repair.batteryVoltage || undefined,
        etcRepairParts: repair.etcRepairParts || undefined,
        memo: repair.memo || undefined,
      }

      await this.httpClient.post<RepairModel>(`/vehicles/${vehicleId}/repairs`, requestData, config)
    } catch (error) {
      console.error('수리 내역 등록 실패:', error)
      throw error
    }
  }
}
