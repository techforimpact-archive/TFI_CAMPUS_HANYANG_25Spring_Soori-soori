import { SelfCheckModel } from '@/domain/models/models'
import { SelfCheckRepository } from '@/domain/repositories/repositories'

import { HttpClientAdapter } from '../adapters/adapters'

export class SelfCheckRepositorySoori implements SelfCheckRepository {
  private readonly baseUrl = '/vehicles'
  constructor(private readonly httpClient: HttpClientAdapter) {}

  async createSelfCheck(vehicleId: string, selfCheck: SelfCheckModel, token: string): Promise<SelfCheckModel> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }

      const requestData = {
        motorNoise: selfCheck.motorNoise,
        abnormalSpeed: selfCheck.abnormalSpeed,
        batteryBlinking: selfCheck.batteryBlinking,
        chargingNotStart: selfCheck.chargingNotStart,
        breakDelay: selfCheck.breakDelay,
        breakPadIssue: selfCheck.breakPadIssue,
        tubePunctureFrequent: selfCheck.tubePunctureFrequent,
        tireWearFrequent: selfCheck.tireWearFrequent,
        batteryDischargeFast: selfCheck.batteryDischargeFast,
        incompleteCharging: selfCheck.incompleteCharging,
        seatUnstable: selfCheck.seatUnstable,
        seatCoverIssue: selfCheck.seatCoverIssue,
        footRestLoose: selfCheck.footRestLoose,
        antislipWorn: selfCheck.antislipWorn,
        frameNoise: selfCheck.frameNoise,
        frameCrack: selfCheck.frameCrack,
      }

      const response = await this.httpClient.post<{ success: boolean }>(
        `${this.baseUrl}/${vehicleId}/selfCheck`,
        requestData,
        config
      )

      if (response.success) {
        return selfCheck
      } else {
        throw new Error('자가점검 저장 실패')
      }
    } catch (error) {
      console.error('자가점검 저장 실패:', error)
      throw error
    }
  }

  async getSelfChecks(vehicleId: string, token: string): Promise<SelfCheckModel[]> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }

      const response = await this.httpClient.get<{ selfChecks: SelfCheckModel[] }>(
        `${this.baseUrl}/${vehicleId}/selfCheck`,
        config
      )

      return response.selfChecks.map((selfCheck) => new SelfCheckModel(selfCheck))
    } catch (error) {
      console.error('자가점검 정보 조회 실패:', error)
      throw error
    }
  }

  async getSelfCheck(vehicleId: string, selfCheckId: string, token: string): Promise<SelfCheckModel> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }

      const response = await this.httpClient.get<SelfCheckModel>(
        `${this.baseUrl}/${vehicleId}/selfCheck/${selfCheckId}`,
        config
      )

      return new SelfCheckModel(response)
    } catch (error) {
      console.error('자가점검 상세 정보 조회 실패:', error)
      throw error
    }
  }
}
