export const surveySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      example: '63fd42166489368f8d76639e'
    },
    question: {
      type: 'string',
      example: 'Qual o seu nível de senioridade?'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswer'
      }
    },
    date: {
      type: 'string',
      example: '2023-02-27T23:51:50.549Z'
    }
  }
}
