import {
  Controller,
  Validator,
  AddAccount,
  HttpRequest,
  HttpResponse,
  Authentication
} from './signup-controller-protocols'
import { badRequest, forbidden, serverError, success } from '@/presentation/helpers/http/http-helper'
import { EmailInUseError } from '@/presentation/errors'

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
      if (!account) {
        return forbidden(new EmailInUseError())
      }
      const result = await this.authentication.auth({ email, password })
      return success(result)
    } catch (error) {
      return serverError(error)
    }
  }
}
