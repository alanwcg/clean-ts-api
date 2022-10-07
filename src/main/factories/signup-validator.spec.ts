import { CompareFieldsValidator } from '../../presentation/helpers/validators/compare-fields-validator'
import { RequiredFieldValidator } from '../../presentation/helpers/validators/required-field-validator'
import { ValidatorComposite } from '../../presentation/helpers/validators/validator-composite'
import { Validator } from '../../presentation/protocols'
import { makeSignUpValidator } from './signup-validator'

jest.mock('../../presentation/helpers/validators/validator-composite')

describe('SignUp Validator Factory', () => {
  it('should call ValidatorComposite with all validators', () => {
    makeSignUpValidator()
    const validators: Validator[] = []
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    requiredFields.forEach(field => {
      validators.push(new RequiredFieldValidator(field))
    })
    validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
