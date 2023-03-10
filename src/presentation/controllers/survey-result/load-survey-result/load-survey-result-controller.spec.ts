import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { HttpRequest } from './load-survey-result-controller-protocols'
import {
  forbidden,
  serverError,
  success
} from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import { LoadSurveyByIdSpy, LoadSurveyResultSpy } from '@/presentation/test'
import { throwError } from '@/domain/test'

const mockRequest = (): HttpRequest => ({
  accountId: faker.datatype.uuid(),
  params: {
    surveyId: faker.datatype.uuid()
  }
})

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  const sut = new LoadSurveyResultController(
    loadSurveyByIdSpy,
    loadSurveyResultSpy
  )
  return {
    sut,
    loadSurveyByIdSpy,
    loadSurveyResultSpy
  }
}

describe('LoadSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveyById with correct id', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadSurveyByIdSpy.id).toBe(httpRequest.params.surveyId)
  })

  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    loadSurveyByIdSpy.result = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockImplementationOnce(
      throwError
    )
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadSurveyResultSpy.params).toEqual({
      surveyId: httpRequest.params.surveyId,
      accountId: httpRequest.accountId
    })
  })

  it('should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    jest.spyOn(loadSurveyResultSpy, 'load').mockImplementationOnce(
      throwError
    )
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 200 on success', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    const httpRequest = await sut.handle(mockRequest())
    expect(httpRequest).toEqual(success(loadSurveyResultSpy.result))
  })
})
