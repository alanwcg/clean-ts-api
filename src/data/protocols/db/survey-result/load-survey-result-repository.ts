import { SurveyResultModel } from '@/domain/models'
import { LoadSurveyResultParams } from '@/domain/usecases'

export interface LoadSurveyResultRepository {
  loadBySurveyId: (params: LoadSurveyResultParams) => Promise<SurveyResultModel | null>
}
