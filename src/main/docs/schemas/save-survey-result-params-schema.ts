export const saveSurveyResultParamsSchema = {
  type: 'object',
  properties: {
    answer: {
      type: 'string',
      example: 'Answer 2'
    }
  },
  required: ['answer']
}
