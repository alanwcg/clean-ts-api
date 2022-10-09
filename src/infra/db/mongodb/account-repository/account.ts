import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper, Collections } from '../helpers/mongo-helper'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository, UpdateParams } from '../../../../data/protocols/db/update-access-token-repository'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const mongoHelper = MongoHelper.getInstance()
    const accountCollection = await mongoHelper.getCollection(Collections.ACCOUNTS)
    await accountCollection.insertOne(accountData)
    return mongoHelper.mapper<AccountModel>(accountData)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const mongoHelper = MongoHelper.getInstance()
    const accountCollection = await mongoHelper.getCollection(Collections.ACCOUNTS)
    const account = await accountCollection.findOne<AccountModel>({ email })
    if (account) {
      return mongoHelper.mapper(account)
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
}
