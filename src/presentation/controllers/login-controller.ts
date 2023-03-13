import { Controller, Validator, HttpResponse } from '@/presentation/protocols'
import {
  badRequest,
  serverError,
  success,
  unauthorized
} from '@/presentation/helpers'
import { Authentication } from '@/domain/usecases'

export class LoginController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly authentication: Authentication
  ) {}

  async handle (request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = request
      const result = await this.authentication.auth({ email, password })
      if (!result) {
        return unauthorized()
      }
      return success(result)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoginController {
  export type Request = {
    email: string
    password: string
  }
}
