import {
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import {
  mockAddAccountParams,
  mockAccountModel,
  throwError
} from '@/domain/test'
import {
  mockAddAccountRepository,
  mockHasher,
  mockLoadAccountByEmailRepository
} from '@/data/test'

type SutTypes = {
  sut: DbAddAccount
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    .mockReturnValue(Promise.resolve(null))
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const sut = new DbAddAccount(loadAccountByEmailRepositoryStub, hasherStub, addAccountRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hasherStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount use case', () => {
  it('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(mockAddAccountParams())
    expect(hasherSpy).toHaveBeenCalledWith('any_password')
  })

  it('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(mockAddAccountParams())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(
      throwError
    )
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(mockAddAccountParams())
    expect(account).toEqual(mockAccountModel())
  })

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(mockAddAccountParams())
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return null if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        Promise.resolve(mockAccountModel())
      )
    const account = await sut.add(mockAddAccountParams())
    expect(account).toBe(null)
  })
})
