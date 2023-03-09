import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'
import { CompareParams } from '@/data/protocols/criptography/hash-comparer'
import { throwError } from '@/domain/test'

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => {
    return 'hash'
  },
  compare: async (): Promise<boolean> => {
    return true
  }
}))

const mockCompareParams = (): CompareParams => ({
  value: 'any_value',
  hash: 'any_hash'
})

const SALT = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(SALT)
}

describe('BcryptAdapter', () => {
  describe('', () => {
    it('should calls hash with correct values', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', SALT)
    })

    it('should throw if hash throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError)
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
      await sut.compare(mockCompareParams())
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    it('should return true when compare succeeds', async () => {
      const sut = makeSut()
      const isValid = await sut.compare(mockCompareParams())
      expect(isValid).toBe(true)
    })

    it('should return false when compare fails', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)
      const isValid = await sut.compare(mockCompareParams())
      expect(isValid).toBe(false)
    })

    it('should throw if compare throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(throwError)
      const promise = sut.compare(mockCompareParams())
      await expect(promise).rejects.toThrow()
    })
  })
})
