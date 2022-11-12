import {
  Middleware,
  LoadAccountByToken,
  HttpRequest,
  HttpResponse
} from './auth-middleware-protocols'
import { AccessDeniedError } from '../errors'
import { forbidden, success } from '../helpers/http/http-helper'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      const account = await this.loadAccountByToken.load(accessToken)
      if (account) {
        return success({ accountId: account.id })
      }
    }
    return forbidden(new AccessDeniedError())
  }
}
