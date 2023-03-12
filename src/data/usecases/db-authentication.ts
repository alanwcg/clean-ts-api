import {
  Encrypter,
  HashComparer,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols'
import { AuthenticationModel } from '@/domain/models'
import { Authentication, AuthenticationParams } from '@/domain/usecases'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
    const { email, password } = authentication
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
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
    const { id, name } = account
    const accessToken = await this.encrypter.encrypt(id)
    await this.updateAccessTokenRepository.updateAccessToken({ id, accessToken })
    return {
      accessToken,
      name
    }
  }
}
