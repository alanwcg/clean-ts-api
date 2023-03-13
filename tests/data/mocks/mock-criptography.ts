import { faker } from '@faker-js/faker'
import { Hasher, Decrypter, Encrypter, HashComparer } from '@/data/protocols'

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
  params: HashComparer.Params
  result: boolean = true

  async compare (params: HashComparer.Params): Promise<boolean> {
    this.params = params
    return this.result
  }
}
