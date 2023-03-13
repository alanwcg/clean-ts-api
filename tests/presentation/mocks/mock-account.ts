import { faker } from '@faker-js/faker'
import {
  AddAccount,
  Authentication,
  LoadAccountByToken
} from '@/domain/usecases'
import { mockAccountModel } from '@/tests/domain/mocks'

export class AuthenticationSpy implements Authentication {
  params: Authentication.Params
  result: Authentication.Result = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.fullName()
  }

  async auth (params: Authentication.Params): Promise<Authentication.Result> {
    this.params = params
    return this.result
  }
}

export class AddAccountSpy implements AddAccount {
  params: AddAccount.Params
  result: AddAccount.Result = true

  async add (params: AddAccount.Params): Promise<AddAccount.Result> {
    this.params = params
    return this.result
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  params: LoadAccountByToken.Params
  result: LoadAccountByToken.Result = mockAccountModel()

  async load (
    params: LoadAccountByToken.Params
  ): Promise<LoadAccountByToken.Result> {
    this.params = params
    return this.result
  }
}
