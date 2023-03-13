import { AccountModel } from '@/domain/models'

export interface LoadAccountByTokenRepository {
  loadByToken: (
    params: LoadAccountByTokenRepository.Params
  ) => Promise<LoadAccountByTokenRepository.Result>
}

export namespace LoadAccountByTokenRepository {
  export type Params = {
    token: string
    role?: string
  }

  export type Result = AccountModel | null
}
