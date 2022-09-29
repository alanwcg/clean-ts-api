import { MongoClient, Collection, Document } from 'mongodb'

export enum Collections {
  ACCOUNTS = 'accounts'
}

export class MongoHelper {
  private static instance: MongoHelper
  private client: MongoClient
  private url: string

  private constructor () {}

  async connect (url: string): Promise<void> {
    this.url = url
    this.client = await MongoClient.connect(url)
  }

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  }

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.url)
    }
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
