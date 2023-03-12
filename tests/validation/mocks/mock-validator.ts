import { Validator } from '@/presentation/protocols'

export class ValidatorSpy implements Validator {
  input: any
  error: Error = null

  validate (input: Record<string, any>): Error | null {
    this.input = input
    return this.error
  }
}
