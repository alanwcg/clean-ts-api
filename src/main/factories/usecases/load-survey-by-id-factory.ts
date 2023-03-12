import { SurveyMongoRepository } from '@/infra/db'
import { DbLoadSurveyById } from '@/data/usecases'

export const makeDbLoadSurveyById = (): DbLoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyMongoRepository)
}
