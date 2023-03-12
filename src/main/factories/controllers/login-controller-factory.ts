import {
  makeLoginValidator,
  makeDbAuthentication,
  makeLogControllerDecorator
} from '@/main/factories'
import { Controller } from '@/presentation/protocols'
import { LoginController } from '@/presentation/controllers'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeLoginValidator(),
    makeDbAuthentication()
  )
  return makeLogControllerDecorator(loginController)
}
