import axios from 'axios'

import { UserModel, VehicleModel } from '@/domain/models/models'
import { CheckUserResponse, UserRepository } from '@/domain/repositories/repositories'

import { HttpClientAdapter } from '../adapters/adapters'

export class UserRepositorySoori implements UserRepository {
  private readonly baseUrl = '/users'

  constructor(private readonly httpClient: HttpClientAdapter) {}

  async checkUserExists(token: string): Promise<CheckUserResponse> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await this.httpClient.post<UserModel>(this.baseUrl, {}, config)
      return {
        exists: false,
        user: new UserModel(response),
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        return {
          exists: true,
        }
      }
      console.error('사용자 존재 확인 실패:', error)
      throw error
    }
  }

  async signUp(token: string, user: UserModel, vehicle: VehicleModel, vehicleId?: string): Promise<UserModel> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const userData = {
        name: user.name,
        model: vehicle.model,
        purchasedAt: vehicle.purchasedAt.toISOString(),
        manufacturedAt: vehicle.manufacturedAt.toISOString(),
        recipientType: user.recipientType,
        supportedDistrict: user.supportedDistrict,
        vehicleId: vehicleId,
      }

      const response = await this.httpClient.post<UserModel>(this.baseUrl, userData, config)
      return new UserModel(response)
    } catch (error) {
      console.error('회원가입 실패:', error)
      throw error
    }
  }

  async getUserRole(token: string): Promise<string> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await this.httpClient.get<{ role: string }>(`${this.baseUrl}/role`, config)
      return response.role
    } catch (error) {
      console.error('사용자 역할 조회 실패:', error)
      throw error
    }
  }
}
