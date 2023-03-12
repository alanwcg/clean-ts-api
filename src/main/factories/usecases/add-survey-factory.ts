import { SurveyMongoRepository } from '@/infra/db'
import { DbAddSurvey } from '@/data/usecases'

export const makeDbAddSurvey = (): DbAddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
