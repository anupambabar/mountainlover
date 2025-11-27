import { NextFunction, Request, Response } from 'express'
import { ZodError, ZodSchema } from 'zod'

type RequestLocation = 'body' | 'params' | 'query'

export function validateRequest(schema: ZodSchema, location: RequestLocation = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[location])
      req[location] = data
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'VALIDATION_ERROR',
          issues: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          })),
        })
      }
      next(error)
    }
  }
}

