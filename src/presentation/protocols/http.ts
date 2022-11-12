export interface HttpRequest {
  body?: Record<string, any>
  headers?: Record<string, any>
}

export interface HttpResponse {
  statusCode: number
  body: any
}
