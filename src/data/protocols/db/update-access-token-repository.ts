export type UpdateParams = {
  id: string
  accessToken: string
}

export interface UpdateAccessTokenRepository {
  update: (params: UpdateParams) => Promise<void>
}
