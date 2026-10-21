import { AppError, ValidationError } from '../utils/errors.js';
import { env } from '../config/env.js';

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` },
  });
}

export function errorHandler(err, req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err instanceof ValidationError && err.details?.length ? { details: err.details } : {}),
      },
    });
  }

  if (
    err.name === 'PrismaClientInitializationError' ||
    ['P1000', 'P1001', 'P1002', 'P1017'].includes(err.code)
  ) {
    console.error('[Database Error]', err);
    return res.status(503).json({
      success: false,
      error: {
        code: 'DATABASE_UNAVAILABLE',
        message: 'Database unavailable. Check DATABASE_URL and PostgreSQL connectivity.',
      },
    });
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.errors?.map((e) => ({ path: e.path.join('.'), message: e.message })),
      },
    });
  }

  console.error('[API Error]', err);

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: env.isProduction ? 'Internal server error' : err.message,
    },
  });
}
