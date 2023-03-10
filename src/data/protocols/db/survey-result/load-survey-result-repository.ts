import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyResultParams } from '@/domain/usecases/survey-result/load-survey-result'

export interface LoadSurveyResultRepository {
  loadBySurveyId: (params: LoadSurveyResultParams) => Promise<SurveyResultModel | null>
}
