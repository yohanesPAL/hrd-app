/**
 * Custom error class for application-specific errors.
 * Extends the native Error object by adding an HTTP status code.
 */
export class Err extends Error {
  /**
   * HTTP status code associated with the error.
   */
  public readonly status: number;

  /**
   * Creates a new Err instance.
   *
   * @param message - Human-readable error message.
   * @param status - HTTP status code (defaults to 500).
   */
  constructor(message: string, status = 500) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;

    // Maintains proper stack trace (only available in V8 engines like Node.js)
    Error.captureStackTrace?.(this, this.constructor);
  }
}