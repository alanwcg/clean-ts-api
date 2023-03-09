import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { mockSurveyModel, mockSurveyModels } from '@/domain/test'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  params: AddSurveyParams

  async add (params: AddSurveyParams): Promise<void> {
    this.params = params
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  id: string
  result: SurveyModel = mockSurveyModel()

  async loadById (id: string): Promise<SurveyModel> {
    this.id = id
    return this.result
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  callsCount: number = 0
  result: SurveyModel[] = mockSurveyModels()

  async loadAll (): Promise<SurveyModel[]> {
    this.callsCount += 1
    return this.result
  }
}
