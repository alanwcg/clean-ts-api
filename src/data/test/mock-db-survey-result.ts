import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { mockSurveyResultModel } from '@/domain/test'
import { LoadSurveyResultParams } from '@/domain/usecases/survey-result/load-survey-result'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  params: SaveSurveyResultParams

  async save (params: SaveSurveyResultParams): Promise<void> {
    this.params = params
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  params: LoadSurveyResultParams
  result: SurveyResultModel = mockSurveyResultModel()

  async loadBySurveyId (params: LoadSurveyResultParams): Promise<SurveyResultModel> {
    this.params = params
    return this.result
  }
}
