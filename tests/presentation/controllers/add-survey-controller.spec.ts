import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'
import { AddSurveyController } from '@/presentation/controllers'
import { badRequest, serverError, noContent } from '@/presentation/helpers'
import { AddSurveySpy } from '@/tests/presentation/mocks'
import { ValidatorSpy } from '@/tests/validation/mocks'
import { throwError } from '@/tests/domain/mocks'

const mockRequest = (): AddSurveyController.Request => ({
  question: faker.lorem.text(),
  answers: [
    {
      image: faker.random.word(),
      answer: faker.lorem.text()
    },
    {
      answer: faker.lorem.text()
    }
  ]
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
    const request = mockRequest()
    await sut.handle(request)
    expect(validatorSpy.input).toEqual(request)
  })

  it('should return 400 if Validation fails', async () => {
    const { sut, validatorSpy } = makeSut()
    validatorSpy.error = new Error()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validatorSpy.error))
  })

  it('should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(addSurveySpy.params).toEqual({ ...request, date: new Date() })
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
