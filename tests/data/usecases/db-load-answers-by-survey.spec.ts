import { faker } from '@faker-js/faker'
import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { LoadAnswersBySurveyRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositorySpy: LoadAnswersBySurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositorySpy = new LoadAnswersBySurveyRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositorySpy)
  return {
    sut,
    loadAnswersBySurveyRepositorySpy
  }
}

describe('DbLoadAnswersBySurvey', () => {
  it('should call LoadAnswersBySurveyRepository with correct id', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    const id = faker.datatype.uuid()
    await sut.loadAnswers(id)
    expect(loadAnswersBySurveyRepositorySpy.id).toBe(id)
  })

  it('should return answers on success', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    const answers = await sut.loadAnswers(faker.datatype.uuid())
    expect(answers).toEqual(loadAnswersBySurveyRepositorySpy.result)
  })

  it('should return empty array if LoadAnswersBySurveyRepository returns empty array', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    loadAnswersBySurveyRepositorySpy.result = []
    const answers = await sut.loadAnswers(faker.datatype.uuid())
    expect(answers).toEqual([])
  })

  it('should throw if LoadAnswersBySurveyRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositorySpy, 'loadAnswers')
      .mockImplementationOnce(throwError)
    const promise = sut.loadAnswers('any_id')
    await expect(promise).rejects.toThrow()
  })
})
