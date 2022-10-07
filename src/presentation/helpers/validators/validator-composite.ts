import { Validator } from '../../protocols'

export class ValidatorComposite implements Validator {
  constructor (private readonly validators: Validator[]) {}

  validate (input: Record<string, any>): Error {
    this.validators.forEach(validator => {
      const error = validator.validate(input)
      if (error) {
        return error
      }
    })
    return null
  }
}
