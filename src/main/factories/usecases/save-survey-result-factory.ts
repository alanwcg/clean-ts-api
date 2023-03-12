import { SurveyResultMongoRepository } from '@/infra/db'
import { DbSaveSurveyResult } from '@/data/usecases'

export const makeDbSaveSurveyResult = (): DbSaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(
    surveyResultMongoRepository,
    surveyResultMongoRepository
  )
}
