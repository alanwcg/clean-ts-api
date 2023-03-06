import { Collection } from 'mongodb'
import { AccountMongoRepository } from './account-mongo-repository'
import { Collections, MongoHelper } from '../helpers/mongo-helper'
import { mockAddAccountParams } from '@/domain/test'

let accountCollection: Collection

const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

describe('Account Mongo Repository', () => {
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
      const account = await sut.add(mockAddAccountParams())
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('loadByEmail()', () => {
    it('should return an account on success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(mockAddAccountParams())
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })

    it('should return null if fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    it('should update account accessToken on success', async () => {
      const sut = makeSut()
      const account = mockAddAccountParams()
      const { insertedId } = await accountCollection.insertOne(account)
      expect(account).not.toHaveProperty('accessToken')
      await sut.updateAccessToken({
        id: insertedId.toString(),
        accessToken: 'any_token'
      })
      const updatedAccount = await accountCollection.findOne({ _id: insertedId })
      expect(updatedAccount).toBeTruthy()
      expect(updatedAccount?.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    it('should return an account without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken({ token: 'any_token' })
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })

    it('should return an account with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken({
        token: 'any_token',
        role: 'admin'
      })
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })

    it('should return null with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken({
        token: 'any_token',
        role: 'admin'
      })
      expect(account).toBeFalsy()
    })

    it('should return an account if user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken({ token: 'any_token' })
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })

    it('should return null if fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken({ token: 'any_token' })
      expect(account).toBeFalsy()
    })
  })
})
