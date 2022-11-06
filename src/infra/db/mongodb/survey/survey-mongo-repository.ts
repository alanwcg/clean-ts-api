import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper, Collections } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const mongoHelper = MongoHelper.getInstance()
    const surveyCollection = await mongoHelper.getCollection(Collections.SURVEYS)
    await surveyCollection.insertOne(surveyData)
  }
}
