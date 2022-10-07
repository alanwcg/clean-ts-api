export type AuthParams = {
  email: string
  password: string
}

export interface Authentication {
  auth: ({ email, password }: AuthParams) => Promise<string>
}
