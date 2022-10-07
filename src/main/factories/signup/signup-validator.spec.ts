import { CompareFieldsValidator } from '../../../presentation/helpers/validators/compare-fields-validator'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidator } from '../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../presentation/helpers/validators/validator-composite'
import { EmailValidator, Validator } from '../../../presentation/protocols'
import { makeSignUpValidator } from './signup-validator'

jest.mock('../../../presentation/helpers/validators/validator-composite')

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
