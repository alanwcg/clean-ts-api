import bcrypt from 'bcrypt'
import { CompareParams, HashComparer } from '../../../data/protocols/criptography/hash-comparer'
import { Hasher } from '../../../data/protocols/criptography/hasher'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (
    private readonly salt: number
  ) {}

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare ({ value, hash }: CompareParams): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
