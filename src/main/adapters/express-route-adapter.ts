import { Request, Response, RequestHandler } from 'express'
import { Controller } from '@/presentation/protocols'

export const adaptRoute = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    const request = {
      ...(req.body || {}),
      ...(req.params || {}),
      accountId: req.accountId
    }
    const httpResponse = await controller.handle(request)
    const { statusCode, body } = httpResponse
    if (statusCode >= 200 && statusCode <= 299) {
      res.status(statusCode).json(body)
    } else {
      res.status(statusCode).json({
        error: body.message
      })
    }
  }
}
