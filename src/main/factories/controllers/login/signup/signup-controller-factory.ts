import { makeSignUpValidator } from './signup-validator-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory'
import { makeDbAddAccount } from '@/main/factories/usecases/account/add-account/db-add-account-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { Controller } from '@/presentation/protocols'
import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(
    makeSignUpValidator(),
    makeDbAddAccount(),
    makeDbAuthentication()
  )
  return makeLogControllerDecorator(signUpController)
}
