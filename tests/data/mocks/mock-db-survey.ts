import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository
} from '@/data/protocols'
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  params: AddSurveyRepository.Params

  async add (params: AddSurveyRepository.Params): Promise<void> {
    this.params = params
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  id: string
  result: LoadSurveyByIdRepository.Result = mockSurveyModel()

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    this.id = id
    return this.result
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  accountId: string
  result: LoadSurveysRepository.Result = mockSurveyModels()

  async loadAll (accountId: string): Promise<LoadSurveysRepository.Result> {
    this.accountId = accountId
    return this.result
  }
}
