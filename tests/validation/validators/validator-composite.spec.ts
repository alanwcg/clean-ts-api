import { faker } from '@faker-js/faker'
import { ValidatorComposite } from '@/validation/validators'
import { MissingParamError } from '@/presentation/errors'
import { ValidatorSpy } from '@/tests/validation/mocks'

const field = faker.random.word()

type SutTypes = {
  sut: ValidatorComposite
  validatorSpies: ValidatorSpy[]
}

const makeSut = (): SutTypes => {
  const validatorSpies = [new ValidatorSpy(), new ValidatorSpy()]
  const sut = new ValidatorComposite(validatorSpies)
  return {
    sut,
    validatorSpies
  }
}

describe('Validator Composite', () => {
  it('should return an error if any validator fails', () => {
    const { sut, validatorSpies } = makeSut()
    validatorSpies[1].error = new MissingParamError(field)
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toEqual(validatorSpies[1].error)
  })

  it('should return the first error if more than one validator fails', () => {
    const { sut, validatorSpies } = makeSut()
    validatorSpies[0].error = new Error()
    validatorSpies[1].error = new MissingParamError(field)
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toEqual(validatorSpies[0].error)
  })

  it('should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toBeFalsy()
  })
})
