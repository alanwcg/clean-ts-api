import { Collections, MongoHelper } from '../helpers/mongo-helper'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getInstance()
      .getCollection(Collections.ERRORS)
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
