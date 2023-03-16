import {
  makeDbLoadAnswersBySurvey,
  makeDbSaveSurveyResult,
  makeLogControllerDecorator
} from '@/main/factories'
import { Controller } from '@/presentation/protocols'
import { SaveSurveyResultController } from '@/presentation/controllers'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadAnswersBySurvey(),
    makeDbSaveSurveyResult()
  )
  return makeLogControllerDecorator(controller)
}
