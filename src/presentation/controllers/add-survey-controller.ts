import { Controller, HttpResponse, Validator } from '@/presentation/protocols'
import { badRequest, noContent, serverError } from '@/presentation/helpers'
import { AddSurvey } from '@/domain/usecases'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { question, answers } = request
      await this.addSurvey.add({
        question,
        answers,
        date: new Date()
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace AddSurveyController {
  type Answer = {
    image?: string
    answer: string
  }

  export type Request = {
    question: string
    answers: Answer[]
  }
}
