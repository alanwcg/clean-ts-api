import { faker } from '@faker-js/faker'
import { SurveyModel } from '@/domain/models'
import { AddSurvey } from '@/domain/usecases'

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: faker.lorem.text(),
  answers: [
    {
      image: faker.random.word(),
      answer: faker.lorem.text()
    },
    {
      answer: faker.lorem.text()
    }
  ],
  date: faker.date.recent()
})

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.datatype.uuid(),
  question: faker.lorem.text(),
  answers: [
    {
      image: faker.random.word(),
      answer: faker.lorem.text()
    },
    {
      answer: faker.lorem.text()
    }
  ],
  date: faker.date.recent()
})

export const mockSurveyModels = (): SurveyModel[] => ([
  {
    id: faker.datatype.uuid(),
    question: faker.lorem.text(),
    answers: [
      {
        image: faker.random.word(),
        answer: faker.lorem.text()
      }
    ],
    date: faker.date.recent()
  },
  {
    id: faker.datatype.uuid(),
    question: faker.lorem.text(),
    answers: [
      {
        image: faker.random.word(),
        answer: faker.lorem.text()
      }
    ],
    date: faker.date.recent()
  }
])
