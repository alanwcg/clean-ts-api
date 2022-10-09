import {
  EmailValidation,
  RequiredFieldValidator,
  ValidatorComposite
} from '../../../presentation/helpers/validators'
import { Validator } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter'

export const makeLoginValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['email', 'password']) {
    validators.push(new RequiredFieldValidator(field))
  }
  validators.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidatorComposite(validators)
}
