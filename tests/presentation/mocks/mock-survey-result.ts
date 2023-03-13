import { SurveyResultModel } from '@/domain/models'
import {
  SaveSurveyResult,
  LoadSurveyResult
} from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  params: SaveSurveyResult.Params
  result: SurveyResultModel = mockSurveyResultModel()

  async save (
    params: SaveSurveyResult.Params
  ): Promise<SaveSurveyResult.Result> {
    this.params = params
    return this.result
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  params: LoadSurveyResult.Params
  result: SurveyResultModel = mockSurveyResultModel()

  async load (
    params: LoadSurveyResult.Params
  ): Promise<LoadSurveyResult.Result> {
    this.params = params
    return this.result
  }
}
