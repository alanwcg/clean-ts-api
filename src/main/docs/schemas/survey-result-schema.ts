export const surveyResultSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      example: '63fd42166489368f8d76639e'
    },
    surveyId: {
      type: 'string',
      example: '63fd42166489368f8d76639e'
    },
    accountId: {
      type: 'string',
      example: '63fd42166489368f8d76639e'
    },
    answer: {
      type: 'string',
      example: 'Resposta da pergunta'
    },
    date: {
      type: 'string',
      example: '2023-02-27T23:51:50.549Z'
    }
  }
}
