import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import {
  LoadAccountByTokenRepository,
  LoadByTokenParams
} from '@/data/protocols/db/account/load-account-by-token-repository'
import {
  UpdateAccessTokenRepository,
  UpdateParams
} from '@/data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'
import { AddAccountParams } from '@/domain/usecases/account/add-account'

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
