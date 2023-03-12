import { SurveyResultMongoRepository, SurveyMongoRepository } from '@/infra/db'
import { DbLoadSurveyResult } from '@/data/usecases'

export const makeDbLoadSurveyResult = (): DbLoadSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyResult(
    surveyResultMongoRepository,
    surveyMongoRepository
  )
}
