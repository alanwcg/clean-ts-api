import { ObjectId } from 'mongodb'
import { MongoHelper, Collections } from '@/infra/db'
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  UpdateParams,
  LoadAccountByTokenRepository,
  LoadByTokenParams
} from '@/data/protocols'
import { AddAccountParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'

export class AccountMongoRepository implements
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository {
  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const mongoHelper = MongoHelper.getInstance()
    const accountCollection = await mongoHelper.getCollection(Collections.ACCOUNTS)
    await accountCollection.insertOne(accountData)
    return mongoHelper.map(accountData)
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const mongoHelper = MongoHelper.getInstance()
    const accountCollection = await mongoHelper.getCollection(Collections.ACCOUNTS)
    const account = await accountCollection.findOne<AccountModel>({ email })
    return account && mongoHelper.map(account)
  }

  async updateAccessToken ({ id, accessToken }: UpdateParams): Promise<void> {
    const mongoHelper = MongoHelper.getInstance()
    const accountCollection = await mongoHelper.getCollection(Collections.ACCOUNTS)
    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { accessToken } }
    )
  }

  async loadByToken ({ token, role }: LoadByTokenParams): Promise<AccountModel | null> {
    const mongoHelper = MongoHelper.getInstance()
    const accountCollection = await mongoHelper.getCollection(Collections.ACCOUNTS)
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
