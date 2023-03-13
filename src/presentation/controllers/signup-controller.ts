import { Controller, Validator, HttpResponse } from '@/presentation/protocols'
import {
  badRequest,
  forbidden,
  serverError,
  success
} from '@/presentation/helpers'
import { EmailInUseError } from '@/presentation/errors'
import { AddAccount, Authentication } from '@/domain/usecases'

export class SignUpController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly addAccount: AddAccount,
    private readonly authentication: Authentication
  ) {}

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = request
      const accountCreated = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!accountCreated) {
        return forbidden(new EmailInUseError())
      }
      const result = await this.authentication.auth({ email, password })
      return success(result)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }
}
