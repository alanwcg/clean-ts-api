import { SurveyResultModel } from '@/domain/models'

export type LoadSurveyResultParams = {
  surveyId: string
  accountId: string
}

export interface LoadSurveyResult {
  load: (params: LoadSurveyResultParams) => Promise<SurveyResultModel>
}
