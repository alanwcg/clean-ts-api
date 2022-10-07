import { CompareFieldsValidator } from '../../../presentation/helpers/validators/compare-fields-validator'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidator } from '../../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../../presentation/helpers/validators/validator-composite'
import { Validator } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeSignUpValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validators.push(new RequiredFieldValidator(field))
  }
  validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
  validators.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidatorComposite(validators)
}
