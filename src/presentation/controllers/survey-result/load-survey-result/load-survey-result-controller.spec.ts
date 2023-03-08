import { LoadSurveyResultController } from './load-survey-result-controller'
import { HttpRequest } from './load-survey-result-controller-protocols'
import { mockLoadSurveyById } from '@/presentation/test'

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

describe('LoadSurveyResult Controller', () => {
  it('should call LoadSurveyById with correct id', async () => {
    const loadSurveyByIdStub = mockLoadSurveyById()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    const sut = new LoadSurveyResultController(loadSurveyByIdStub)
    await sut.handle(mockRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
