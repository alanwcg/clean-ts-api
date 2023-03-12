import {
  makeSignUpValidator,
  makeDbAuthentication,
  makeDbAddAccount,
  makeLogControllerDecorator
} from '@/main/factories'
import { Controller } from '@/presentation/protocols'
import { SignUpController } from '@/presentation/controllers'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(
    makeSignUpValidator(),
    makeDbAddAccount(),
    makeDbAuthentication()
  )
  return makeLogControllerDecorator(signUpController)
}
