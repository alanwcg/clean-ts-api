import { faker } from '@faker-js/faker'
import { Hasher } from '@/data/protocols/criptography/hasher'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { Encrypter } from '@/data/protocols/criptography/encrypter'
import {
  HashComparer,
  CompareParams
} from '@/data/protocols/criptography/hash-comparer'

export class HasherSpy implements Hasher {
  value: string
  result: string = faker.datatype.uuid()

  async hash (value: string): Promise<string> {
    this.value = value
    return this.result
  }
}

export class DecrypterSpy implements Decrypter {
  value: string
  result: string = faker.internet.password()

  async decrypt (value: string): Promise<string | null> {
    this.value = value
    return this.result
  }
}

export class EncrypterSpy implements Encrypter {
  value: string
  result: string = faker.datatype.uuid()

  async encrypt (value: string): Promise<string> {
    this.value = value
    return this.result
  }
}

export class HashComparerSpy implements HashComparer {
  params: CompareParams
  result: boolean = true

  async compare (params: CompareParams): Promise<boolean> {
    this.params = params
    return this.result
  }
}
