import { RepairModel } from '@/domain/models/models'

export interface RepairRepository {
  getRepairsByVehicleId(token: string, vehicleId: string): Promise<RepairModel[]>
  getRepairById(token: string, vehicleId: string, repairId: string): Promise<RepairModel>
  createRepair(token: string, vehicleId: string, repair: RepairModel): Promise<void>
}
