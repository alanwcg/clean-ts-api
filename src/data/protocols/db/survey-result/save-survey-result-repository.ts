import { SaveSurveyResultParams } from '@/domain/usecases'

export interface SaveSurveyResultRepository {
  save: (params: SaveSurveyResultParams) => Promise<void>
}
