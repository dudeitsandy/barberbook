export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string
  ) {
    super(message)
    this.name = 'AppError'
  }

  static BadRequest(message: string, code = 'BAD_REQUEST') {
    return new AppError(400, message, code)
  }

  static Unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    return new AppError(401, message, code)
  }

  static NotFound(message: string, code = 'NOT_FOUND') {
    return new AppError(404, message, code)
  }

  static Internal(message = 'Internal Server Error', code = 'INTERNAL_ERROR') {
    return new AppError(500, message, code)
  }
}

export const errorHandler = (error: unknown) => {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: { code: error.code, message: error.message }
    }
  }

  console.error('Unhandled error:', error)
  return {
    statusCode: 500,
    body: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }
  }
} 