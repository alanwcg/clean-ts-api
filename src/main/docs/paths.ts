import { loginPath, surveysPath, signupPath, surveyResultPath } from './paths/'

export default {
  '/login': loginPath,
  '/signup': signupPath,
  '/surveys': surveysPath,
  '/surveys/{surveyId}/results': surveyResultPath
}
