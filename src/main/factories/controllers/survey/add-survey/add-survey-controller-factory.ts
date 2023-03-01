import { makeAddSurveyValidator } from './add-survey-validator-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAddSurvey } from '@/main/factories/usecases/survey/add-survey/db-add-survey-factory'
import { Controller } from '@/presentation/protocols'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(
    makeAddSurveyValidator(),
    makeDbAddSurvey()
  )
  return makeLogControllerDecorator(addSurveyController)
}
