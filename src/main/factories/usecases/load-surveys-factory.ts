import { SurveyMongoRepository } from '@/infra/db'
import { DbLoadSurveys } from '@/data/usecases'

export const makeDbLoadSurveys = (): DbLoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
