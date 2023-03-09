import { faker } from '@faker-js/faker'
import { LoginController } from './login-controller'
import { HttpRequest } from './login-controller-protocols'
import {
  badRequest,
  serverError,
  success,
  unauthorized
} from '@/presentation/helpers/http/http-helper'
import { MissingParamError } from '@/presentation/errors'
import { AuthenticationSpy } from '@/presentation/test'
import { ValidatorSpy } from '@/validation/test'
import { mockAuthenticationParams, throwError } from '@/domain/test'

const mockRequest = (): HttpRequest => ({
  body: mockAuthenticationParams()
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
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validatorSpy.input).toEqual(httpRequest.body)
  })

  it('should return 400 if Validator returns an error', async () => {
    const { sut, validatorSpy } = makeSut()
    validatorSpy.error = new MissingParamError(faker.random.word())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validatorSpy.error))
  })

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(authenticationSpy.params).toEqual(httpRequest.body)
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
    expect(httpResponse).toEqual(success({
      accessToken: authenticationSpy.result
    }))
  })
})
