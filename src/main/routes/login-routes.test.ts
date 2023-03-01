import request from 'supertest'
import bcrypt from 'bcrypt'
import { Collection } from 'mongodb'
import app from '../config/app'
import { DbAddAccount } from '@/data/usecases/add-account/db-add-account'
import { DbAuthentication } from '@/data/usecases/authentication/db-authentication'
import {
  MongoHelper,
  Collections
} from '@/infra/db/mongodb/helpers/mongo-helper'

type SignUpRequestBody = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

type LoginRequestBody = Pick<SignUpRequestBody, 'email' | 'password'>

const makeFakeSignUpRequestBody = (): SignUpRequestBody => ({
  name: 'Alan Cintra',
  email: 'alancintra7@gmail.com',
  password: '123456',
  passwordConfirmation: '123456'
})

const makeFakeLoginRequestBody = (): LoginRequestBody => ({
  email: 'alancintra7@gmail.com',
  password: '123456'
})

let accountCollection: Collection

describe('Login Routes', () => {
  const mongoHelper = MongoHelper.getInstance()

  beforeAll(async () => {
    await mongoHelper.connect(String(process.env.MONGO_URL))
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await mongoHelper.getCollection(Collections.ACCOUNTS)
    await accountCollection.deleteMany({})
  })

  describe('[POST] /signup', () => {
    it('should return 400 if invalid body is provided', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Alan Cintra',
          email: 'alancintra7@gmail.com',
          password: '123456'
        })
        .expect(400)
        .expect(res => expect(res.body).toEqual({
          error: expect.any(String)
        }))
    })

    it('should return 500 if unexpected error occurred', async () => {
      jest.spyOn(DbAddAccount.prototype, 'add').mockImplementationOnce(() => {
        throw new Error()
      })
      await request(app)
        .post('/api/signup')
        .send(makeFakeSignUpRequestBody())
        .expect(500)
        .expect(res => expect(res.body).toEqual({
          error: expect.any(String)
        }))
    })

    it('should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send(makeFakeSignUpRequestBody())
        .expect(200)
        .expect(res => expect(res.body).toEqual({
          accessToken: expect.any(String)
        }))
    })
  })

  describe('[POST] /login', () => {
    it('should return 400 if invalid body is provided', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'invalid_email',
          password: '123456'
        })
        .expect(400)
        .expect(res => expect(res.body).toEqual({
          error: expect.any(String)
        }))
    })

    it('should return 401 with invalid credentials', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'alancintra7@gmail.com',
          password: '123456'
        })
        .expect(401)
        .expect(res => expect(res.body).toEqual({
          error: expect.any(String)
        }))
    })

    it('should return 500 if unexpected error occurred', async () => {
      jest.spyOn(DbAuthentication.prototype, 'auth').mockImplementationOnce(
        () => {
          throw new Error()
        })
      await request(app)
        .post('/api/login')
        .send(makeFakeLoginRequestBody())
        .expect(500)
        .expect(res => expect(res.body).toEqual({
          error: expect.any(String)
        }))
    })

    it('should return 200 on login', async () => {
      const password = await bcrypt.hash('123456', 12)
      await accountCollection.insertOne({
        name: 'Alan Cintra',
        email: 'alancintra7@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send(makeFakeLoginRequestBody())
        .expect(200)
        .expect(res => expect(res.body).toEqual({
          accessToken: expect.any(String)
        }))
    })
  })
})
