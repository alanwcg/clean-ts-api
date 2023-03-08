import { Router } from 'express'
import { auth } from '../middlewares'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { makeLoadSurveyResultController } from '@/main/factories/controllers/survey-result/load-survey-result/load-survey-result-controller-factory'

export default (router: Router): void => {
  router.put(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeSaveSurveyResultController())
  )

  router.get(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeLoadSurveyResultController())
  )
}
