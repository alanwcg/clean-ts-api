export type HttpRequest = {
  body?: Record<string, any>
  headers?: Record<string, any>
  params?: Record<string, any>
  accountId?: string
}

export type HttpResponse = {
  statusCode: number
  body: any
}
