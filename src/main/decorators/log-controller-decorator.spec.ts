import { LogControllerDecorator } from './log-controller-decorator'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { serverError, success } from '@/presentation/helpers/http/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols'
import { mockAccountModel } from '@/domain/test'
import { mockLogErrorRepository } from '@/data/test'

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const mockError = (): Error => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return fakeError
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(success(mockAccountModel()))
    }
  }
  return new ControllerStub()
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('Log Controller Decorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(success(mockAccountModel()))
  })

  it('should call LogError with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logErrorSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      Promise.resolve(serverError(mockError()))
    )
    await sut.handle(mockRequest())
    expect(logErrorSpy).toHaveBeenCalledWith('any_stack')
  })

  it('should return httpResponse body with error message if controller returns a server error', async () => {
    const { sut, controllerStub } = makeSut()
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      Promise.resolve(serverError(mockError()))
    )
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(mockError()))
  })
})
