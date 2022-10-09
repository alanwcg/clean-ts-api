import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

const SECRET = 'secret'
const makeSut = (): JwtAdapter => {
  return new JwtAdapter(SECRET)
}

describe('JWT Adapter', () => {
  it('should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, SECRET)
  })
})
