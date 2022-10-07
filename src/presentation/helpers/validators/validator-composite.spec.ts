import { MissingParamError } from '../../errors'
import { Validator } from '../../protocols'
import { ValidatorComposite } from './validator-composite'

describe('Validator Composite', () => {
  it('should return an error if any validator fails', () => {
    class ValidatorStub implements Validator {
      validate (input: Record<string, any>): Error {
        return new MissingParamError('field')
      }
    }
    const validatorStub = new ValidatorStub()
    const sut = new ValidatorComposite([validatorStub])
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
