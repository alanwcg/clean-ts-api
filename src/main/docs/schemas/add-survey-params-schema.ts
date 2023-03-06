export const addSurveyParamsSchema = {
  type: 'object',
  properties: {
    question: {
      type: 'string',
      example: 'Qual o seu nível de senioridade?'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswer'
      }
    }
  }
}
