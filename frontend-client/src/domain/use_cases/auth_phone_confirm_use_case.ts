import { ConfirmationResult, User } from 'firebase/auth'

import { UseCase } from './use_case'

export interface AuthPhoneConfirmParams {
  verificationCode: string
  confirmationResult: ConfirmationResult
}

/**
 * 전화번호 인증 코드 확인 UseCase
 *
 * 사용자가 받은 인증 코드를 확인하여 Firebase 로그인을 완료합니다.
 */
export class AuthPhoneConfirmUseCase implements UseCase<Promise<User | null>, AuthPhoneConfirmParams> {
  /**
   * 인증 코드 확인
   * @param value 인증 코드와 이전에 받은 confirmationResult 객체
   */
  async call(value: AuthPhoneConfirmParams): Promise<User | null> {
    const userCredential = await value.confirmationResult.confirm(value.verificationCode)
    return userCredential.user
  }
}
