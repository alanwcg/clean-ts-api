import { Controller, HttpResponse } from '@/presentation/protocols'
import { forbidden, serverError, success } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { LoadSurveyById, SaveSurveyResult } from '@/domain/usecases'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (
    request: SaveSurveyResultController.Request
  ): Promise<HttpResponse> {
    try {
      const { surveyId, accountId, answer } = request
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      } else {
        const answers = survey.answers.map(a => a.answer)
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      }
      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })
      return success(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    accountId: string
    answer: string
  }
}
