import { Collection } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { Collections, MongoHelper } from '../helpers/mongo-helper'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection
let mongoHelper: MongoHelper

const makeFakeSurvey = async (): Promise<SurveyModel> => {
  const fakeSurveyData = {
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer'
      },
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  }
  await surveyCollection.insertOne(fakeSurveyData)
  return mongoHelper.map(fakeSurveyData)
}

const makeFakeAccount = async (): Promise<AccountModel> => {
  const fakeAccountData = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
  await accountCollection.insertOne(fakeAccountData)
  return mongoHelper.map(fakeAccountData)
}

const makeFakeSurveyResultData = async (
  data: SaveSurveyResultModel
): Promise<SurveyResultModel> => {
  await surveyResultCollection.insertOne(data)
  return mongoHelper.map(data)
}

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}
describe('Survey Mongo Repository', () => {
  mongoHelper = MongoHelper.getInstance()

  beforeAll(async () => {
    await mongoHelper.connect(String(process.env.MONGO_URL))
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await mongoHelper.getCollection(Collections.SURVEYS)
    await surveyCollection.deleteMany({})
    surveyResultCollection = await mongoHelper.getCollection(
      Collections.SURVEY_RESULTS
    )
    await surveyResultCollection.deleteMany({})
    accountCollection = await mongoHelper.getCollection(Collections.ACCOUNTS)
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    it('should add a survey result if its new', async () => {
      const survey = await makeFakeSurvey()
      const account = await makeFakeAccount()
      const sut = makeSut()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })

    it('should update survey result if its not new', async () => {
      const survey = await makeFakeSurvey()
      const account = await makeFakeAccount()
      const res = await makeFakeSurveyResultData({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBe(res.id)
      expect(surveyResult.answer).toBe(survey.answers[1].answer)
    })
  })
})
