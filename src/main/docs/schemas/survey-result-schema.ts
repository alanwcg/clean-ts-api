export const surveyResultSchema = {
  type: 'object',
  properties: {
    surveyId: {
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
        $ref: '#/schemas/surveyResultAnswer'
      }
    },
    date: {
      type: 'string',
      example: '2023-02-27T23:51:50.549Z'
    }
  },
  required: ['surveyId', 'question', 'answers', 'date']
}
