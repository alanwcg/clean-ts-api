import { SurveyModel } from '@/domain/models'
import {
  AddSurvey,
  LoadSurveys,
  LoadSurveyById,
  CheckSurveyById
} from '@/domain/usecases'
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks'

export class AddSurveySpy implements AddSurvey {
  params: AddSurvey.Params

  async add (params: AddSurvey.Params): Promise<void> {
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

export class CheckSurveyByIdSpy implements CheckSurveyById {
  id: string
  result: CheckSurveyById.Result = true

  async checkById (id: string): Promise<CheckSurveyById.Result> {
    this.id = id
    return this.result
  }
}
