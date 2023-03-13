import { SurveyResultModel } from '@/domain/models'
import { LoadSurveyResult } from '@/domain/usecases'

export interface LoadSurveyResultRepository {
  loadBySurveyId: (
    params: LoadSurveyResultRepository.Params
  ) => Promise<LoadSurveyResultRepository.Result>
}

export namespace LoadSurveyResultRepository {
  export type Params = LoadSurveyResult.Params
  export type Result = SurveyResultModel | null
}
