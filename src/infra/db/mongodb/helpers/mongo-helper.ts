import { MongoClient, Collection, Document } from 'mongodb'

export enum Collections {
  ACCOUNTS = 'accounts',
  SURVEYS = 'surveys',
  ERRORS = 'errors'
}

export class MongoHelper {
  private static instance: MongoHelper
  private client: MongoClient
  private uri: string

  private constructor () {}

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  }

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  }

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri)
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
