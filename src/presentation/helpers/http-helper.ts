import { ServerError } from '../errors'
import { HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: {
    error: error.message
  }
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: {
    error: new ServerError(error.stack).message
  }
})

export const success = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
