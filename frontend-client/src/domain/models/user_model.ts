export type UserRole = 'user' | 'admin' | 'repairer' | 'guardian'

export type RecipientType = '일반' | '수급' | '차상위' | '미등록'

export type SupportedDistrict =
  | '강남구'
  | '강동구'
  | '강북구'
  | '강서구'
  | '관악구'
  | '광진구'
  | '구로구'
  | '금천구'
  | '노원구'
  | '도봉구'
  | '동대문구'
  | '동작구'
  | '마포구'
  | '서대문구'
  | '서초구'
  | '성동구'
  | '성북구'
  | '송파구'
  | '양천구'
  | '영등포구'
  | '용산구'
  | '은평구'
  | '종로구'
  | '중구'
  | '중랑구'
  | '서울 외'

interface User {
  id?: string
  firebaseUid?: string
  phoneNumber?: string
  role?: UserRole
  guardianIds?: string[]
  name?: string
  recipientType?: RecipientType
  supportedDistrict?: SupportedDistrict
  createdAt?: Date
  updatedAt?: Date
}

export class UserModel implements User {
  readonly id: string
  readonly firebaseUid: string
  readonly phoneNumber: string
  readonly role: UserRole
  readonly guardianIds: string[]
  readonly name: string
  readonly recipientType: RecipientType
  readonly supportedDistrict: SupportedDistrict
  readonly createdAt: Date
  readonly updatedAt: Date

  constructor(model: User) {
    this.id = model.id ?? ''
    this.firebaseUid = model.firebaseUid ?? ''
    this.phoneNumber = model.phoneNumber ?? ''
    this.role = model.role ?? 'user'
    this.guardianIds = model.guardianIds ?? []
    this.name = model.name ?? ''
    this.recipientType = model.recipientType ?? '일반'
    this.supportedDistrict = model.supportedDistrict ?? '성동구'
    this.createdAt = new Date(model.createdAt ?? new Date())
    this.updatedAt = new Date(model.updatedAt ?? new Date())
  }

  get isUser(): boolean {
    return this.role === 'user'
  }

  get isAdmin(): boolean {
    return this.role === 'admin'
  }

  get isRepairer(): boolean {
    return this.role === 'repairer'
  }

  get isGuardian(): boolean {
    return this.role === 'guardian'
  }

  get hasGuardians(): boolean {
    return this.guardianIds.length > 0
  }

  copyWith(changes: Partial<User>): UserModel {
    return new UserModel({
      ...this,
      ...changes,
      createdAt: changes.createdAt ? new Date(changes.createdAt) : this.createdAt,
      updatedAt: changes.updatedAt ? new Date(changes.updatedAt) : this.updatedAt,
    })
  }
}
