import { Collection, ObjectId } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { Collections, MongoHelper } from '../helpers/mongo-helper'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'
import { mockAddSurveyParams, mockAddAccountParams } from '@/domain/test'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection
let mongoHelper: MongoHelper

const makeSurvey = async (): Promise<SurveyModel> => {
  const surveyData = mockAddSurveyParams()
  await surveyCollection.insertOne(surveyData)
  return mongoHelper.map(surveyData)
}

const makeAccount = async (): Promise<AccountModel> => {
  const accountData = mockAddAccountParams()
  await accountCollection.insertOne(accountData)
  return mongoHelper.map(accountData)
}

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}
describe('SurveyMongoRepository', () => {
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
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSut()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id)
      })
      expect(surveyResult).toBeTruthy()
    })

    it('should update survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.find({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id)
      }).toArray()
      expect(surveyResult.length).toBe(1)
    })
  })

  describe('loadBySurveyId()', () => {
    it('should load survey result', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[0].answer,
          date: new Date()
        }
      ])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toBe(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
    })
  })
})
