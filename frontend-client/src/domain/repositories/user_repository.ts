import { UserModel, VehicleModel } from '@/domain/models/models'

export interface CheckUserResponse {
  exists: boolean
  user?: UserModel
}

export interface UserRepository {
  checkUserExists(token: string): Promise<CheckUserResponse>
  signUp(token: string, user: UserModel, vehicle: VehicleModel, vehicleId?: string): Promise<UserModel>
  getUserRole(token: string): Promise<string>
}
