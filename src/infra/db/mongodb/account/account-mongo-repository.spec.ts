import { Collection } from 'mongodb'
import { AccountMongoRepository } from './account-mongo-repository'
import { Collections, MongoHelper } from '../helpers/mongo-helper'
import { mockAddAccountParams } from '@/domain/test'
import { faker } from '@faker-js/faker'

let accountCollection: Collection

const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

describe('AccountMongoRepository', () => {
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

  describe('add()', () => {
    it('should return an account on success', async () => {
      const sut = makeSut()
      const params = mockAddAccountParams()
      const account = await sut.add(params)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(params.name)
      expect(account.email).toBe(params.email)
      expect(account.password).toBe(params.password)
    })
  })

  describe('loadByEmail()', () => {
    it('should return an account on success', async () => {
      const sut = makeSut()
      const params = mockAddAccountParams()
      await accountCollection.insertOne(params)
      const account = await sut.loadByEmail(params.email)
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(params.name)
      expect(account?.email).toBe(params.email)
      expect(account?.password).toBe(params.password)
    })

    it('should return null if fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail(faker.internet.email())
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    it('should update account accessToken on success', async () => {
      const sut = makeSut()
      const params = mockAddAccountParams()
      const { insertedId } = await accountCollection.insertOne(params)
      expect(params).not.toHaveProperty('accessToken')
      const accessToken = faker.datatype.uuid()
      await sut.updateAccessToken({
        id: insertedId.toString(),
        accessToken
      })
      const updatedAccount = await accountCollection.findOne({ _id: insertedId })
      expect(updatedAccount).toBeTruthy()
      expect(updatedAccount?.accessToken).toBe(accessToken)
    })
  })

  describe('loadByToken()', () => {
    it('should return an account without role', async () => {
      const sut = makeSut()
      const params = mockAddAccountParams()
      const accessToken = faker.datatype.uuid()
      await accountCollection.insertOne({
        ...params,
        accessToken
      })
      const account = await sut.loadByToken({ token: accessToken })
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(params.name)
      expect(account?.email).toBe(params.email)
      expect(account?.password).toBe(params.password)
    })

    it('should return an account with admin role', async () => {
      const sut = makeSut()
      const params = mockAddAccountParams()
      const accessToken = faker.datatype.uuid()
      await accountCollection.insertOne({
        ...params,
        accessToken,
        role: 'admin'
      })
      const account = await sut.loadByToken({
        token: accessToken,
        role: 'admin'
      })
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(params.name)
      expect(account?.email).toBe(params.email)
      expect(account?.password).toBe(params.password)
    })

    it('should return null with invalid role', async () => {
      const sut = makeSut()
      const params = mockAddAccountParams()
      const accessToken = faker.datatype.uuid()
      await accountCollection.insertOne({
        ...params,
        accessToken
      })
      const account = await sut.loadByToken({
        token: accessToken,
        role: 'admin'
      })
      expect(account).toBeFalsy()
    })

    it('should return an account if user is admin', async () => {
      const sut = makeSut()
      const params = mockAddAccountParams()
      const accessToken = faker.datatype.uuid()
      await accountCollection.insertOne({
        ...params,
        accessToken,
        role: 'admin'
      })
      const account = await sut.loadByToken({ token: accessToken })
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(params.name)
      expect(account?.email).toBe(params.email)
      expect(account?.password).toBe(params.password)
    })

    it('should return null if fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken({ token: faker.datatype.uuid() })
      expect(account).toBeFalsy()
    })
  })
})
