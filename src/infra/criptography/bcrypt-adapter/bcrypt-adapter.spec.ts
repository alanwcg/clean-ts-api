import bcrypt from 'bcrypt'
import { CompareParams } from '../../../data/protocols/criptography/hash-comparer'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => {
    return 'hash'
  },
  compare: async (): Promise<boolean> => {
    return true
  }
}))

const makeFakeCompareParams = (): CompareParams => ({
  value: 'any_value',
  hash: 'any_hash'
})

const SALT = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(SALT)
}

describe('Bcrypt Adapter', () => {
  describe('', () => {
    it('should calls hash with correct values', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', SALT)
    })

    it('should throw if hash throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })

    it('should return a valid hash on hash success', async () => {
      const sut = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash')
    })
  })

  describe('', () => {
    it('should calls compare with correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare(makeFakeCompareParams())
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    it('should return true when compare succeeds', async () => {
      const sut = makeSut()
      const isValid = await sut.compare(makeFakeCompareParams())
      expect(isValid).toBe(true)
    })

    it('should return false when compare fails', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)
      const isValid = await sut.compare(makeFakeCompareParams())
      expect(isValid).toBe(false)
    })

    it('should throw if compare throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.compare(makeFakeCompareParams())
      await expect(promise).rejects.toThrow()
    })
  })
})
