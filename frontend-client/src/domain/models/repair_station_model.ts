interface RepairStation {
  id?: string
  code?: string
  label?: string
  state?: string
  city?: string
  region?: string
  address?: string
  telephone?: string
  coordinate?: number[]
  createdAt?: Date
  updatedAt?: Date
}

export class RepairStationModel implements RepairStation {
  readonly id: string
  readonly code: string
  readonly label: string
  readonly state: string
  readonly city: string
  readonly region: string
  readonly address: string
  readonly telephone: string
  readonly coordinate: number[]
  readonly createdAt: Date
  readonly updatedAt: Date

  constructor(model: RepairStation) {
    this.id = model.id ?? ''
    this.code = model.code ?? ''
    this.label = model.label ?? ''
    this.state = model.state ?? ''
    this.city = model.city ?? ''
    this.region = model.region ?? ''
    this.address = model.address ?? ''
    this.telephone = model.telephone ?? ''
    this.coordinate = model.coordinate ?? []
    this.createdAt = new Date(model.createdAt ?? new Date())
    this.updatedAt = new Date(model.updatedAt ?? new Date())
  }

  copyWith(changes: Partial<RepairStation>): RepairStationModel {
    return new RepairStationModel({
      ...this,
      ...changes,
      createdAt: changes.createdAt ? new Date(changes.createdAt) : this.createdAt,
      updatedAt: changes.updatedAt ? new Date(changes.updatedAt) : this.updatedAt,
    })
  }
}
