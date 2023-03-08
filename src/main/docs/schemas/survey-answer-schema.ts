export const surveyAnswerSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string',
      example: 'nome-da-imagem'
    },
    answer: {
      type: 'string',
      example: 'Resposta da pergunta'
    }
  },
  required: ['answer']
}
