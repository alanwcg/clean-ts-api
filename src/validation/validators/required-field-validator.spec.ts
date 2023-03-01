import { RequiredFieldValidator } from './required-field-validator'
import { MissingParamError } from '@/presentation/errors'

const makeSut = (): RequiredFieldValidator => {
  return new RequiredFieldValidator('field')
}

describe('Required Field Validator', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ other_field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
