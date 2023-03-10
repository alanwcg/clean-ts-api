import { faker } from '@faker-js/faker'
import { HttpRequest } from './signup-controller-protocols'
import { SignUpController } from './signup-controller'
import { EmailInUseError, MissingParamError } from '@/presentation/errors'
import {
  badRequest,
  forbidden,
  serverError,
  success
} from '@/presentation/helpers/http/http-helper'
import { ValidatorSpy } from '@/validation/test'
import { AddAccountSpy, AuthenticationSpy } from '@/presentation/test'
import { throwError } from '@/domain/test'

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password()
  return {
    body: {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password
    }
  }
}

type SutTypes = {
  sut: SignUpController
  validatorSpy: ValidatorSpy
  addAccountSpy: AddAccountSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const validatorSpy = new ValidatorSpy()
  const addAccountSpy = new AddAccountSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new SignUpController(validatorSpy, addAccountSpy, authenticationSpy)
  return {
    sut,
    validatorSpy,
    addAccountSpy,
    authenticationSpy
  }
}

describe('SignUpController', () => {
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(addAccountSpy.params).toEqual({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  it('should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut()
    addAccountSpy.result = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 200 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(success(authenticationSpy.result))
  })

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
    expect(authenticationSpy.params).toEqual({
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
