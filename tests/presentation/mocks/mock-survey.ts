import { SurveyModel } from '@/domain/models'
import {
  AddSurvey,
  AddSurveyParams,
  LoadSurveys,
  LoadSurveyById
} from '@/domain/usecases'
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks'

export class AddSurveySpy implements AddSurvey {
  params: AddSurveyParams

  async add (params: AddSurveyParams): Promise<void> {
    this.params = params
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  accountId: string
  result: SurveyModel[] = mockSurveyModels()

  async load (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return this.result
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  id: string
  result: SurveyModel = mockSurveyModel()

  async loadById (id: string): Promise<SurveyModel> {
    this.id = id
    return this.result
  }
}
