import { DbAuthentication } from './db-authentication'
import {
  AccountModel,
  LoadAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'
import { mockAuthenticationParams, throwError } from '@/domain/test'
import {
  mockEncrypter,
  mockHashCompare,
  mockLoadAccountByEmailRepository,
  mockUpdateAccessTokenRepository
} from '@/data/test'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hashComparerStub = mockHashCompare()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(mockAuthenticationParams())
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        new Promise(resolve => resolve(null as unknown as AccountModel))
      )
    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBe(null)
  })

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(mockAuthenticationParams())
    expect(compareSpy).toHaveBeenCalledWith({
      value: 'any_password',
      hash: 'hashed_password'
    })
  })

  it('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise(resolve => resolve(false))
    )
    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBe(null)
  })

  it('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(mockAuthenticationParams())
    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return accessToken if Encrypter succeeds', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBe('any_token')
  })

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateAccessTokenSpy = jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(mockAuthenticationParams())
    expect(updateAccessTokenSpy).toHaveBeenCalledWith({
      id: 'any_id',
      accessToken: 'any_token'
    })
  })

  it('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })
})
