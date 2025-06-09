interface Event {
  id?: string
  title?: string
  description?: string
  fatal?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export class EventModel implements Event {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly fatal: boolean
  readonly createdAt: Date
  readonly updatedAt: Date

  constructor(model: Event) {
    this.id = model.id ?? ''
    this.title = model.title ?? ''
    this.description = model.description ?? ''
    this.fatal = model.fatal ?? false
    this.createdAt = new Date(model.createdAt ?? new Date())
    this.updatedAt = new Date(model.updatedAt ?? new Date())
  }

  copyWith(changes: Partial<Event>): EventModel {
    return new EventModel({
      ...this,
      ...changes,
      createdAt: changes.createdAt ? new Date(changes.createdAt) : this.createdAt,
      updatedAt: changes.updatedAt ? new Date(changes.updatedAt) : this.updatedAt,
    })
  }
}
