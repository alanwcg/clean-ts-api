import {
  Hasher,
  AddAccountRepository,
  CheckAccountByEmailRepository
} from '@/data/protocols'
import { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository,
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (params: AddAccount.Params): Promise<AddAccount.Result> {
    const accountExists = await this.checkAccountByEmailRepository.checkByEmail(
      params.email
    )
    if (accountExists) {
      return false
    }
    const hashedPassword = await this.hasher.hash(params.password)
    const accountCreated = await this.addAccountRepository.add({
      ...params,
      password: hashedPassword
    }
    )
    return accountCreated
  }
}
