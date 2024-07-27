import { NextFunction, Request, Response } from "express";


export class AppError extends Error 
{
  public readonly statusCode?: number
  public readonly appStatus?: string

  constructor(
    message?: string, 
    appStatus?: string,
    httpStatusCode?: number
  ) {
    super(message)
    this.statusCode = httpStatusCode
    this.appStatus = appStatus
  }
}


export function notFound(req: Request, res: Response, next: NextFunction) {
  const err = new AppError('This API endpoint is incorrect', 'NotFound', 404)
  next(err)
}

export function catchErrors(err: Error & AppError, req: Request, res: Response, next: NextFunction) {
  res.status(err.statusCode || 500).json({
    error: {
      status: err.appStatus || 'unknown',
      message: err.message
    }
  })
}