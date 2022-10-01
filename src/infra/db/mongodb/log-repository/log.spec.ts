import { Collection } from 'mongodb'
import { Collections, MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

describe('Log Mongo Repository', () => {
  const mongoHelper = MongoHelper.getInstance()
  let errorCollection: Collection

  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await mongoHelper.getCollection(
      Collections.ERRORS
    )
    await errorCollection.deleteMany({})
  })

  it('should create an error log on success', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
