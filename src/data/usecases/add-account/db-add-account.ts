import {
  AddAccount,
  Encrypter,
  AddAccountRepository,
  AddAccountModel,
  AccountModel
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const encryptedPassword = await this.encrypter.encrypt(accountData.password)
    await this.addAccountRepository.add(
      Object.assign(accountData, { password: encryptedPassword })
    )
    return new Promise(resolve => resolve(null))
  }
}
