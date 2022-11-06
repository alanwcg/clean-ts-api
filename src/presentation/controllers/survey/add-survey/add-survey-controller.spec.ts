import { HttpRequest, Validator } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

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

describe('AddSurvey Controller', () => {
  it('should call Validator with correct values', async () => {
    class ValidatorStub implements Validator {
      validate (input: Record<string, any>): Error | null {
        return null
      }
    }
    const validatorStub = new ValidatorStub()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const sut = new AddSurveyController(validatorStub)
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
