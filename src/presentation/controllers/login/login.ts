import {
  Controller,
  Validator,
  Authentication,
  HttpRequest,
  HttpResponse,
  AuthParams
} from './login-protocols'
import {
  badRequest,
  serverError,
  success,
  unauthorized
} from '../../helpers/http-helper'

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
      const accessToken = await this.authentication.auth(
        httpRequest.body as AuthParams
      )
      if (!accessToken) {
        return unauthorized()
      }
      return success({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
