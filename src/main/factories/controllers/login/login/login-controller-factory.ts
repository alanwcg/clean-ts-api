import { makeLoginValidator } from './login-validator-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { Controller } from '@/presentation/protocols'
import { LoginController } from '@/presentation/controllers/login/login/login-controller'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeLoginValidator(),
    makeDbAuthentication()
  )
  return makeLogControllerDecorator(loginController)
}
