import { Collection } from 'mongodb'
import { faker } from '@faker-js/faker'
import { LogMongoRepository } from './log-mongo-repository'
import { Collections, MongoHelper } from '../helpers/mongo-helper'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('LogMongoRepository', () => {
  const mongoHelper = MongoHelper.getInstance()
  let errorCollection: Collection

  beforeAll(async () => {
    await mongoHelper.connect(String(process.env.MONGO_URL))
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
    const sut = makeSut()
    await sut.logError(faker.random.words())
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
