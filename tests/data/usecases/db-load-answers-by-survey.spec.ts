import { faker } from '@faker-js/faker'
import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { LoadSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositorySpy)
  return {
    sut,
    loadSurveyByIdRepositorySpy
  }
}

describe('DbLoadAnswersBySurvey', () => {
  it('should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const id = faker.datatype.uuid()
    await sut.loadAnswers(id)
    expect(loadSurveyByIdRepositorySpy.id).toBe(id)
  })

  it('should return answers on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const answers = await sut.loadAnswers(faker.datatype.uuid())
    expect(answers).toEqual(
      loadSurveyByIdRepositorySpy.result.answers.map(a => a.answer)
    )
  })

  it('should return empty array if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyByIdRepositorySpy.result = null
    const answers = await sut.loadAnswers(faker.datatype.uuid())
    expect(answers).toEqual([])
  })

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById')
      .mockImplementationOnce(throwError)
    const promise = sut.loadAnswers('any_id')
    await expect(promise).rejects.toThrow()
  })
})
