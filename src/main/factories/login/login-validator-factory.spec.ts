import {
  EmailValidation,
  RequiredFieldValidator,
  ValidatorComposite
} from '../../../presentation/helpers/validators'
import { EmailValidator, Validator } from '../../../presentation/protocols'
import { makeLoginValidator } from './login-validator-factory'

jest.mock('../../../presentation/helpers/validators/validator-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Login Validator Factory', () => {
  it('should call ValidatorComposite with all validators', () => {
    makeLoginValidator()
    const validators: Validator[] = []
    for (const field of ['email', 'password']) {
      validators.push(new RequiredFieldValidator(field))
    }
    validators.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})