import { MongoClient, Collection, Document } from 'mongodb'

export enum Collections {
  ACCOUNTS = 'accounts'
}

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

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  }

  mapper<T> (document: Document): T {
    const { _id, ...rest } = document
    return Object.assign({}, { id: _id.toString() }, rest) as T
  }

  static getInstance (): MongoHelper {
    if (!MongoHelper.instance) {
      MongoHelper.instance = new MongoHelper()
    }

    return MongoHelper.instance
  }
}
