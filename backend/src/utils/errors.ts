export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(400, message, details);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(403, message);
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(409, message);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
