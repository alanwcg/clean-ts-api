import { faker } from '@faker-js/faker'
import { AccountModel, AuthenticationModel } from '@/domain/models'
import {
  AddAccount,
  AddAccountParams,
  Authentication,
  AuthenticationParams,
  LoadAccountByToken,
  LoadAccountByTokenParams
} from '@/domain/usecases'
import { mockAccountModel } from '@/tests/domain/mocks'

export class AuthenticationSpy implements Authentication {
  params: AuthenticationParams
  result: AuthenticationModel = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.fullName()
  }

  async auth (params: AuthenticationParams): Promise<AuthenticationModel> {
    this.params = params
    return this.result
  }
}

export class AddAccountSpy implements AddAccount {
  params: AddAccountParams
  result: AccountModel = mockAccountModel()

  async add (params: AddAccountParams): Promise<AccountModel | null> {
    this.params = params
    return this.result
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  params: LoadAccountByTokenParams
  result: AccountModel = mockAccountModel()

  async load (params: LoadAccountByTokenParams): Promise<AccountModel | null> {
    this.params = params
    return this.result
  }
}
