import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'
import { DbLoadSurveyResult } from './db-load-survey-result'
import {
  LoadSurveyByIdRepositorySpy,
  LoadSurveyResultRepositorySpy
} from '@/data/test'
import { throwError } from '@/domain/test'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
  )
  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
  }
}

describe('DbLoadSurveyResult', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveyResultRepository with correct surveyId', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyId = faker.datatype.uuid()
    await sut.load(surveyId)
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId)
  })

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockImplementationOnce(throwError)
    const promise = sut.load('any_survey_id')
    await expect(promise).rejects.toThrow()
  })

  it('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const {
      sut,
      loadSurveyResultRepositorySpy,
      loadSurveyByIdRepositorySpy
    } = makeSut()
    loadSurveyResultRepositorySpy.result = null
    const surveyId = faker.datatype.uuid()
    await sut.load(surveyId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  it(
    `should return SurveyResultModel with all answers having count 0 and
    percent 0 if LoadSurveyResultRepository returns null`,
    async () => {
      const {
        sut,
        loadSurveyResultRepositorySpy,
        loadSurveyByIdRepositorySpy
      } = makeSut()
      loadSurveyResultRepositorySpy.result = null
      const surveyResult = await sut.load(faker.datatype.uuid())
      const { result } = loadSurveyByIdRepositorySpy
      expect(surveyResult).toEqual({
        surveyId: result.id,
        question: result.question,
        date: result.date,
        answers: result.answers.map(answer => Object.assign({}, answer, {
          count: 0,
          percent: 0
        }))
      })
    })

  it('should return SurveyResultModel on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyResult = await sut.load(faker.datatype.uuid())
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.result)
  })
})
