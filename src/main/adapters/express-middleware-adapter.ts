import { Request, Response, RequestHandler, NextFunction } from 'express'
import { Middleware } from '@/presentation/protocols'

export const adaptMiddleware = (middleware: Middleware): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const request = {
      accessToken: req.headers?.['x-access-token'],
      ...(req.headers || {})
    }
    const httpResponse = await middleware.handle(request)
    const { statusCode, body } = httpResponse
    if (statusCode === 200) {
      Object.assign(req, body)
      next()
    } else {
      res.status(statusCode).json({
        error: body.message
      })
    }
  }
}
