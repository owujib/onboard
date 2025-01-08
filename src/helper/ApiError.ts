import { ResponseUtil } from "../utils/response";


/**
 * Custom error class for handling API-specific errors.
 */
export class ApiError extends Error {

  public statusCode: number;
  public isOperational: boolean;
  public error: any

  /**
     * Constructs a new ApiError instance.
     *
     * @param message - The error message.
     * @param statusCode - The HTTP status code associated with the error.
     * @param isOperational - Indicates if the error is operational (defaults to `true`).
     */
  constructor(message: string, statusCode: number, error: any = null, isOperational = true) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.error = error
    Error.captureStackTrace(this);
  }


  /**
     * Creates a new ApiError for a `400 Bad Request` error.
     *
     * @param message - The error message.
     * @returns An ApiError instance.
     */
  static badRequest(message: string, error: any = null): ApiError {
    return new ApiError(message, ResponseUtil.BAD_REQUEST, error);
  }


  /**
     * Creates a new ApiError for a `401 Unauthorized` error.
     *
     * @param message - The error message.
     * @returns An ApiError instance.
     */
  static unauthorized(message: string): ApiError {
    return new ApiError(message, ResponseUtil.UNAUTHORIZED);
  }


  /**
    * Creates a new ApiError for a `403 Forbidden` error.
    *
    * @param message - The error message.
    * @returns An ApiError instance.
    */
  static forbidden(message: string): ApiError {
    return new ApiError(message, ResponseUtil.FORBIDDEN);
  }

  /**
    * Creates a new ApiError for a `404 Not Found` error.
    *
    * @param message - The error message.
    * @returns An ApiError instance.
    */
  static notFound(message: string): ApiError {
    return new ApiError(message, ResponseUtil.NOT_FOUND);
  }

  /**
    * Creates a new ApiError for a `500 Internal Server Error`.
    *
    * @param message - The error message.
    * @returns An ApiError instance.
    */
  static internal(message: string): ApiError {
    return new ApiError(message, ResponseUtil.INTERNAL_SERVER_ERROR);
  }

  /**
    * Creates a new ApiError for a `422 unprocessable entity`.
    *
    * @param message - The error message.
    * @returns An ApiError instance.
    */
  static validationError(error: any = null): ApiError {
    return new ApiError('Validation failed', ResponseUtil.UNPROCESSABLE_ENTITY, error)
  }
}