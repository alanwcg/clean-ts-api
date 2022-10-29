import {
  Controller,
  Validator,
  AddAccount,
  HttpRequest,
  HttpResponse,
  Authentication
} from './signup-controller-protocols'
import { badRequest, serverError, success } from '../../helpers/http/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly addAccount: AddAccount,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      await this.authentication.auth({ email, password })
      return success(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
