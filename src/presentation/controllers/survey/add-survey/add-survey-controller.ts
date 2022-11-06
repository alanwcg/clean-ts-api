import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validator,
  AddSurvey,
  AddSurveyModel
} from './add-survey-controller-protocols'
import { badRequest } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validator.validate(httpRequest.body)
    if (error) {
      return badRequest(error)
    }
    await this.addSurvey.add(httpRequest.body as AddSurveyModel)
    return null
  }
}
