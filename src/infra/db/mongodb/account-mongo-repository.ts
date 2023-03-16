import { ObjectId } from 'mongodb'
import { MongoHelper, Collections } from '@/infra/db'
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository,
  CheckAccountByEmailRepository
} from '@/data/protocols'

export class AccountMongoRepository implements
  AddAccountRepository,
  LoadAccountByEmailRepository,
  CheckAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository {
  private readonly mongoHelper: MongoHelper

  constructor () {
    this.mongoHelper = MongoHelper.getInstance()
  }

  async add (
    params: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    const accountCollection = await this.mongoHelper.getCollection(
      Collections.ACCOUNTS
    )
    const result = await accountCollection.insertOne(params)
    return result.acknowledged
  }

  async loadByEmail (
    email: string
  ): Promise<LoadAccountByEmailRepository.Result> {
    const accountCollection = await this.mongoHelper.getCollection(
      Collections.ACCOUNTS
    )
    const account = await accountCollection.findOne<LoadAccountByEmailRepository.Result>(
      { email },
      {
        projection: {
          _id: 1,
          name: 1,
          password: 1
        }
      }
    )
    return account && this.mongoHelper.map(account)
  }

  async checkByEmail (
    email: string
  ): Promise<CheckAccountByEmailRepository.Result> {
    const accountCollection = await this.mongoHelper.getCollection(
      Collections.ACCOUNTS
    )
    const account = await accountCollection.findOne(
      { email },
      {
        projection: {
          _id: 1
        }
      }
    )
    return !!account
  }

  async updateAccessToken ({
    id,
    accessToken
  }: UpdateAccessTokenRepository.Params): Promise<void> {
    const accountCollection = await this.mongoHelper.getCollection(
      Collections.ACCOUNTS
    )
    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { accessToken } }
    )
  }

  async loadByToken ({
    accessToken,
    role
  }: LoadAccountByTokenRepository.Params): Promise<LoadAccountByTokenRepository.Result> {
    const accountCollection = await this.mongoHelper.getCollection(
      Collections.ACCOUNTS
    )
    const account = await accountCollection.findOne<LoadAccountByTokenRepository.Result>({
      accessToken,
      $or: [
        {
          role
        },
        {
          role: 'admin'
        }
      ]
    }, {
      projection: {
        _id: 1
      }
    })
    return account && this.mongoHelper.map(account)
  }
}
