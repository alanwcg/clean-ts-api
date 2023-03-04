import { ObjectId } from 'mongodb'
import { MongoHelper, Collections } from '../helpers/mongo-helper'
import { AddAccountModel } from '@/domain/usecases/add-account'
import { AccountModel } from '@/domain/models/account'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository, UpdateParams } from '@/data/protocols/db/account/update-access-token-repository'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'

export class AccountMongoRepository implements
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const mongoHelper = MongoHelper.getInstance()
    const accountCollection = await mongoHelper.getCollection(Collections.ACCOUNTS)
    await accountCollection.insertOne(accountData)
    return mongoHelper.map(accountData)
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const mongoHelper = MongoHelper.getInstance()
    const accountCollection = await mongoHelper.getCollection(Collections.ACCOUNTS)
    const account = await accountCollection.findOne<AccountModel>({ email })
    if (account) {
      return mongoHelper.map(account)
    }
    return null
  }

  async updateAccessToken ({ id, accessToken }: UpdateParams): Promise<void> {
    const mongoHelper = MongoHelper.getInstance()
    const accountCollection = await mongoHelper.getCollection(Collections.ACCOUNTS)
    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { accessToken } }
    )
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel | null> {
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
    if (account) {
      return mongoHelper.map(account)
    }
    return null
  }
}
