import {
  AddSurvey,
  AddSurveyParams
} from '@/domain/usecases/survey/add-survey'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { mockSurveyModel, mockSurveyModels } from '@/domain/test'

export class AddSurveySpy implements AddSurvey {
  params: AddSurveyParams

  async add (params: AddSurveyParams): Promise<void> {
    this.params = params
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  callsCount: number = 0
  result: SurveyModel[] = mockSurveyModels()

  async load (): Promise<SurveyModel[]> {
    this.callsCount += 1
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
