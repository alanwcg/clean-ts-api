import { InvalidParamError } from '../../errors'
import { EmailValidator, Validator } from '../../protocols'

export class EmailValidation implements Validator {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: Record<string, any>): Error {
    const isEmailValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isEmailValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
