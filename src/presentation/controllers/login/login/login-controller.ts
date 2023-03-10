import {
  Controller,
  Validator,
  Authentication,
  HttpRequest,
  HttpResponse
} from './login-controller-protocols'
import {
  badRequest,
  serverError,
  success,
  unauthorized
} from '@/presentation/helpers/http/http-helper'

export class LoginController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
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
