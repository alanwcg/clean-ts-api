export const forbidden = {
  description: 'Acesso Negado',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Access denied'
          }
        }
      }
    }
  }
}
