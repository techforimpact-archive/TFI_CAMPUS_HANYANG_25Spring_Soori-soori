import { Auth, ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'

import { UseCase } from './use_case'

export interface AuthPhoneVerifyParams {
  auth: Auth
  phoneNumber: string
}

export const RECAPTCHA_VERIFIER_ID = 'recaptcha-verifier'

/**
 * 전화번호 인증 요청 UseCase
 *
 * 전화번호를 입력하면 Firebase에서 인증 코드를 SMS로 발송합니다.
 */
export class AuthPhoneVerifyUseCase implements UseCase<Promise<ConfirmationResult>, AuthPhoneVerifyParams> {
  /**
   * 전화번호 인증 요청
   * @param value 전화번호
   */
  async call(value: AuthPhoneVerifyParams): Promise<ConfirmationResult> {
    window.recaptcha?.clear()
    window.recaptcha = new RecaptchaVerifier(value.auth, RECAPTCHA_VERIFIER_ID, {
      size: 'invisible',
    })
    const confirmationResult = await signInWithPhoneNumber(value.auth, value.phoneNumber, window.recaptcha)
    return confirmationResult
  }
}
