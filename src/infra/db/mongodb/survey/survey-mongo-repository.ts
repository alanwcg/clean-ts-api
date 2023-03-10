import { ObjectId } from 'mongodb'
import { MongoHelper, QueryBuilder, Collections } from '../helpers'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { LoadSurveyByIdRepository } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'

export class SurveyMongoRepository implements
  AddSurveyRepository,
  LoadSurveysRepository,
  LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const mongoHelper = MongoHelper.getInstance()
    const surveyCollection = await mongoHelper.getCollection(Collections.SURVEYS)
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    const mongoHelper = MongoHelper.getInstance()
    const surveyCollection = await mongoHelper.getCollection(Collections.SURVEYS)
    const query = new QueryBuilder()
      .lookup({
        from: Collections.SURVEY_RESULTS,
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [{
            $size: {
              $filter: {
                input: '$result',
                as: 'item',
                cond: {
                  $eq: ['$$item.accountId', new ObjectId(accountId)]
                }
              }
            }
          }, 1]
        }
      })
      .build()
    const surveys = await surveyCollection.aggregate(query).toArray()
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
