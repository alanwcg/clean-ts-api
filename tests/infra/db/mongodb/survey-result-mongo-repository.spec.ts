import { Collection, Document, ObjectId } from 'mongodb'
import {
  SurveyResultMongoRepository,
  Collections,
  MongoHelper
} from '@/infra/db'
import { SurveyModel } from '@/domain/models'
import { mockAddSurveyParams, mockAddAccountParams } from '@/tests/domain/mocks'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection
let mongoHelper: MongoHelper

const mockSurvey = async (): Promise<SurveyModel> => {
  const surveyData = mockAddSurveyParams()
  await surveyCollection.insertOne(surveyData)
  return mongoHelper.map(surveyData)
}

const mockAccountId = async (): Promise<string> => {
  const accountData = mockAddAccountParams() as Document
  await accountCollection.insertOne(accountData)
  return accountData._id.toString()
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
      const survey = await mockSurvey()
      const accountId = await mockAccountId()
      const sut = makeSut()
      await sut.save({
        surveyId: survey.id,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId)
      })
      expect(surveyResult).toBeTruthy()
    })

    it('should update survey result if its not new', async () => {
      const survey = await mockSurvey()
      const accountId = await mockAccountId()
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      await sut.save({
        surveyId: survey.id,
        accountId,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.find({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId)
      }).toArray()
      expect(surveyResult.length).toBe(1)
    })
  })

  describe('loadBySurveyId()', () => {
    it('should load survey result', async () => {
      const survey = await mockSurvey()
      const accountId = await mockAccountId()
      const accountId2 = await mockAccountId()
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId2),
          answer: survey.answers[0].answer,
          date: new Date()
        }
      ])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId({
        surveyId: survey.id,
        accountId
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toBe(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    it('should load survey result 2', async () => {
      const survey = await mockSurvey()
      const accountId = await mockAccountId()
      const accountId2 = await mockAccountId()
      const accountId3 = await mockAccountId()
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId2),
          answer: survey.answers[1].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId3),
          answer: survey.answers[1].answer,
          date: new Date()
        }
      ])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId({
        surveyId: survey.id,
        accountId: accountId2
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toBe(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(67)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(33)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    it('should load survey result 3', async () => {
      const survey = await mockSurvey()
      const accountId = await mockAccountId()
      const accountId2 = await mockAccountId()
      const accountId3 = await mockAccountId()
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId2),
          answer: survey.answers[1].answer,
          date: new Date()
        }
      ])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId({
        surveyId: survey.id,
        accountId: accountId3
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toBe(survey.id)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    it('should return null if there is no survey result', async () => {
      const survey = await mockSurvey()
      const accountId = await mockAccountId()
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId({
        surveyId: survey.id,
        accountId
      })
      expect(surveyResult).toBe(null)
    })
  })
})
