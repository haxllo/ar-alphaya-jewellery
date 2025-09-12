import { NextRequest, NextResponse } from 'next/server';

// Error types for better error handling
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

// Custom error class with type information
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    type: ErrorType = ErrorType.INTERNAL_ERROR,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Safe error messages for different environments
const getSafeErrorMessage = (error: unknown, isDevelopment: boolean = false): string => {
  // In development, show more details
  if (isDevelopment) {
    if (error instanceof AppError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred';
  }

  // In production, show generic messages
  if (error instanceof AppError) {
    switch (error.type) {
      case ErrorType.VALIDATION_ERROR:
        return 'Invalid input provided';
      case ErrorType.AUTHENTICATION_ERROR:
        return 'Authentication required';
      case ErrorType.AUTHORIZATION_ERROR:
        return 'Access denied';
      case ErrorType.NOT_FOUND_ERROR:
        return 'Resource not found';
      case ErrorType.RATE_LIMIT_ERROR:
        return 'Too many requests';
      case ErrorType.EXTERNAL_SERVICE_ERROR:
        return 'Service temporarily unavailable';
      default:
        return 'An error occurred';
    }
  }

  // Generic error for unknown errors
  return 'An error occurred';
};

// Get appropriate status code
const getStatusCode = (error: unknown): number => {
  if (error instanceof AppError) {
    return error.statusCode;
  }
  return 500;
};

// Sanitize error for logging (remove sensitive information)
export function sanitizeErrorForLogging(error: unknown): any {
  const sanitized: any = {
    timestamp: new Date().toISOString(),
    type: 'unknown',
    message: 'An error occurred',
  };

  if (error instanceof AppError) {
    sanitized.type = error.type;
    sanitized.statusCode = error.statusCode;
    sanitized.message = error.message;
    sanitized.isOperational = error.isOperational;
  } else if (error instanceof Error) {
    sanitized.type = 'Error';
    sanitized.message = error.message;
    sanitized.name = error.name;
  }

  // Remove any potential sensitive information
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'credential'];
  Object.keys(sanitized).forEach(key => {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      delete sanitized[key];
    }
  });

  return sanitized;
};

// Create error response
export function createErrorResponse(
  error: unknown,
  requestId?: string
): NextResponse {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const statusCode = getStatusCode(error);
  const message = getSafeErrorMessage(error, isDevelopment);

  // Log error for monitoring (sanitized)
  const sanitizedError = sanitizeErrorForLogging(error);
  console.error('API Error:', {
    ...sanitizedError,
    requestId,
    url: typeof window !== 'undefined' ? window.location?.href : 'server',
  });

  // Create response
  const response = NextResponse.json(
    {
      error: true,
      message,
      ...(requestId && { requestId }),
      ...(isDevelopment && { 
        type: error instanceof AppError ? error.type : 'unknown',
        timestamp: new Date().toISOString(),
      }),
    },
    { status: statusCode }
  );

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

  return response;
};

// Validation error helper
export function createValidationError(message: string): AppError {
  return new AppError(message, ErrorType.VALIDATION_ERROR, 400);
}

// Authentication error helper
export function createAuthError(message: string = 'Authentication required'): AppError {
  return new AppError(message, ErrorType.AUTHENTICATION_ERROR, 401);
}

// Authorization error helper
export function createAuthzError(message: string = 'Access denied'): AppError {
  return new AppError(message, ErrorType.AUTHORIZATION_ERROR, 403);
}

// Not found error helper
export function createNotFoundError(message: string = 'Resource not found'): AppError {
  return new AppError(message, ErrorType.NOT_FOUND_ERROR, 404);
}

// Rate limit error helper
export function createRateLimitError(message: string = 'Too many requests'): AppError {
  return new AppError(message, ErrorType.RATE_LIMIT_ERROR, 429);
}

// External service error helper
export function createExternalServiceError(message: string = 'Service temporarily unavailable'): AppError {
  return new AppError(message, ErrorType.EXTERNAL_SERVICE_ERROR, 503);
}

// Async error handler wrapper
export function asyncHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      throw error; // Re-throw to be handled by the error boundary
    }
  };
}

// Error boundary for API routes
export function withErrorHandler(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (error) {
      return createErrorResponse(error);
    }
  };
}

// Remove debug information from production logs
export function cleanDebugInfo(obj: any): any {
  if (process.env.NODE_ENV === 'production') {
    const cleaned = { ...obj };
    
    // Remove debug properties
    delete cleaned.stack;
    delete cleaned.stackTrace;
    delete cleaned.debug;
    delete cleaned.internal;
    
    // Remove sensitive properties
    const sensitiveProps = ['password', 'token', 'secret', 'key', 'auth'];
    sensitiveProps.forEach(prop => {
      if (cleaned[prop]) {
        cleaned[prop] = '[REDACTED]';
      }
    });
    
    return cleaned;
  }
  
  return obj;
}
