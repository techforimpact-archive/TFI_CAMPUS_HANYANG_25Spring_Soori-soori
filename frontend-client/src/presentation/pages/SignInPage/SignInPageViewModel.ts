import { ConfirmationResult, getAuth, User as FirebaseUser } from 'firebase/auth'
import { makeAutoObservable, runInAction } from 'mobx'
import { useNavigate, useSearchParams } from 'react-router'

import { buildRoute } from '@/application/routers/routers'
import { userRepositorySoori } from '@/data/services/services'
import { EventModel, RecipientType, SupportedDistrict, UserModel, VehicleModel } from '@/domain/models/models'
import { AuthPhoneVerifyUseCase, AuthPhoneConfirmUseCase, EventCreateUseCase } from '@/domain/use_cases/use_cases'
import { useLoading } from '@/presentation/hooks/hooks'

const authPhoneVerifyUseCase = new AuthPhoneVerifyUseCase()
const authPhoneConfirmUseCase = new AuthPhoneConfirmUseCase()
const eventCreateUseCase = new EventCreateUseCase()

const EXPIRATION_TIME = 300
const VERIFICATION_CODE_LENGTH = 6

const RECIPIENT_TYPES: RecipientType[] = ['일반', '수급', '차상위', '미등록']

const SUPPORTED_DISTRICTS: SupportedDistrict[] = [
  '강남구',
  '강동구',
  '강북구',
  '강서구',
  '관악구',
  '광진구',
  '구로구',
  '금천구',
  '노원구',
  '도봉구',
  '동대문구',
  '동작구',
  '마포구',
  '서대문구',
  '서초구',
  '성동구',
  '성북구',
  '송파구',
  '양천구',
  '영등포구',
  '용산구',
  '은평구',
  '종로구',
  '중구',
  '중랑구',
  '서울 외',
]

class SignInStore {
  phoneNumber = ''
  verificationCode = ''
  confirmationResult: ConfirmationResult | null = null
  expirationTime = EXPIRATION_TIME
  verificationError: string | null = null
  verificationRequestError: string | null = null
  verified = false
  userExists = false
  userChecked = false
  userModel: UserModel = new UserModel({})
  vehicleModel: VehicleModel = new VehicleModel({})
  firebaseUser: FirebaseUser | null = null
  firebaseToken = ''

  private timerIntervalId: number | null = null

  constructor() {
    makeAutoObservable(this)
  }

  get recipientTypeOptions(): RecipientType[] {
    return RECIPIENT_TYPES
  }

  get supportedDistrictOptions(): string[] {
    return SUPPORTED_DISTRICTS
  }

  get validPhoneNumber() {
    return /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/.test(this.phoneNumber.replace(/-/g, ''))
  }

  get validVerificationCode() {
    return /^\d{6}$/.test(this.verificationCode)
  }

  get needToSignUp() {
    return this.verified && this.userChecked && !this.userExists
  }

  get verificationCodeRequested() {
    return this.confirmationResult !== null
  }

  get timerActive() {
    return this.timerIntervalId !== null && this.expirationTime > 0 && !this.verified
  }

  get timerExpired() {
    return this.expirationTime <= 0
  }

  get validName() {
    return this.userModel.name.length > 0
  }

  get validModel() {
    return this.vehicleModel.model.length > 0
  }

  get validPurchasedAt() {
    return this.vehicleModel.purchasedAt instanceof Date
  }

  get validManufacturedAt() {
    return this.vehicleModel.manufacturedAt instanceof Date
  }

  get validSignupForm() {
    return this.validName && this.validModel && this.validPurchasedAt && this.validManufacturedAt
  }

