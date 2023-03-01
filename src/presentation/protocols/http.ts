export type HttpRequest = {
  body?: Record<string, any>
  headers?: Record<string, any>
}

export type HttpResponse = {
  statusCode: number
  body: any
}
