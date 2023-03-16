import { SurveyMongoRepository } from '@/infra/db'
import { DbLoadAnswersBySurvey } from '@/data/usecases'

export const makeDbLoadAnswersBySurvey = (): DbLoadAnswersBySurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadAnswersBySurvey(surveyMongoRepository)
}
