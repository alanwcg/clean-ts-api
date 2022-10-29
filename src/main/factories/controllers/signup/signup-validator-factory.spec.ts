import {
  CompareFieldsValidator,
  EmailValidation,
  RequiredFieldValidator,
  ValidatorComposite
} from '../../../../validation/validators'
import { Validator } from '../../../../presentation/protocols'
import { EmailValidator } from '../../../../validation/protocols'
import { makeSignUpValidator } from './signup-validator-factory'

jest.mock('../../../../validation/validators/validator-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUp Validator Factory', () => {
  it('should call ValidatorComposite with all validators', () => {
    makeSignUpValidator()
    const validators: Validator[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validators.push(new RequiredFieldValidator(field))
    }
    validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
    validators.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
