import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols'
import { mockAccountModel } from '@/tests/domain/mocks'

export class AddAccountRepositorySpy implements AddAccountRepository {
  params: AddAccountRepository.Params
  result: AddAccountRepository.Result = mockAccountModel()

  async add (
    params: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    this.params = params
    return this.result
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  email: string
  result: LoadAccountByEmailRepository.Result = mockAccountModel()

  async loadByEmail (
    email: string
  ): Promise<LoadAccountByEmailRepository.Result> {
    this.email = email
    return this.result
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  params: LoadAccountByTokenRepository.Params
  result: LoadAccountByTokenRepository.Result = mockAccountModel()

  async loadByToken (
    params: LoadAccountByTokenRepository.Params
  ): Promise<LoadAccountByTokenRepository.Result> {
    this.params = params
    return this.result
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  params: UpdateAccessTokenRepository.Params

  async updateAccessToken (
    params: UpdateAccessTokenRepository.Params
  ): Promise<void> {
    this.params = params
  }
}
