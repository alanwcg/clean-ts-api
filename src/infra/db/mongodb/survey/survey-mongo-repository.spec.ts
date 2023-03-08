import { Collection, Document } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { Collections, MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

let surveyCollection: Collection

const mockAddSurveyParams = (): AddSurveyParams => ({
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
})

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository()

describe('Survey Mongo Repository', () => {
  const mongoHelper = MongoHelper.getInstance()

  beforeAll(async () => {
    await mongoHelper.connect(String(process.env.MONGO_URL))
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await mongoHelper.getCollection(Collections.SURVEYS)
    await surveyCollection.deleteMany({})
  })

  describe('add()', () => {
    it('should return a survey on success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyParams())
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      await surveyCollection.insertMany([
        mockAddSurveyParams(),
        { ...mockAddSurveyParams(), question: 'other_question' }
      ])
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })

    it('should load an empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    it('should load survey by id on success', async () => {
      const fakeSurveyData = mockAddSurveyParams() as Document
      await surveyCollection.insertOne(fakeSurveyData)
      const sut = makeSut()
      const survey = await sut.loadById(fakeSurveyData._id.toString())
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })

    it('should return null if id is not a valid MongoDb ObjectId', async () => {
      const sut = makeSut()
      const survey = await sut.loadById('invalid_object_id')
      expect(survey).toBeFalsy()
    })

    it('should return null if fails', async () => {
      const sut = makeSut()
      const survey = await sut.loadById('64035b3dd52431dc42b33826')
      expect(survey).toBeFalsy()
    })
  })
})
