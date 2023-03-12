import {
  Controller,
  Validator,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols'
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
