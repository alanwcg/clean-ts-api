export type UpdateParams = {
  id: string
  accessToken: string
}

export interface UpdateAccessTokenRepository {
  updateAccessToken: (params: UpdateParams) => Promise<void>
}
