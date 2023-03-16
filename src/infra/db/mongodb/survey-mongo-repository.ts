import { ObjectId } from 'mongodb'
import { MongoHelper, QueryBuilder, Collections } from '@/infra/db'
import {
  AddSurveyRepository,
  LoadSurveysRepository,
  LoadSurveyByIdRepository,
  CheckSurveyByIdRepository
} from '@/data/protocols'

export class SurveyMongoRepository implements
  AddSurveyRepository,
  LoadSurveysRepository,
  LoadSurveyByIdRepository,
  CheckSurveyByIdRepository {
  async add (params: AddSurveyRepository.Params): Promise<void> {
    const mongoHelper = MongoHelper.getInstance()
    const surveyCollection = await mongoHelper.getCollection(
      Collections.SURVEYS
    )
    await surveyCollection.insertOne(params)
  }

  async loadAll (accountId: string): Promise<LoadSurveysRepository.Result> {
    const mongoHelper = MongoHelper.getInstance()
    const surveyCollection = await mongoHelper.getCollection(
      Collections.SURVEYS
    )
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

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    if (!ObjectId.isValid(id)) return null
    const mongoHelper = MongoHelper.getInstance()
    const surveyCollection = await mongoHelper.getCollection(
      Collections.SURVEYS
    )
    const survey = await surveyCollection
      .findOne<LoadSurveyByIdRepository.Result>({ _id: new ObjectId(id) })
    return survey && mongoHelper.map(survey)
  }

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    if (!ObjectId.isValid(id)) return false
    const mongoHelper = MongoHelper.getInstance()
    const surveyCollection = await mongoHelper.getCollection(
      Collections.SURVEYS
    )
    const survey = await surveyCollection.findOne<LoadSurveyByIdRepository.Result>({
      _id: new ObjectId(id)
    }, {
      projection: {
        _id: 1
      }
    })
    return !!survey
  }
}
