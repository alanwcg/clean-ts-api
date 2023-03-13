import {
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from '@/data/protocols'
import { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const accountExists = await this.loadAccountByEmailRepository.loadByEmail(
      accountData.email
    )
    if (accountExists) {
      return false
    }
    const hashedPassword = await this.hasher.hash(accountData.password)
    await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    }
    )
    return true
  }
}
