import request from 'supertest'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'
import app from '@/main/config/app'
import { MongoHelper, Collections } from '@/infra/db'
import { mockAddSurveyParams } from '@/tests/domain/mocks'

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

    it('should return 200 on save survey result with accessToken', async () => {
      const params = mockAddSurveyParams()
      const res = await surveyCollection.insertOne(params)
      const surveyId = res.insertedId.toString()
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: params.answers[0].answer
        })
        .expect(200)
    })
  })

  describe('[GET] /surveys/:surveyId/results', () => {
    it('should return 403 on load survey result without accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })

    it('should return 200 on load survey result with accessToken', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const surveyId = res.insertedId.toString()
      await request(app)
        .get(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
