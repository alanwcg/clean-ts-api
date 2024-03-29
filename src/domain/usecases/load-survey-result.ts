import { SurveyResultModel } from '@/domain/models'

export interface LoadSurveyResult {
  load: (params: LoadSurveyResult.Params) => Promise<LoadSurveyResult.Result>
}

export namespace LoadSurveyResult {
  export type Params = {
    surveyId: string
    accountId: string
  }

  export type Result = SurveyResultModel
}
