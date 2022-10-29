import {
  CompareFieldsValidator,
  EmailValidation,
  RequiredFieldValidator,
  ValidatorComposite
} from '../../../../presentation/helpers/validators'
import { Validator } from '../../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'

export const makeSignUpValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validators.push(new RequiredFieldValidator(field))
  }
  validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
  validators.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidatorComposite(validators)
}
