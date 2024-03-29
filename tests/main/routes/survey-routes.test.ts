import request from 'supertest'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import app from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper, Collections } from '@/infra/db'
import { DbAddSurvey, DbLoadSurveys } from '@/data/usecases'
import { AddSurvey } from '@/domain/usecases'
import { throwError } from '@/tests/domain/mocks'

const mockAddSurveyParams = (): Omit<AddSurvey.Params, 'date'> => ({
  question: 'Question',
  answers: [
    {
      image: 'http://image-name.com',
      answer: 'Answer 1'
    },
    {
      answer: 'Answer 2'
    }
  ]
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
      password: 'any_value',
      role: 'admin'
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

  describe('[POST] /surveys', () => {
    it('should return 400 if invalid body is provided', async () => {
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({})
        .expect(400)
    })

    it('should return 403 without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send(mockAddSurveyParams())
        .expect(403)
    })

    it('should return 500 if unexpected error occurred', async () => {
      jest.spyOn(DbAddSurvey.prototype, 'add').mockImplementationOnce(
        throwError
      )
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(mockAddSurveyParams())
        .expect(500)
    })

    it('should return 204 with valid token', async () => {
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(mockAddSurveyParams())
        .expect(204)
    })
  })

  describe('[GET] /surveys', () => {
    it('should return 403 without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    it('should return 500 if unexpected error occurred', async () => {
      jest.spyOn(DbLoadSurveys.prototype, 'load').mockImplementationOnce(
        throwError
      )
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(500)
    })

    it('should return 204 on success', async () => {
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })
  })
})
