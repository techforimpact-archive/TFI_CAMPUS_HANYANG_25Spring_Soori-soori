import { VehicleModel } from '@/domain/models/models'

export interface VehicleRepository {
  getUserVehicle(token: string): Promise<VehicleModel>
  getVehicleById(vehicleId: string, token: string): Promise<VehicleModel>
}
