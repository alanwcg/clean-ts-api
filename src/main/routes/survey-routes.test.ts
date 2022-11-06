import request from 'supertest'
import { Collection } from 'mongodb'
import app from '../config/app'
import { DbAddSurvey } from '../../data/usecases/add-survey/db-add-survey'
import { AddSurveyModel } from '../../domain/usecases/add-survey'
import {
  MongoHelper,
  Collections
} from '../../infra/db/mongodb/helpers/mongo-helper'

const makeFakeSurveysRequestBody = (): AddSurveyModel => ({
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

describe('Survey Routes', () => {
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

  describe('[POST] /surveys', () => {
    it('should return 400 if invalid body is provided', async () => {
      await request(app)
        .post('/api/surveys')
        .send({})
        .expect(400)
        .expect(res => expect(res.body).toEqual({
          error: expect.any(String)
        }))
    })

    it('should return 500 if unexpected error occurred', async () => {
      jest.spyOn(DbAddSurvey.prototype, 'add').mockImplementationOnce(() => {
        throw new Error()
      })
      await request(app)
        .post('/api/surveys')
        .send(makeFakeSurveysRequestBody())
        .expect(500)
        .expect(res => expect(res.body).toEqual({
          error: expect.any(String)
        }))
    })

    it('should return 204 on success', async () => {
      await request(app)
        .post('/api/surveys')
        .send(makeFakeSurveysRequestBody())
        .expect(204)
    })
  })
})
