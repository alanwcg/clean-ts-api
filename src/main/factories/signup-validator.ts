import { RequiredFieldValidator } from '../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../presentation/helpers/validators/validator-composite'
import { Validator } from '../../presentation/protocols'

export const makeSignUpValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  requiredFields.forEach(field => {
    validators.push(new RequiredFieldValidator(field))
  })
  return new ValidatorComposite(validators)
}
