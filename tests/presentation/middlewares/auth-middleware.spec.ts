import { AuthMiddleware } from '@/presentation/middlewares'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, serverError, success } from '@/presentation/helpers'
import { LoadAccountByTokenSpy } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'

const mockRequest = (): AuthMiddleware.Request => ({
  accessToken: 'any_token'
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenSpy: LoadAccountByTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy()
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role)
  return {
    sut,
    loadAccountByTokenSpy
  }
}

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const request = await sut.handle({})
    expect(request).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenSpy } = makeSut(role)
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadAccountByTokenSpy.params).toEqual({
      accessToken: httpRequest.accessToken,
      role
    })
  })

  it('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    loadAccountByTokenSpy.result = null
    const request = await sut.handle(mockRequest())
    expect(request).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    const request = await sut.handle(mockRequest())
    expect(request).toEqual(success({
      accountId: loadAccountByTokenSpy.result.id
    }))
  })

  it('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    jest.spyOn(loadAccountByTokenSpy, 'load').mockImplementationOnce(
      throwError
    )
    const request = await sut.handle(mockRequest())
    expect(request).toEqual(serverError(new Error()))
  })
})
