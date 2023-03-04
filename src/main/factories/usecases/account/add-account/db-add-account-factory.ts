import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

export const makeDbAddAccount = (): DbAddAccount => {
  const SALT = 12
  const bcryptAdapter = new BcryptAdapter(SALT)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAddAccount(
    accountMongoRepository,
    bcryptAdapter,
    accountMongoRepository
  )
}
