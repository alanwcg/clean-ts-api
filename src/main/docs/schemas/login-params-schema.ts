export const loginParamsSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      example: 'alancintra7@gmail.com'
    },
    password: {
      type: 'string',
      example: '123456'
    }
  },
  required: ['email', 'password']
}
