import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  LoadByTokenParams,
  UpdateAccessTokenRepository,
  UpdateParams
} from '@/data/protocols'
import { AccountModel } from '@/domain/models'
import { AddAccountParams } from '@/domain/usecases'
import { mockAccountModel } from '@/tests/domain/mocks'

export class AddAccountRepositorySpy implements AddAccountRepository {
  params: AddAccountParams
  result: AccountModel = mockAccountModel()

  async add (params: AddAccountParams): Promise<AccountModel> {
    this.params = params
    return this.result
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  email: string
  result: AccountModel = mockAccountModel()

  async loadByEmail (email: string): Promise<AccountModel> {
    this.email = email
    return this.result
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  params: LoadByTokenParams
  result: AccountModel = mockAccountModel()

  async loadByToken (params: LoadByTokenParams): Promise<AccountModel | null> {
    this.params = params
    return this.result
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  params: UpdateParams

  async updateAccessToken (params: UpdateParams): Promise<void> {
    this.params = params
  }
}
