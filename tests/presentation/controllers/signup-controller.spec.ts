import { faker } from '@faker-js/faker'
import { SignUpController } from '@/presentation/controllers'
import { EmailInUseError, MissingParamError } from '@/presentation/errors'
import {
  badRequest,
  forbidden,
  serverError,
  success
} from '@/presentation/helpers'
import { AddAccountSpy, AuthenticationSpy } from '@/tests/presentation/mocks'
import { ValidatorSpy } from '@/tests/validation/mocks'
import { throwError } from '@/tests/domain/mocks'

const mockRequest = (): SignUpController.Request => {
  const password = faker.internet.password()
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
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
    const request = mockRequest()
    await sut.handle(request)
    expect(addAccountSpy.params).toEqual({
      name: request.name,
      email: request.email,
      password: request.password
    })
  })

  it('should return 403 if AddAccount returns false', async () => {
    const { sut, addAccountSpy } = makeSut()
    addAccountSpy.result = false
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
    expect(authenticationSpy.params).toEqual({
      email: request.email,
      password: request.password
    })
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
