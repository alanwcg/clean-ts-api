import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository
} from '@/data/protocols'
import { SaveSurveyResult } from '@/domain/usecases'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    await this.saveSurveyResultRepository.save(data)
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId({
      surveyId: data.surveyId,
      accountId: data.accountId
    })
    return surveyResult
  }
}
