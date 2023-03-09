import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepositorySpy } from '@/data/test'
import { throwError } from '@/domain/test'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy)
  return {
    sut,
    loadSurveyByIdRepositorySpy
  }
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const id = faker.datatype.uuid()
    await sut.loadById(id)
    expect(loadSurveyByIdRepositorySpy.id).toBe(id)
  })

  it('should return a Survey on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const survey = await sut.loadById(faker.datatype.uuid())
    expect(loadSurveyByIdRepositorySpy.result).toEqual(survey)
  })

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById')
      .mockImplementationOnce(throwError)
    const promise = sut.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
