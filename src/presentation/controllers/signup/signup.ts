import {
  Controller,
  Validator,
  EmailValidator,
  AddAccount,
  HttpRequest,
  HttpResponse
} from './signup-protocols'
import { InvalidParamError } from '../../errors'
import { badRequest, serverError, success } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return success(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
