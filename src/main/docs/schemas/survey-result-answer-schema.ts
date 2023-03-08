export const surveyResultAnswerSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string',
      example: 'nome-da-imagem'
    },
    answer: {
      type: 'string',
      example: 'Resposta da pergunta'
    },
    count: {
      type: 'number',
      example: 1
    },
    percent: {
      type: 'number',
      example: 100
    }
  },
  required: ['answer', 'count', 'percent']
}
