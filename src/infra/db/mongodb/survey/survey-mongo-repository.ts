import { ObjectId } from 'mongodb'
import { MongoHelper, Collections } from '../helpers/mongo-helper'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyModel } from '@/domain/usecases/survey/add-survey'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { LoadSurveyByIdRepository } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'

export class SurveyMongoRepository implements
  AddSurveyRepository,
  LoadSurveysRepository,
  LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const mongoHelper = MongoHelper.getInstance()
    const surveyCollection = await mongoHelper.getCollection(Collections.SURVEYS)
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const mongoHelper = MongoHelper.getInstance()
    const surveyCollection = await mongoHelper.getCollection(Collections.SURVEYS)
    const surveys = await surveyCollection.find().toArray()
    return mongoHelper.mapArray(surveys)
  }

  async loadById (id: string): Promise<SurveyModel> {
    if (!ObjectId.isValid(id)) return null
    const mongoHelper = MongoHelper.getInstance()
    const surveyCollection = await mongoHelper.getCollection(Collections.SURVEYS)
    const survey = await surveyCollection.findOne<SurveyModel>({
      _id: new ObjectId(id)
    })
    return survey && mongoHelper.map(survey)
  }
}
