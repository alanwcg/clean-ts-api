import {
  makeAddSurveyValidator,
  makeLogControllerDecorator,
  makeDbAddSurvey
} from '@/main/factories'
import { Controller } from '@/presentation/protocols'
import { AddSurveyController } from '@/presentation/controllers'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(
    makeAddSurveyValidator(),
    makeDbAddSurvey()
  )
  return makeLogControllerDecorator(addSurveyController)
}
