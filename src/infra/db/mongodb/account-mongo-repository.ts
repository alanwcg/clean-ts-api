import { ObjectId } from 'mongodb'
import { MongoHelper, Collections } from '@/infra/db'
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository
} from '@/data/protocols'
import { AccountModel } from '@/domain/models'

export class AccountMongoRepository implements
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository {
  async add (
    params: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    const mongoHelper = MongoHelper.getInstance()
    const accountCollection = await mongoHelper.getCollection(
      Collections.ACCOUNTS
    )
    await accountCollection.insertOne(params)
    return mongoHelper.map(params)
  }

  async loadByEmail (
    email: string
  ): Promise<LoadAccountByEmailRepository.Result> {
    const mongoHelper = MongoHelper.getInstance()
    const accountCollection = await mongoHelper.getCollection(
      Collections.ACCOUNTS
    )
    const account = await accountCollection.findOne<AccountModel>({ email })
    return account && mongoHelper.map(account)
  }

  async updateAccessToken ({
    id,
    accessToken
  }: UpdateAccessTokenRepository.Params): Promise<void> {
    const mongoHelper = MongoHelper.getInstance()
    const accountCollection = await mongoHelper.getCollection(
      Collections.ACCOUNTS
    )
    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { accessToken } }
    )
  }

  async loadByToken ({
    token,
    role
  }: LoadAccountByTokenRepository.Params): Promise<LoadAccountByTokenRepository.Result> {
    const mongoHelper = MongoHelper.getInstance()
    const accountCollection = await mongoHelper.getCollection(
      Collections.ACCOUNTS
    )
    const account = await accountCollection.findOne<AccountModel>({
      accessToken: token,
      $or: [
        {
          role
        },
        {
          role: 'admin'
        }
      ]
    })
    return account && mongoHelper.map(account)
  }
}
