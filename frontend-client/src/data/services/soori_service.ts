import { AxiosHttpClientAdapter } from '../adapters/adapters'
import {
  RepairRepositorySoori,
  RepairStationRepositorySoori,
  SelfCheckRepositorySoori,
  UserRepositorySoori,
  VehicleRepositorySoori,
} from '../repositories/repositories'

const SOORI_BASE_URL = import.meta.env.VITE_SOORI_BASE_URL
const SECOND = 1000

export const httpClient = new AxiosHttpClientAdapter(SOORI_BASE_URL, {
  timeout: 10 * SECOND,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const userRepositorySoori = new UserRepositorySoori(httpClient)
export const repairStationRepositorySoori = new RepairStationRepositorySoori(httpClient)
export const repairRepositorySoori = new RepairRepositorySoori(httpClient)
export const vehicleRepositorySoori = new VehicleRepositorySoori(httpClient)
export const selfCheckRepositorySoori = new SelfCheckRepositorySoori(httpClient)
