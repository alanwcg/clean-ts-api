import { Controller } from '../../../../../presentation/protocols'
import { LoginController } from '../../../../../presentation/controllers/login/login/login-controller'
import { makeLoginValidator } from './login-validator-factory'
import { makeDbAuthentication } from '../../../usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeLoginValidator(),
    makeDbAuthentication()
  )
  return makeLogControllerDecorator(loginController)
}
