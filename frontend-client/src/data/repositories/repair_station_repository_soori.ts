import { RepairStationModel } from '@/domain/models/models'
import { RepairStationRepository } from '@/domain/repositories/repair_station_repository'

import { HttpClientAdapter } from '../adapters/adapters'

export class RepairStationRepositorySoori implements RepairStationRepository {
  private readonly baseUrl = '/repairStations'

  constructor(private readonly httpClient: HttpClientAdapter) {}

  async getRepairStations(token: string): Promise<RepairStationModel[]> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await this.httpClient.get<{ stations: RepairStationModel[] }>(this.baseUrl, config)
      return response.stations
    } catch (error) {
      console.error('정비소 목록 조회 실패:', error)
      throw error
    }
  }
}
