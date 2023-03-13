import { faker } from '@faker-js/faker'
import { LoginController } from '@/presentation/controllers'
import {
  badRequest,
  serverError,
  success,
  unauthorized
} from '@/presentation/helpers'
import { MissingParamError } from '@/presentation/errors'
import { AuthenticationSpy } from '@/tests/presentation/mocks'
import { ValidatorSpy } from '@/tests/validation/mocks'
import { throwError } from '@/tests/domain/mocks'

const mockRequest = (): LoginController.Request => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

type SutTypes = {
  sut: LoginController
  validatorSpy: ValidatorSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const validatorSpy = new ValidatorSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new LoginController(validatorSpy, authenticationSpy)
  return {
    sut,
    validatorSpy,
    authenticationSpy
  }
}

describe('LoginController', () => {
  it('should call Validator with correct value', async () => {
    const { sut, validatorSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validatorSpy.input).toEqual(request)
  })

  it('should return 400 if Validator returns an error', async () => {
    const { sut, validatorSpy } = makeSut()
    validatorSpy.error = new MissingParamError(faker.random.word())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validatorSpy.error))
  })

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(authenticationSpy.params).toEqual(request)
  })

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    authenticationSpy.result = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(success(authenticationSpy.result))
  })
})
