import {
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from '@/data/protocols'
import { AccountModel } from '@/domain/models'
import { AddAccount, AddAccountParams } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const accountExists = await this.loadAccountByEmailRepository.loadByEmail(
      accountData.email
    )
    if (accountExists) {
      return null
    }
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword })
    )
    return account
  }
}
