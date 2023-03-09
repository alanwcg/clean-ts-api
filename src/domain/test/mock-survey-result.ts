import { faker } from '@faker-js/faker'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: faker.datatype.uuid(),
  surveyId: faker.datatype.uuid(),
  answer: faker.lorem.text(),
  date: faker.date.recent()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.datatype.uuid(),
  question: faker.lorem.text(),
  answers: [
    {
      image: faker.random.word(),
      answer: faker.lorem.text(),
      count: 0,
      percent: 0
    },
    {
      answer: faker.lorem.text(),
      count: 0,
      percent: 0
    }
  ],
  date: faker.date.recent()
})
