import { loginPath, surveysPath, signupPath, surveyResultPath } from './paths'
import {
  accountSchema,
  loginParamsSchema,
  surveySchema,
  surveyAnswerSchema,
  surveysSchema,
  apiKeyAuthSchema,
  signupParamsSchema,
  addSurveyParamsSchema,
  saveSurveyResultParamsSchema,
  surveyResultSchema,
  errorSchema
} from './schemas'
import {
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  serverError
} from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API do curso do Mango para realizar enquetes entre programadores.',
    version: '1.0.0'
  },
  license: {
    name: 'MIT',
    url: 'https://www.mit.edu/~amini/LICENSE.md'
  },
  servers: [
    { url: '/api' }
  ],
  tags: [
    { name: 'Login' },
    { name: 'Enquete' }
  ],
  paths: {
    '/login': loginPath,
    '/signup': signupPath,
    '/surveys': surveysPath,
    '/surveys/{surveyId}/results': surveyResultPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    surveys: surveysSchema,
    signupParams: signupParamsSchema,
    addSurveyParams: addSurveyParamsSchema,
    saveSurveyResultParams: saveSurveyResultParamsSchema,
    surveyResult: surveyResultSchema,
    error: errorSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    unauthorized,
    forbidden,
    notFound,
    serverError
  }
}
