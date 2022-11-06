import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validator
} from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validator.validate(httpRequest.body)
    return null
  }
}
