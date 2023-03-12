import { BcryptAdapter } from '@/infra/cryptography'
import { AccountMongoRepository } from '@/infra/db'
import { DbAddAccount } from '@/data/usecases'

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
