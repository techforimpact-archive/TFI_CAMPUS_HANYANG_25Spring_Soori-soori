export type RepairCategory =
  | '구동장치'
  | '전자제어'
  | '제동장치'
  | '시트'
  | '발걸이'
  | '프레임'
  | '타이어 | 튜브'
  | '배터리'
  | '기타'

export const REPAIR_CATEGORIES: RepairCategory[] = [
  '구동장치',
  '전자제어',
  '제동장치',
  '시트',
  '발걸이',
  '프레임',
  '타이어 | 튜브',
  '배터리',
  '기타',
]

interface Repair {
  id?: string
  vehicleId?: string
  billingPrice?: number
  repairStationLabel?: string
  repairStationCode?: string
  repairCategories?: RepairCategory[]
  repairer?: string
  batteryVoltage?: number
  etcRepairParts?: string
  memo?: string
  isAccident?: boolean
  repairedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

export class RepairModel implements Repair {
  readonly id: string
  readonly vehicleId: string
  readonly billingPrice: number
  readonly repairStationLabel: string
  readonly repairStationCode: string
  readonly repairCategories: RepairCategory[]
  readonly repairer: string
  readonly batteryVoltage: number
  readonly etcRepairParts: string
  readonly memo: string
  readonly isAccident: boolean
  readonly repairedAt: Date
  readonly createdAt: Date
  readonly updatedAt: Date

  constructor(model: Repair) {
    this.id = model.id ?? ''
    this.vehicleId = model.vehicleId ?? ''
    this.billingPrice = model.billingPrice ?? 0
    this.repairStationLabel = model.repairStationLabel ?? ''
    this.repairStationCode = model.repairStationCode ?? ''
    this.repairCategories = model.repairCategories ?? []
    this.repairer = model.repairer ?? ''
    this.batteryVoltage = model.batteryVoltage ?? 0
    this.etcRepairParts = model.etcRepairParts ?? ''
    this.memo = model.memo ?? ''
    this.isAccident = model.isAccident ?? false
    this.repairedAt = new Date(model.repairedAt ?? new Date())
    this.createdAt = new Date(model.createdAt ?? new Date())
    this.updatedAt = new Date(model.updatedAt ?? new Date())
  }

  get repairedAtDisplayString(): string {
    return this.repairedAt.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  get billingPriceDisplayString(): string {
    return this.billingPrice.toLocaleString('ko-KR') + '원'
  }

  get type(): string {
    if (this.isAccident) {
      return 'accident'
    }
    return 'routine'
  }

  copyWith(changes: Partial<Repair>): RepairModel {
    return new RepairModel({
      ...this,
      ...changes,
      repairedAt: changes.repairedAt ? new Date(changes.repairedAt) : this.repairedAt,
      createdAt: changes.createdAt ? new Date(changes.createdAt) : this.createdAt,
      updatedAt: changes.updatedAt ? new Date(changes.updatedAt) : this.updatedAt,
    })
  }
}
