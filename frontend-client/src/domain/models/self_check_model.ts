interface SelfCheck {
  id?: string
  // 구동장치 관련
  motorNoise?: boolean
  abnormalSpeed?: boolean
  // 전자제어 관련
  batteryBlinking?: boolean
  chargingNotStart?: boolean
  // 제동장치 관련
  breakDelay?: boolean
  breakPadIssue?: boolean
  // 타이어&튜브 관련
  tubePunctureFrequent?: boolean
  tireWearFrequent?: boolean
  // 배터리 관련
  batteryDischargeFast?: boolean
  incompleteCharging?: boolean
  // 시트 관련
  seatUnstable?: boolean
  seatCoverIssue?: boolean
  // 발걸이 관련
  footRestLoose?: boolean
  antislipWorn?: boolean
  // 프레임 관련
  frameNoise?: boolean
  frameCrack?: boolean

  createdAt?: Date
  updatedAt?: Date
}

export class SelfCheckModel implements SelfCheck {
  readonly id: string
  readonly motorNoise: boolean
  readonly abnormalSpeed: boolean
  readonly batteryBlinking: boolean
  readonly chargingNotStart: boolean
  readonly breakDelay: boolean
  readonly breakPadIssue: boolean
  readonly tubePunctureFrequent: boolean
  readonly tireWearFrequent: boolean
  readonly batteryDischargeFast: boolean
  readonly incompleteCharging: boolean
  readonly seatUnstable: boolean
  readonly seatCoverIssue: boolean
  readonly footRestLoose: boolean
  readonly antislipWorn: boolean
  readonly frameNoise: boolean
  readonly frameCrack: boolean
  readonly createdAt: Date
  readonly updatedAt: Date

  constructor(model: SelfCheck) {
    this.id = model.id ?? ''
    this.motorNoise = model.motorNoise ?? false
    this.abnormalSpeed = model.abnormalSpeed ?? false
    this.batteryBlinking = model.batteryBlinking ?? false
    this.chargingNotStart = model.chargingNotStart ?? false
    this.breakDelay = model.breakDelay ?? false
    this.breakPadIssue = model.breakPadIssue ?? false
    this.tubePunctureFrequent = model.tubePunctureFrequent ?? false
    this.tireWearFrequent = model.tireWearFrequent ?? false
    this.batteryDischargeFast = model.batteryDischargeFast ?? false
    this.incompleteCharging = model.incompleteCharging ?? false
    this.seatUnstable = model.seatUnstable ?? false
    this.seatCoverIssue = model.seatCoverIssue ?? false
    this.footRestLoose = model.footRestLoose ?? false
    this.antislipWorn = model.antislipWorn ?? false
    this.frameNoise = model.frameNoise ?? false
    this.frameCrack = model.frameCrack ?? false
    this.createdAt = new Date(model.createdAt ?? new Date())
    this.updatedAt = new Date(model.updatedAt ?? new Date())
  }

  get createdAtDisplayString(): string {
    return this.createdAt.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  get driveIssueCount(): number {
    return (this.motorNoise ? 1 : 0) + (this.abnormalSpeed ? 1 : 0)
  }

  get controlIssueCount(): number {
    return (this.batteryBlinking ? 1 : 0) + (this.chargingNotStart ? 1 : 0)
  }

  get brakeIssueCount(): number {
    return (this.breakDelay ? 1 : 0) + (this.breakPadIssue ? 1 : 0)
  }

  get tireIssueCount(): number {
    return (this.tubePunctureFrequent ? 1 : 0) + (this.tireWearFrequent ? 1 : 0)
  }

  get batteryIssueCount(): number {
    return (this.batteryDischargeFast ? 1 : 0) + (this.incompleteCharging ? 1 : 0)
  }

  get seatIssueCount(): number {
    return (this.seatUnstable ? 1 : 0) + (this.seatCoverIssue ? 1 : 0)
  }

  get footrestIssueCount(): number {
    return (this.footRestLoose ? 1 : 0) + (this.antislipWorn ? 1 : 0)
  }

  get frameIssueCount(): number {
    return (this.frameNoise ? 1 : 0) + (this.frameCrack ? 1 : 0)
  }

  get totalIssueCount(): number {
    return (
      this.driveIssueCount +
      this.controlIssueCount +
      this.brakeIssueCount +
      this.tireIssueCount +
      this.batteryIssueCount +
      this.seatIssueCount +
      this.footrestIssueCount +
      this.frameIssueCount
    )
  }

  get problemCategories(): { count: number; name: string }[] {
    const categories = [
      { count: this.driveIssueCount, name: '구동장치' },
      { count: this.controlIssueCount, name: '전자제어' },
      { count: this.brakeIssueCount, name: '제동장치' },
      { count: this.tireIssueCount, name: '타이어&튜브' },
      { count: this.batteryIssueCount, name: '배터리' },
      { count: this.seatIssueCount, name: '시트' },
      { count: this.footrestIssueCount, name: '발걸이' },
      { count: this.frameIssueCount, name: '프레임' },
    ]
    return categories.filter((category) => category.count > 0)
  }

  get resultDisplayString(): string {
    const problemCategories = this.problemCategories

    if (problemCategories.length === 0) {
      return '･ 발견된 문제가 없어요'
    }

    if (problemCategories.length === 1) {
      return `･ ${problemCategories[0].name} 항목에서 문제가 발견됐어요`
    }

    problemCategories.sort((a, b) => b.count - a.count)

    const otherCount = problemCategories.length - 1
    return `･ ${problemCategories[0].name} 외 ${otherCount.toString()}개 항목에서 문제가 발견됐어요`
  }

  copyWith(changes: Partial<SelfCheck>): SelfCheckModel {
    return new SelfCheckModel({
      ...this,
      ...changes,
      createdAt: changes.createdAt ? new Date(changes.createdAt) : this.createdAt,
      updatedAt: changes.updatedAt ? new Date(changes.updatedAt) : this.updatedAt,
    })
  }
}
