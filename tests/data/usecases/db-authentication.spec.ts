import { DbAuthentication } from '@/data/usecases'
import {
  EncrypterSpy,
  HashComparerSpy,
  LoadAccountByEmailRepositorySpy,
  UpdateAccessTokenRepositorySpy
} from '@/tests/data/mocks'
import { mockAuthenticationParams, throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
  encrypterSpy: EncrypterSpy
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  )
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  }
}

describe('DbAuthentication', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const params = mockAuthenticationParams()
    await sut.auth(params)
    expect(loadAccountByEmailRepositorySpy.email).toBe(params.email)
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
      .mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.result = null
    const result = await sut.auth(mockAuthenticationParams())
    expect(result).toBe(null)
  })

  it('should call HashComparer with correct values', async () => {
    const { sut, loadAccountByEmailRepositorySpy, hashComparerSpy } = makeSut()
    const params = mockAuthenticationParams()
    await sut.auth(params)
    expect(hashComparerSpy.params).toEqual({
      value: params.password,
      hash: loadAccountByEmailRepositorySpy.result.password
    })
  })

  it('should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerSpy } = makeSut()
    hashComparerSpy.result = false
    const result = await sut.auth(mockAuthenticationParams())
    expect(result).toBe(null)
  })

  it('should call Encrypter with correct id', async () => {
    const { sut, loadAccountByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth(mockAuthenticationParams())
    expect(encrypterSpy.value).toBe(loadAccountByEmailRepositorySpy.result.id)
  })

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return data on success', async () => {
    const { sut, loadAccountByEmailRepositorySpy, encrypterSpy } = makeSut()
    const result = await sut.auth(mockAuthenticationParams())
    expect(result).toEqual({
      accessToken: encrypterSpy.result,
      name: loadAccountByEmailRepositorySpy.result.name
    })
  })

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const {
      sut,
      loadAccountByEmailRepositorySpy,
      encrypterSpy,
      updateAccessTokenRepositorySpy
    } = makeSut()
    await sut.auth(mockAuthenticationParams())
    expect(updateAccessTokenRepositorySpy.params).toEqual({
      id: loadAccountByEmailRepositorySpy.result.id,
      accessToken: encrypterSpy.result
    })
  })

  it('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    jest.spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken')
      .mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })
})
