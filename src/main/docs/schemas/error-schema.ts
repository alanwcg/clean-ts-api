export const errorSchema = {
  type: 'object',
  properties: {
    error: {
      type: 'string',
      example: 'Mensagem de erro'
    }
  },
  required: ['error']
}
