import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { forbidden, serverError, success } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import {
  LoadSurveyByIdSpy,
  SaveSurveyResultSpy
} from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'

const mockRequest = (
  answer: string = null
): SaveSurveyResultController.Request => ({
  surveyId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid(),
  answer
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const sut = new SaveSurveyResultController(
    loadSurveyByIdSpy,
    saveSurveyResultSpy
  )
  return {
    sut,
    loadSurveyByIdSpy,
    saveSurveyResultSpy
  }
}

describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveyById with correct id', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSurveyByIdSpy.id).toBe(request.surveyId)
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

  it('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  it('should call SaveSurveyResult with correct values', async () => {
    const { sut, loadSurveyByIdSpy, saveSurveyResultSpy } = makeSut()
    const request = mockRequest(loadSurveyByIdSpy.result.answers[0].answer)
    await sut.handle(request)
    expect(saveSurveyResultSpy.params).toEqual({
      surveyId: request.surveyId,
      accountId: request.accountId,
      answer: request.answer,
      date: new Date()
    })
  })

  it('should return 500 if SaveSurveyResult throws', async () => {
    const { sut, loadSurveyByIdSpy, saveSurveyResultSpy } = makeSut()
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(throwError)
    const request = mockRequest(loadSurveyByIdSpy.result.answers[0].answer)
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 200 on success', async () => {
    const { sut, loadSurveyByIdSpy, saveSurveyResultSpy } = makeSut()
    const request = mockRequest(loadSurveyByIdSpy.result.answers[0].answer)
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(success(saveSurveyResultSpy.result))
  })
})
