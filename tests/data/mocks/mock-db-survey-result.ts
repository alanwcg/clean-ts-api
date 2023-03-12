import {
  SaveSurveyResultRepository,
  LoadSurveyResultRepository
} from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'
import {
  SaveSurveyResultParams,
  LoadSurveyResultParams
} from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

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
