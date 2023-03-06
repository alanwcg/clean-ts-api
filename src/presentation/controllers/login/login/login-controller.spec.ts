import { LoginController } from './login-controller'
import {
  HttpRequest,
  Validator,
  Authentication
} from './login-controller-protocols'
import {
  badRequest,
  serverError,
  success,
  unauthorized
} from '@/presentation/helpers/http/http-helper'
import { MissingParamError } from '@/presentation/errors'
import { mockAuthentication } from '@/presentation/test'
import { mockValidator } from '@/validation/test'

const mockRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

type SutTypes = {
  sut: LoginController
  validatorStub: Validator
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const validatorStub = mockValidator()
  const authenticationStub = mockAuthentication()
  const sut = new LoginController(validatorStub, authenticationStub)
  return {
    sut,
    validatorStub,
    authenticationStub
  }
}

describe('Login Controller', () => {
  it('should call Validator with correct value', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validator returns an error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(
        new Promise(resolve => resolve(null as unknown as string))
      )
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => {
      throw new Error()
    })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(success({ accessToken: 'any_token' }))
  })
})
