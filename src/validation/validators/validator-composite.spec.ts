import { ValidatorComposite } from './validator-composite'
import { MissingParamError } from '@/presentation/errors'
import { Validator } from '@/presentation/protocols'
import { mockValidator } from '@/validation/test'

type SutTypes = {
  sut: ValidatorComposite
  validatorStubs: Validator[]
}

const makeSut = (): SutTypes => {
  const validatorStubs = [mockValidator(), mockValidator()]
  const sut = new ValidatorComposite(validatorStubs)
  return {
    sut,
    validatorStubs
  }
}

describe('Validator Composite', () => {
  it('should return an error if any validator fails', () => {
    const { sut, validatorStubs } = makeSut()
    jest.spyOn(validatorStubs[0], 'validate').mockReturnValueOnce(
      new MissingParamError('field')
    )
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('should return the first error if more than one validator fails', () => {
    const { sut, validatorStubs } = makeSut()
    jest.spyOn(validatorStubs[0], 'validate').mockReturnValueOnce(
      new Error()
    )
    jest.spyOn(validatorStubs[1], 'validate').mockReturnValueOnce(
      new MissingParamError('field')
    )
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })

  it('should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
