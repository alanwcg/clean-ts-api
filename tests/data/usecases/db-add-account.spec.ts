import { DbAddAccount } from '@/data/usecases'
import {
  HasherSpy,
  AddAccountRepositorySpy,
  CheckAccountByEmailRepositorySpy
} from '@/tests/data/mocks'
import { mockAddAccountParams, throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbAddAccount
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkAccountByEmailRepositorySpy = new CheckAccountByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const sut = new DbAddAccount(
    checkAccountByEmailRepositorySpy,
    hasherSpy,
    addAccountRepositorySpy
  )
  return {
    sut,
    checkAccountByEmailRepositorySpy,
    hasherSpy,
    addAccountRepositorySpy
  }
}

describe('DbAddAccount', () => {
  it('should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(hasherSpy.value).toBe(addAccountParams.password)
  })

  it('should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, hasherSpy, addAccountRepositorySpy } = makeSut()
    const params = mockAddAccountParams()
    await sut.add(params)
    expect(addAccountRepositorySpy.params).toEqual({
      ...params,
      password: hasherSpy.result
    })
  })

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    jest.spyOn(addAccountRepositorySpy, 'add').mockImplementationOnce(
      throwError
    )
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return true on success', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    const accountCreated = await sut.add(mockAddAccountParams())
    expect(accountCreated).toBe(addAccountRepositorySpy.result)
  })

  it('should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    const params = mockAddAccountParams()
    await sut.add(params)
    expect(checkAccountByEmailRepositorySpy.email).toBe(params.email)
  })

  it('should throw if CheckAccountByEmailRepository throws', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(checkAccountByEmailRepositorySpy, 'checkByEmail')
      .mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return false if CheckAccountByEmailRepository returns an account', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    checkAccountByEmailRepositorySpy.result = true
    const accountCreated = await sut.add(mockAddAccountParams())
    expect(accountCreated).toBe(false)
  })

  it('should return false if AddAccountRepository returns false', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    addAccountRepositorySpy.result = false
    const accountCreated = await sut.add(mockAddAccountParams())
    expect(accountCreated).toBe(false)
  })
})
