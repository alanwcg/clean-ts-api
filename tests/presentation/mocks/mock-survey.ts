import { faker } from '@faker-js/faker'
import {
  AddSurvey,
  LoadSurveys,
  LoadAnswersBySurvey,
  CheckSurveyById
} from '@/domain/usecases'
import { mockSurveyModels } from '@/tests/domain/mocks'

export class AddSurveySpy implements AddSurvey {
  params: AddSurvey.Params

  async add (params: AddSurvey.Params): Promise<void> {
    this.params = params
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  accountId: string
  result: LoadSurveys.Result = mockSurveyModels()

  async load (accountId: string): Promise<LoadSurveys.Result> {
    this.accountId = accountId
    return this.result
  }
}

export class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
  id: string
  result: LoadAnswersBySurvey.Result = [
    faker.random.words(),
    faker.random.words()
  ]

  async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
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
