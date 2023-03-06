import {
  accountSchema,
  loginParamsSchema,
  surveySchema,
  surveyAnswerSchema,
  surveysSchema,
  signupParamsSchema,
  addSurveyParamsSchema,
  saveSurveyResultParamsSchema,
  surveyResultSchema,
  errorSchema
} from './schemas/'

export default {
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
}
