import { MissingParamError } from '../../errors'
import { Validator } from '../../protocols'
import { ValidatorComposite } from './validator-composite'

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: Record<string, any>): Error {
      return null
    }
  }
  return new ValidatorStub()
}

type SutTypes = {
  sut: ValidatorComposite
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidator()
  const sut = new ValidatorComposite([validatorStub])
  return {
    sut,
    validatorStub
  }
}

describe('Validator Composite', () => {
  it('should return an error if any validator fails', () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(
      new MissingParamError('field')
    )
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
