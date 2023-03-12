import { makeAddSurveyValidator } from '@/main/factories'
import {
  RequiredFieldValidator,
  ValidatorComposite
} from '@/validation/validators'
import { Validator } from '@/presentation/protocols'

jest.mock('@/validation/validators/validator-composite')

describe('AddSurvey Validator Factory', () => {
  it('should call ValidatorComposite with all validators', () => {
    makeAddSurveyValidator()
    const validators: Validator[] = []
    for (const field of ['question', 'answers']) {
      validators.push(new RequiredFieldValidator(field))
    }
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
