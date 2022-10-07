import { MissingParamError } from '../../errors'
import { RequiredFieldValidator } from './required-field-validator'

describe('Required Field Validator', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidator('field')
    const error = sut.validate({ other_field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
