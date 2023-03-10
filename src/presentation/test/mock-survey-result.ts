import { SurveyResultModel } from '@/domain/models/survey-result'
import {
  SaveSurveyResult,
  SaveSurveyResultParams
} from '@/domain/usecases/survey-result/save-survey-result'
import {
  LoadSurveyResult,
  LoadSurveyResultParams
} from '@/domain/usecases/survey-result/load-survey-result'
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
  params: LoadSurveyResultParams
  result: SurveyResultModel = mockSurveyResultModel()

  async load (params: LoadSurveyResultParams): Promise<SurveyResultModel> {
    this.params = params
    return this.result
  }
}
