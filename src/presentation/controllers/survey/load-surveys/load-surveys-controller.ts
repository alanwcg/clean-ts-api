import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveys
} from './load-surveys-controller-protocols'
import {
  success,
  noContent,
  serverError
} from '../../../helpers/http/http-helper'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      return surveys.length ? success(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}