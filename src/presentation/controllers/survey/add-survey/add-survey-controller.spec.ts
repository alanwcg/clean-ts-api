import MockDate from 'mockdate'
import { HttpRequest } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http/http-helper'
import { ValidatorSpy } from '@/validation/test'
import { AddSurveySpy } from '@/presentation/test'
import { mockAddSurveyParams, throwError } from '@/domain/test'

const mockRequest = (): HttpRequest => ({
  body: {
    ...mockAddSurveyParams(),
    date: new Date()
  }
})

type SutTypes = {
  sut: AddSurveyController
  validatorSpy: ValidatorSpy
  addSurveySpy: AddSurveySpy
}

const makeSut = (): SutTypes => {
  const validatorSpy = new ValidatorSpy()
  const addSurveySpy = new AddSurveySpy()
  const sut = new AddSurveyController(validatorSpy, addSurveySpy)
  return {
    sut,
    validatorSpy,
    addSurveySpy
  }
}

describe('AddSurveyController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call Validator with correct values', async () => {
    const { sut, validatorSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validatorSpy.input).toEqual(httpRequest.body)
  })

  it('should return 400 if Validation fails', async () => {
    const { sut, validatorSpy } = makeSut()
    validatorSpy.error = new Error()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validatorSpy.error))
  })

  it('should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(addSurveySpy.params).toEqual(httpRequest.body)
  })

  it('should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveySpy } = makeSut()
    jest.spyOn(addSurveySpy, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
