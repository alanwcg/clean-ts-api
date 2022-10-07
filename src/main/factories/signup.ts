import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'
import { makeSignUpValidator } from './signup-validator'

export const makeSignUpController = (): Controller => {
  const SALT = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const encrypterAdapter = new BcryptAdapter(SALT)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(
    encrypterAdapter,
    accountMongoRepository
  )
  const signUpController = new SignUpController(
    makeSignUpValidator(),
    emailValidatorAdapter,
    dbAddAccount
  )
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
