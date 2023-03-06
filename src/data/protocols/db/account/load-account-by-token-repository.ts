import { AccountModel } from '@/domain/models/account'

export type LoadByTokenParams = {
  token: string
  role?: string
}

export interface LoadAccountByTokenRepository {
  loadByToken: (params: LoadByTokenParams) => Promise<AccountModel | null>
}
