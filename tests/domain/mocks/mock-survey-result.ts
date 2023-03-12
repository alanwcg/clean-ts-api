import { faker } from '@faker-js/faker'
import { SurveyResultModel } from '@/domain/models'
import {
  SaveSurveyResultParams,
  LoadSurveyResultParams
} from '@/domain/usecases'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: faker.datatype.uuid(),
  surveyId: faker.datatype.uuid(),
  answer: faker.lorem.text(),
  date: faker.date.recent()
})

export const mockLoadSurveyResultParams = (): LoadSurveyResultParams => ({
  surveyId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.datatype.uuid(),
  question: faker.lorem.text(),
  answers: [
    {
      image: faker.random.word(),
      answer: faker.lorem.text(),
      count: faker.datatype.number(),
      percent: faker.datatype.number(),
      isCurrentAccountAnswer: faker.datatype.boolean()
    },
    {
      answer: faker.lorem.text(),
      count: faker.datatype.number(),
      percent: faker.datatype.number(),
      isCurrentAccountAnswer: faker.datatype.boolean()
    }
  ],
  date: faker.date.recent()
})

export const mockEmptySurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.datatype.uuid(),
  question: faker.lorem.text(),
  answers: [
    {
      image: faker.random.word(),
      answer: faker.lorem.text(),
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false
    },
    {
      answer: faker.lorem.text(),
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false
    }
  ],
  date: faker.date.recent()
})
