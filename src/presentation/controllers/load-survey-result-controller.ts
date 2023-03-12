import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols'
import {
  forbidden,
  serverError,
  success
} from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { LoadSurveyById, LoadSurveyResult } from '@/domain/usecases'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const surveyResult = await this.loadSurveyResult.load({
        surveyId,
        accountId: httpRequest.accountId
      })
      return success(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
