export const surveyAnswerSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string',
      example: 'nome-da-imagem'
    },
    answer: {
      type: 'string',
      example: 'Pleno'
    }
  },
  required: ['answer']
}
