import env from '@/main/config/env'
import { JwtAdapter } from '@/infra/cryptography'
import { AccountMongoRepository } from '@/infra/db'
import { DbLoadAccountByToken } from '@/data/usecases'

export const makeDbLoadAccountByToken = (): DbLoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(
    jwtAdapter,
    accountMongoRepository
  )
}
