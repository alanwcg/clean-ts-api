import { InvalidParamError } from '../../errors'
import { Validator } from '../../protocols'

export class CompareFieldsValidator implements Validator {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}

  validate (input: Record<string, any>): Error {
    if (this.fieldName !== this.fieldToCompareName) {
      return new InvalidParamError(this.fieldToCompareName)
    }
  }
}
