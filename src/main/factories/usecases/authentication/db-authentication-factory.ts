import env from '../../../config/env'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication'

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
