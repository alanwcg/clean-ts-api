import { SurveyResultModel } from '@/domain/models'
import {
  SaveSurveyResult,
  SaveSurveyResultParams,
  LoadSurveyResult,
  LoadSurveyResultParams
} from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

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
