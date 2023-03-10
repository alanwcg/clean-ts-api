import {
  LoadAccountByToken,
  Decrypter,
  LoadAccountByTokenRepository,
  LoadAccountByTokenParams,
  AccountModel
} from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load ({
    accessToken,
    role
  }: LoadAccountByTokenParams): Promise<AccountModel> {
    let token: string
    try {
      token = await this.decrypter.decrypt(accessToken)
    } catch {
      return null
    }
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken({
        token: accessToken,
        role
      })
      if (account) {
        return account
      }
    }
    return null
  }
}
