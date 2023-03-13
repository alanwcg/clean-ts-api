import { faker } from '@faker-js/faker'
import { LogControllerDecorator } from '@/main/decorators'
import { serverError, success } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { mockAccountModel } from '@/tests/domain/mocks'
import { LogErrorRepositorySpy } from '@/tests/data/mocks'

const mockRequest = (): Record<string, any> => ({})

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = faker.random.words()
  return serverError(fakeError)
}

class ControllerSpy implements Controller {
  httpResponse = success(mockAccountModel())
  request: Record<string, any>

  async handle (request: Record<string, any>): Promise<HttpResponse> {
    this.request = request
    return Promise.resolve(this.httpResponse)
  }
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)
  return {
    sut,
    controllerSpy,
    logErrorRepositorySpy
  }
}

describe('LogControllerDecorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(controllerSpy.request).toEqual(request)
  })

  it('should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(controllerSpy.httpResponse)
  })

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    const serverError = mockServerError()
    controllerSpy.httpResponse = serverError
    await sut.handle(mockRequest())
    expect(logErrorRepositorySpy.stack).toBe(serverError.body.stack)
  })

  it('should return httpResponse body with error message if controller returns a server error', async () => {
    const { sut, controllerSpy } = makeSut()
    const serverError = mockServerError()
    controllerSpy.httpResponse = serverError
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError)
  })
})
