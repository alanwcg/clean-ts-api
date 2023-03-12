import { faker } from '@faker-js/faker'
import { DbLoadAccountByToken } from '@/data/usecases'
import {
  DecrypterSpy,
  LoadAccountByTokenRepositorySpy
} from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterSpy: DecrypterSpy
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy()
  const sut = new DbLoadAccountByToken(decrypterSpy, loadAccountByTokenRepositorySpy)
  return {
    sut,
    decrypterSpy,
    loadAccountByTokenRepositorySpy
  }
}

let accessToken: string
let role: string

describe('DbLoadAccountByToken', () => {
  beforeEach(() => {
    accessToken = faker.datatype.uuid()
    role = faker.random.word()
  })

  it('should call Decrypter with correct values', async () => {
    const { sut, decrypterSpy } = makeSut()
    await sut.load({ accessToken, role })
    expect(decrypterSpy.value).toBe(accessToken)
  })

  it('should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut()
    decrypterSpy.result = null
    const account = await sut.load({ accessToken, role })
    expect(account).toBe(null)
  })

  it('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    await sut.load({ accessToken, role })
    expect(loadAccountByTokenRepositorySpy.params).toEqual({
      token: accessToken,
      role
    })
  })

  it('should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    loadAccountByTokenRepositorySpy.result = null
    const account = await sut.load({ accessToken, role })
    expect(account).toBe(null)
  })

  it('should return an account on success', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    const account = await sut.load({ accessToken, role })
    expect(account).toEqual(loadAccountByTokenRepositorySpy.result)
  })

  it('should return null if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError)
    const account = await sut.load({ accessToken, role })
    expect(account).toBe(null)
  })

  it('should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken')
      .mockImplementationOnce(throwError)
    const promise = sut.load({ accessToken, role })
    await expect(promise).rejects.toThrow()
  })
})
