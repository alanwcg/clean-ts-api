import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper, Collections } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper
      .getInstance().getCollection(Collections.ACCOUNTS)
    const { insertedId } = await accountCollection.insertOne(accountData)
    const { name, email, password } = accountData
    return {
      id: insertedId.toString(),
      name,
      email,
      password
    }
  }
}
