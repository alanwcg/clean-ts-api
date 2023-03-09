import { faker } from '@faker-js/faker'
import {
  AddAccount,
  AddAccountParams
} from '@/domain/usecases/account/add-account'
import {
  Authentication,
  AuthenticationParams
} from '@/domain/usecases/account/authentication'
import { AccountModel } from '@/domain/models/account'
import {
  LoadAccountByToken,
  LoadAccountByTokenParams
} from '@/domain/usecases/account/load-account-by-token'
import { mockAccountModel } from '@/domain/test'

export class AuthenticationSpy implements Authentication {
  params: AuthenticationParams
  result: string = faker.datatype.uuid()

  async auth (params: AuthenticationParams): Promise<string> {
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
