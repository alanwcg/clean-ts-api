export const serverError = {
  description: 'Erro de Servidor',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
