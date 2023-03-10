import { Collection, Document, ObjectId, WithId } from 'mongodb'
import { faker } from '@faker-js/faker'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { Collections, MongoHelper } from '../helpers/mongo-helper'
import { AccountModel } from '@/domain/models/account'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection
let mongoHelper: MongoHelper

const mockAccount = async (): Promise<AccountModel> => {
  const accountData = mockAddAccountParams()
  await accountCollection.insertOne(accountData)
  return mongoHelper.map(accountData)
}

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository()

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

  describe('add()', () => {
    it('should return a survey on success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyParams())
      const count = await surveyCollection.countDocuments()
      expect(count).toBe(1)
    })
  })

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      const account = await mockAccount()
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      await surveyCollection.insertMany(addSurveyModels)
      const survey = addSurveyModels[0] as WithId<AddSurveyParams>
      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    it('should load an empty list', async () => {
      const account = await mockAccount()
      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    it('should load survey by id on success', async () => {
      const surveyData = mockAddSurveyParams() as Document
      await surveyCollection.insertOne(surveyData)
      const sut = makeSut()
      const survey = await sut.loadById(surveyData._id.toString())
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })

    it('should return null if id is not a valid MongoDb ObjectId', async () => {
      const sut = makeSut()
      const survey = await sut.loadById(faker.datatype.uuid())
      expect(survey).toBeFalsy()
    })

    it('should return null if fails', async () => {
      const sut = makeSut()
      const survey = await sut.loadById(new ObjectId().toString())
      expect(survey).toBeFalsy()
    })
  })
})
