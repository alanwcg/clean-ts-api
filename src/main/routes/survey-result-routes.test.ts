import request from 'supertest'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'
import app from '../config/app'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
// import { DbAddSurvey } from '@/data/usecases/survey/add-survey/db-add-survey'
// import { DbLoadSurveys } from '@/data/usecases/survey/load-surveys/db-load-surveys'
import {
  MongoHelper,
  Collections
} from '@/infra/db/mongodb/helpers/mongo-helper'

const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'Question',
  answers: [
    {
      image: 'http://image-name.com',
      answer: 'Answer 1'
    },
    {
      answer: 'Answer 2'
    }
  ],
  date: new Date()
})

let surveyCollection: Collection
let accountCollection: Collection
let accessToken: string

describe('Survey Routes', () => {
  const mongoHelper = MongoHelper.getInstance()

  beforeAll(async () => {
    await mongoHelper.connect(String(process.env.MONGO_URL))
    accountCollection = await mongoHelper.getCollection(Collections.ACCOUNTS)
    const account = await accountCollection.insertOne({
      name: 'Alan Cintra',
      email: 'alancintra7@gmail.com',
      password: '123456'
    })
    const id = account.insertedId.toString()
    accessToken = sign({ id }, env.jwtSecret)
    await accountCollection.updateOne(
      { _id: account.insertedId },
      { $set: { accessToken } }
    )
  })

  afterAll(async () => {
    await accountCollection.deleteMany({})
    await mongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await mongoHelper.getCollection(Collections.SURVEYS)
    await surveyCollection.deleteMany({})
  })

  describe('[PUT] /surveys/:surveyId/results', () => {
    it('should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })
  })

  it('should return 200 on save survey result with accessToken', async () => {
    const res = await surveyCollection.insertOne(mockAddSurveyParams())
    const surveyId = res.insertedId.toString()
    await request(app)
      .put(`/api/surveys/${surveyId}/results`)
      .set('x-access-token', accessToken)
      .send({
        answer: 'Answer 1'
      })
      .expect(200)
  })
})
