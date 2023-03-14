import { faker } from '@faker-js/faker'
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  CheckAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols'

export class AddAccountRepositorySpy implements AddAccountRepository {
  params: AddAccountRepository.Params
  result: AddAccountRepository.Result = true

  async add (
    params: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    this.params = params
    return this.result
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  email: string
  result: LoadAccountByEmailRepository.Result = {
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    password: faker.internet.password()
  }

  async loadByEmail (
    email: string
  ): Promise<LoadAccountByEmailRepository.Result> {
    this.email = email
    return this.result
  }
}

export class CheckAccountByEmailRepositorySpy implements CheckAccountByEmailRepository {
  email: string
  result: CheckAccountByEmailRepository.Result = false

  async checkByEmail (
    email: string
  ): Promise<CheckAccountByEmailRepository.Result> {
    this.email = email
    return this.result
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  params: LoadAccountByTokenRepository.Params
  result: LoadAccountByTokenRepository.Result = { id: faker.datatype.uuid() }

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
