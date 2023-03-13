export interface UpdateAccessTokenRepository {
  updateAccessToken: (
    params: UpdateAccessTokenRepository.Params
  ) => Promise<void>
}

export namespace UpdateAccessTokenRepository {
  export type Params = {
    id: string
    accessToken: string
  }
}
