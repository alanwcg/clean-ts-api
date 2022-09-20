export interface HttpRequest {
  body?: Record<string, any>
}

export interface HttpResponse {
  statusCode: number
  body: any
}
