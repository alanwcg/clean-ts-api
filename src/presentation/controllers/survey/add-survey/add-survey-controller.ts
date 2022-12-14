import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validator,
  AddSurvey,
  AddSurveyModel
} from './add-survey-controller-protocols'
import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      await this.addSurvey.add(httpRequest.body as AddSurveyModel)
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
