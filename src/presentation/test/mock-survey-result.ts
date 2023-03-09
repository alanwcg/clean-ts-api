import { SurveyResultModel } from '@/domain/models/survey-result'
import {
  SaveSurveyResult,
  SaveSurveyResultParams
} from '@/domain/usecases/survey-result/save-survey-result'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { mockSurveyResultModel } from '@/domain/test'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  params: SaveSurveyResultParams
  result: SurveyResultModel = mockSurveyResultModel()

  async save (params: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.params = params
    return this.result
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyId: string
  result: SurveyResultModel = mockSurveyResultModel()

  async load (surveyId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    return this.result
  }
}
