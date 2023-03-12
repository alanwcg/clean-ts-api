import { AccountModel } from '@/domain/models'

export type LoadAccountByTokenParams = {
  accessToken: string
  role?: string
}

export interface LoadAccountByToken {
  load: (params: LoadAccountByTokenParams) => Promise<AccountModel | null>
}
