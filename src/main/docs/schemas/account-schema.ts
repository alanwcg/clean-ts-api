export const accountSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmQ0MTFlNjQ4OTM2OGY4ZDc2NjM5ZCIsImlhdCI6MTY3Nzk1MjcyNn0.XcNWT1ujptUeUMs3h4csNdKB5sm2kuOfz8aU5TFf5Qo'
    }
  },
  required: ['accessToken']
}
