import { HttpRequest, Validator } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest } from '../../../helpers/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
  }
})

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: Record<string, any>): Error | null {
      return null
    }
  }
  return new ValidatorStub()
}

type SutTypes = {
  sut: AddSurveyController
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidator()
  const sut = new AddSurveyController(validatorStub)
  return {
    sut,
    validatorStub
  }
}

describe('AddSurvey Controller', () => {
  it('should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation fails', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
