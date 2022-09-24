import { MongoClient } from 'mongodb'

export class MongoHelper {
  private static instance: MongoHelper
  private client: MongoClient

  private constructor () {}

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  }

  async disconnect (): Promise<void> {
    await this.client.close()
  }

  static getInstance (): MongoHelper {
    if (!MongoHelper.instance) {
      MongoHelper.instance = new MongoHelper()
    }

    return MongoHelper.instance
  }
}
