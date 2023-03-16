import { SurveyMongoRepository } from '@/infra/db'
import { DbCheckSurveyById } from '@/data/usecases'

export const makeDbCheckSurveyById = (): DbCheckSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbCheckSurveyById(surveyMongoRepository)
}
