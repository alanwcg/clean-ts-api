import {
  SaveSurveyResultRepository,
  LoadSurveyResultRepository
} from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  params: SaveSurveyResultRepository.Params

  async save (params: SaveSurveyResultRepository.Params): Promise<void> {
    this.params = params
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  params: LoadSurveyResultRepository.Params
  result: SurveyResultModel = mockSurveyResultModel()

  async loadBySurveyId (
    params: LoadSurveyResultRepository.Params
  ): Promise<LoadSurveyResultRepository.Result> {
    this.params = params
    return this.result
  }
}
