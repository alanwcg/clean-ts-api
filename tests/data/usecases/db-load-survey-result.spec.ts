import MockDate from 'mockdate'
import { DbLoadSurveyResult } from '@/data/usecases'
import {
  LoadSurveyByIdRepositorySpy,
  LoadSurveyResultRepositorySpy
} from '@/tests/data/mocks'
import { mockLoadSurveyResultParams, throwError } from '@/tests/domain/mocks'

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

  it('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const params = mockLoadSurveyResultParams()
    await sut.load(params)
    expect(loadSurveyResultRepositorySpy.params).toEqual(params)
  })

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockImplementationOnce(throwError)
    const promise = sut.load(mockLoadSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  it('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const {
      sut,
      loadSurveyResultRepositorySpy,
      loadSurveyByIdRepositorySpy
    } = makeSut()
    loadSurveyResultRepositorySpy.result = null
    const params = mockLoadSurveyResultParams()
    await sut.load(params)
    expect(loadSurveyByIdRepositorySpy.id).toBe(params.surveyId)
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
      const surveyResult = await sut.load(mockLoadSurveyResultParams())
      const { result } = loadSurveyByIdRepositorySpy
      expect(surveyResult).toEqual({
        surveyId: result.id,
        question: result.question,
        date: result.date,
        answers: result.answers.map(answer => Object.assign({}, answer, {
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }))
      })
    })

  it('should return SurveyResultModel on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyResult = await sut.load(mockLoadSurveyResultParams())
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.result)
  })
})
