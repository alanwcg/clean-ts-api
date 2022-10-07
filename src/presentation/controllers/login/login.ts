import {
  Controller,
  EmailValidator,
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
import { InvalidParamError, MissingParamError } from '../../errors'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email } = httpRequest.body
      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
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
