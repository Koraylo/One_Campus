import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  const candidateStatus = err?.statusCode || err?.status;
  const statusCode = Number.isInteger(candidateStatus) && candidateStatus >= 400 && candidateStatus < 600
    ? candidateStatus
    : 500;

  // Keep internal database/stack details in server logs, never in API responses.
  if (statusCode >= 500) console.error('[API Error]:', err);
  else console.warn('[API Request Error]:', err?.message || 'Request failed');

  const message = statusCode < 500
    ? (err?.message || 'The request could not be completed.')
    : 'An unexpected server error occurred. Please try again later.';

  res.status(statusCode).json({ success: false, error: message });
}
