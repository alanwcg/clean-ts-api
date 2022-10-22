import { Collections, MongoHelper } from './mongo-helper'

describe('Mongo Helper', () => {
  const sut = MongoHelper.getInstance()

  beforeAll(async () => {
    await sut.connect(String(process.env.MONGO_URL))
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  it('should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection(Collections.ACCOUNTS)
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection(Collections.ACCOUNTS)
    expect(accountCollection).toBeTruthy()
  })
})
