import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Log detailed validation errors for debugging
    console.warn('Validation failed:', {
      path: req.originalUrl,
      method: req.method,
      body: req.body,
      errors: errors.array(),
    });
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  next();
};