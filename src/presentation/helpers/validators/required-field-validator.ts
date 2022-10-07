import { MissingParamError } from '../../errors'
import { Validator } from '../../protocols'

export class RequiredFieldValidator implements Validator {
  constructor (private readonly fieldName: string) {}

  validate (input: Record<string, any>): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}
