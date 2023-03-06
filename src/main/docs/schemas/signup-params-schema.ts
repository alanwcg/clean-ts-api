export const signupParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'Alan Cintra'
    },
    email: {
      type: 'string',
      example: 'alan.cintra@mail.com'
    },
    password: {
      type: 'string',
      example: 'any_password'
    },
    passwordConfirmation: {
      type: 'string',
      example: 'any_password'
    }
  },
  required: ['name', 'email', 'password', 'passwordConfirmation']
}
