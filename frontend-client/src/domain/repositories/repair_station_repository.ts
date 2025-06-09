import { RepairStationModel } from '@/domain/models/models'

export interface RepairStationRepository {
  getRepairStations(token: string): Promise<RepairStationModel[]>
}
