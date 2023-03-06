import { Validator } from '@/presentation/protocols'

export const mockValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: Record<string, any>): Error | null {
      return null
    }
  }
  return new ValidatorStub()
}
