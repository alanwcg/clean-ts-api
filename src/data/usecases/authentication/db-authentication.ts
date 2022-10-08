import { AuthenticationModel } from '../../../domain/usecases/authentication'
import {
  Authentication,
  LoadAccountByEmailRepository,
  HashComparer,
  TokenGenerator,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication
    const account = await this.loadAccountByEmailRepository.load(email)
    if (!account) {
      return null
    }
    const isPasswordValid = await this.hashComparer.compare({
      value: password,
      hash: account.password
    })
    if (!isPasswordValid) {
      return null
    }
    const { id } = account
    const accessToken = await this.tokenGenerator.generate(id)
    await this.updateAccessTokenRepository.update({ id, accessToken })
    return accessToken
  }
}
