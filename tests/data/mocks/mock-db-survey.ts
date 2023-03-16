import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  CheckSurveyByIdRepository,
  LoadSurveysRepository,
  LoadAnswersBySurveyRepository
} from '@/data/protocols'
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'

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

export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  id: string
  result: CheckSurveyByIdRepository.Result = true

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
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

export class LoadAnswersBySurveyRepositorySpy implements LoadAnswersBySurveyRepository {
  id: string
  result: LoadAnswersBySurveyRepository.Result = [
    faker.random.words(),
    faker.random.words()
  ]

  async loadAnswers (
    id: string
  ): Promise<LoadAnswersBySurveyRepository.Result> {
    this.id = id
    return this.result
  }
}
