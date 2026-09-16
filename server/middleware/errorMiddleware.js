import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  logger.error(err.message || 'Internal Server Error', err);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
    errors: process.env.NODE_ENV === 'production' ? [] : [err.message]
  });
};
