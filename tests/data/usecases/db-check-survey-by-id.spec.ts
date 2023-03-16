import { faker } from '@faker-js/faker'
import { DbCheckSurveyById } from '@/data/usecases'
import { CheckSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy)
  return {
    sut,
    checkSurveyByIdRepositorySpy
  }
}

describe('DbCheckSurveyById', () => {
  it('should call CheckSurveyByIdRepository with correct id', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    const id = faker.datatype.uuid()
    await sut.checkById(id)
    expect(checkSurveyByIdRepositorySpy.id).toBe(id)
  })

  it('should return true on success', async () => {
    const { sut } = makeSut()
    const surveyExists = await sut.checkById(faker.datatype.uuid())
    expect(surveyExists).toBe(true)
  })

  it('should return false if CheckSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    checkSurveyByIdRepositorySpy.result = false
    const surveyExists = await sut.checkById(faker.datatype.uuid())
    expect(surveyExists).toBe(false)
  })

  it('should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(checkSurveyByIdRepositorySpy, 'checkById')
      .mockImplementationOnce(throwError)
    const promise = sut.checkById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
