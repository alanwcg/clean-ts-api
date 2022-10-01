import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'
import { Collections, MongoHelper } from '../helpers/mongo-helper'

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
