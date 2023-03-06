export const serverError = {
  description: 'Erro de Servidor',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Internal Server Error'
          }
        }
      }
    }
  }
}
