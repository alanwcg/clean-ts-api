export interface Validator {
  validate: (input: Record<string, any>) => Error | null
}
