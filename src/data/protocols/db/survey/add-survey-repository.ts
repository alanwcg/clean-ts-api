import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export interface AddSurveyRepository {
  add: (params: AddSurveyParams) => Promise<void>
}
