import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import {
  LoadSurveyResultRepositorySpy,
  SaveSurveyResultRepositorySpy
} from '@/data/test'
import {
  mockSaveSurveyResultParams,
  throwError
} from '@/domain/test'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy()
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy
  )
  return {
    sut,
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy
  }
}

describe('DbSaveSurveyResult', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    const params = mockSaveSurveyResultParams()
    await sut.save(params)
    expect(saveSurveyResultRepositorySpy.params).toEqual(params)
  })

  it('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(saveSurveyResultRepositorySpy, 'save')
      .mockImplementationOnce(throwError)
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  it('should call LoadSurveyResultRepository with correct surveyId', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const params = mockSaveSurveyResultParams()
    await sut.save(params)
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(params.surveyId)
  })

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockImplementationOnce(throwError)
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  it('should return a SurveyResult on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyResult = await sut.save(mockSaveSurveyResultParams())
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.result)
  })
})
