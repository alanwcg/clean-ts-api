import request from 'supertest'
import {
  MongoHelper,
  Collections
} from '../../infra/db/mongodb/helpers/mongo-helper'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import app from '../config/app'

describe('SignUp Routes', () => {
  const mongoHelper = MongoHelper.getInstance()

  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await mongoHelper.getCollection(Collections.ACCOUNTS)
    await accountCollection.deleteMany({})
  })

  it('should return 500 if unexpected error occurred', async () => {
    jest.spyOn(DbAddAccount.prototype, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Alan Cintra',
        email: 'alancintra7@gmail.com',
        password: '123456',
        passwordConfirmation: '123456'
      })
      .expect(500)
  })

  it('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Alan Cintra',
        email: 'alancintra7@gmail.com',
        password: '123456',
        passwordConfirmation: '123456'
      })
      .expect(200)
  })
})
