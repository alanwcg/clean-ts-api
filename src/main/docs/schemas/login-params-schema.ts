export const loginParamsSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      example: 'email@mail.com'
    },
    password: {
      type: 'string',
      example: 'any_password'
    }
  },
  required: ['email', 'password']
}
