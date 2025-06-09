import { VehicleModel } from '@/domain/models/models'
import { VehicleRepository } from '@/domain/repositories/repositories'

import { HttpClientAdapter } from '../adapters/adapters'

interface VehicleApiResponse {
  vehicleId: string
  userId: string
  model: string
  purchasedAt: string
  manufacturedAt: string
}

export class VehicleRepositorySoori implements VehicleRepository {
  private readonly baseUrl = '/vehicles'
  constructor(private readonly httpClient: HttpClientAdapter) {}

  async getUserVehicle(token: string): Promise<VehicleModel> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await this.httpClient.get<VehicleApiResponse>(`${this.baseUrl}/me`, config)

      return new VehicleModel({
        id: response.vehicleId,
        model: response.model,
        purchasedAt: new Date(response.purchasedAt),
        manufacturedAt: new Date(response.manufacturedAt),
      })
    } catch (error) {
      console.error('전동보장구 정보 조회 실패:', error)
      throw error
    }
  }

  async getVehicleById(vehicleId: string, token: string): Promise<VehicleModel> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await this.httpClient.get<VehicleApiResponse>(`${this.baseUrl}/${vehicleId}`, config)

      return new VehicleModel({
        id: response.vehicleId,
        model: response.model,
        purchasedAt: new Date(response.purchasedAt),
        manufacturedAt: new Date(response.manufacturedAt),
      })
    } catch (error) {
      console.error('전동보장구 정보 조회 실패:', error)
      throw error
    }
  }
}