  dateInputFormatString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year.toString()}-${month}-${day}`
  }

  get errorMessage() {
    if (this.timerExpired) {
      return '인증시간이 만료됐어요'
    }
    return this.verificationError
  }

  get canRequestVerification() {
    return this.validPhoneNumber && !this.verificationCodeRequested && !this.verificationRequestError
  }

  get canVerifyCode() {
    return this.validVerificationCode && !this.timerExpired && !this.verified && this.verificationCodeRequested
  }

  get expirationTimeDisplayString() {
    const seconds = this.expirationTime
    const minutes = Math.floor(seconds / 60).toString()
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0')
    return `${minutes}:${remainingSeconds}`
  }

  get expirationTimeScreenReaderString() {
    const seconds = this.expirationTime
    const minutes = Math.floor(seconds / 60).toString()
    const remainingSeconds = (seconds % 60).toString()
    return `${minutes}분 ${remainingSeconds}초 남음`
  }

  handlePhoneInputKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    showLoading: () => void,
    hideLoading: () => void
  ) => {
    if (e.key === 'Enter' && this.canRequestVerification) {
      e.preventDefault()
      await this.requestVerification(showLoading, hideLoading)
    }
  }

  handleVerificationCodeKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    showLoading: () => void,
    hideLoading: () => void,
    onComplete?: () => void
  ) => {
    if (e.key === 'Enter' && this.canVerifyCode) {
      e.preventDefault()
      await this.verifyCode(showLoading, hideLoading, onComplete)
    }
  }

  updatePhoneNumber = (phoneNumber: string) => {
    if (this.verificationCodeRequested) return
    this.phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
  }

  updateVerificationCode = async (
    code: string,
    showLoading: () => void,
    hideLoading: () => void,
    onComplete?: () => void
  ) => {
    const newCode = code.replace(/[^0-9]/g, '').slice(0, VERIFICATION_CODE_LENGTH)
    this.verificationCode = newCode
    this.verificationError = null

    if (newCode.length === VERIFICATION_CODE_LENGTH && this.canVerifyCode) {
      await this.verifyCode(showLoading, hideLoading, onComplete)
    }
  }

  updateName = (name: string) => {
    this.userModel = this.userModel.copyWith({ name })
  }

  updateModel = (model: string) => {
    this.vehicleModel = this.vehicleModel.copyWith({ model })
  }

  updatePurchasedAt = (purchasedAt: string) => {
    const date = new Date(purchasedAt)
    if (isNaN(date.getTime())) {
      this.vehicleModel = this.vehicleModel.copyWith({ purchasedAt: new Date() })
      return
    }

    this.vehicleModel = this.vehicleModel.copyWith({ purchasedAt: date })
  }

  updateManufacturedAt = (manufacturedAt: string) => {
    const date = new Date(manufacturedAt)
    if (isNaN(date.getTime())) {
      this.vehicleModel = this.vehicleModel.copyWith({ manufacturedAt: new Date() })
      return
    }

    this.vehicleModel = this.vehicleModel.copyWith({ manufacturedAt: date })
  }

  updateRecipientType = (recipientType: string) => {
    this.userModel = this.userModel.copyWith({ recipientType: recipientType as RecipientType })
  }

  updateSupportedDistrict = (supportedDistrict: string) => {
    this.userModel = this.userModel.copyWith({ supportedDistrict: supportedDistrict as SupportedDistrict })
  }

  async requestVerification(showLoading: () => void, hideLoading: () => void) {
    if (!this.canRequestVerification) return

    showLoading()

    try {
      const formattedPhoneNumber = '+82' + this.phoneNumber.replace(/-/g, '')
      const auth = getAuth()

      const result = await authPhoneVerifyUseCase.call({
        auth,
        phoneNumber: formattedPhoneNumber,
      })

      runInAction(() => {
        this.confirmationResult = result
        this.verificationRequestError = null
        this.startTimer()
      })
      const successEvent = new EventModel({ title: '인증번호 발송 성공', description: this.phoneNumber })
      void eventCreateUseCase.call(successEvent)
    } catch (error) {
      this.verificationRequestError = '인증번호 요청에 실패했습니다. 다시 시도해주세요.'
      const failEvent = new EventModel({
        title: '인증번호 발송 실패',
        description: `${this.phoneNumber}\n${String(error)}`,
        fatal: true,
      })
      void eventCreateUseCase.call(failEvent)
    } finally {
      hideLoading()
    }
  }

  async verifyCode(showLoading: () => void, hideLoading: () => void, onVerified?: () => void) {
    if (!this.canVerifyCode) return

    showLoading()

    try {
      const user = await authPhoneConfirmUseCase.call({
        verificationCode: this.verificationCode,
        confirmationResult: this.confirmationResult!,
      })

      this.stopTimer()

      runInAction(() => {
        this.verified = !!user
        this.firebaseUser = user
        if (!user) {
          this.verificationError = '인증번호를 다시 확인해주세요'
          this.verified = false
          return
        }
      })

      void this.getTokenAndCheckUser(showLoading, hideLoading, onVerified)
    } catch {
      runInAction(() => {
        this.verificationError = '인증번호를 다시 확인해주세요'
        this.verified = false
      })
    } finally {
      hideLoading()
    }
  }

  async getTokenAndCheckUser(showLoading: () => void, hideLoading: () => void, onUserChecked?: () => void) {
    if (this.firebaseUser === null) return

    showLoading()

    try {
      const firebaseToken = await this.firebaseUser.getIdToken()
      const checkResult = await userRepositorySoori.checkUserExists(firebaseToken)

      runInAction(() => {
        this.firebaseToken = firebaseToken
        this.userExists = checkResult.exists
        this.userChecked = true
      })

      if (this.userExists && onUserChecked) {
        onUserChecked()
      }
    } catch {
      this.verificationError = '사용자 확인에 실패했습니다. 다시 시도해주세요.'
      this.userChecked = false
    } finally {
      hideLoading()
    }
  }

  async signUp(showLoading: () => void, hideLoading: () => void, vehicleId?: string, onSignUpCompleted?: () => void) {
    if (!this.firebaseToken || !this.validSignupForm) return
    if (!vehicleId) {
      alert('전동보장구에 부착된 QR코드 스캔 후 회원가입을 진행해주세요')
      return
    }

    showLoading()

    try {
      await userRepositorySoori.signUp(this.firebaseToken, this.userModel, this.vehicleModel, vehicleId)

      runInAction(() => {
        this.userExists = true
      })

      if (onSignUpCompleted) {
        onSignUpCompleted()
      }
    } catch {
      const signUpFailEvent = new EventModel({
        title: '회원가입 실패',
        description: `이름: ${this.userModel.name}, 전화번호: ${this.phoneNumber}, 모델: ${this.vehicleModel.model}, 구매일: ${this.dateInputFormatString(
          this.vehicleModel.purchasedAt
        )}, 제조일: ${this.dateInputFormatString(this.vehicleModel.manufacturedAt)}, 수급자 유형: ${this.userModel.recipientType}, 지원 자치구: ${this.userModel.supportedDistrict}, vehicleId: ${vehicleId}`,
        fatal: true,
      })
      void eventCreateUseCase.call(signUpFailEvent)
    } finally {
      hideLoading()
    }
  }

  startTimer = () => {
    this.stopTimer()
    this.expirationTime = EXPIRATION_TIME
    this.timerIntervalId = window.setInterval(() => {
      runInAction(() => {
        this.expirationTime -= 1
        if (this.expirationTime <= 0) this.stopTimer()
      })
    }, 1000)
  }

  stopTimer = () => {
    clearInterval(this.timerIntervalId ?? undefined)
    this.timerIntervalId = null
  }

  init = () => {
    this.cleanup()
    if (this.verificationCodeRequested && !this.verified && this.expirationTime > 0) this.startTimer()
  }

  cleanup = () => {
    this.stopTimer()
  }

  reset = () => {
    this.phoneNumber = ''
    this.verificationCode = ''
    this.confirmationResult = null
    this.expirationTime = EXPIRATION_TIME
    this.verificationRequestError = null
    this.verificationError = null
    this.verified = false
    this.userExists = false
    this.userChecked = false
    this.userModel = new UserModel({})
    this.vehicleModel = new VehicleModel({})
    this.firebaseUser = null
    this.firebaseToken = ''
    this.cleanup()
  }
}

const store = new SignInStore()

export function useSignInViewModel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const vehicleId = searchParams.get('vehicleId') ?? ''
  const { showLoading, hideLoading } = useLoading()

  const goToRepairsPage = () => {
    void navigate(buildRoute('REPAIRS', {}, { vehicleId: vehicleId }))
  }

  const goBack = () => {
    void navigate(buildRoute('HOME', {}, { vehicleId: vehicleId }))
  }

  return {
    ...store,
    requestVerification: () => store.requestVerification(showLoading, hideLoading),
    verifyCode: () => store.verifyCode(showLoading, hideLoading, goToRepairsPage),
    updateVerificationCode: (code: string) =>
      store.updateVerificationCode(code, showLoading, hideLoading, goToRepairsPage),
    handlePhoneInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
      store.handlePhoneInputKeyDown(e, showLoading, hideLoading),
    handleVerificationCodeKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
      store.handleVerificationCodeKeyDown(e, showLoading, hideLoading, goToRepairsPage),
    signUp: () => store.signUp(showLoading, hideLoading, vehicleId, goToRepairsPage),
    goBack,
    goToRepairsPage,
    recipientTypeOptions: store.recipientTypeOptions,
    supportedDistrictOptions: store.supportedDistrictOptions,
    validPhoneNumber: store.validPhoneNumber,
    validVerificationCode: store.validVerificationCode,
    needToSignUp: store.needToSignUp,
    verificationCodeRequested: store.verificationCodeRequested,
    timerActive: store.timerActive,
    timerExpired: store.timerExpired,
    validSignupForm: store.validSignupForm,
    errorMessage: store.errorMessage,
    canRequestVerification: store.canRequestVerification,
    canVerifyCode: store.canVerifyCode,
    expirationTimeDisplayString: store.expirationTimeDisplayString,
    expirationTimeScreenReaderString: store.expirationTimeScreenReaderString,
    VERIFICATION_CODE_LENGTH,
  }
}
