import env from '@/main/config/env'
import { AccountMongoRepository } from '@/infra/db'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { DbAuthentication } from '@/data/usecases'

export const makeDbAuthentication = (): DbAuthentication => {
  const SALT = 12
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(SALT)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )
}
