
/**
 * Eval Error
 */
export class EvalError extends Error {

  public readonly cause: Error;

  constructor(cause: Error, text: string) {
    super(`${cause.message} in expression '${text}'`);
    this.cause = cause;
    Object.setPrototypeOf(this, EvalError.prototype);
  }

}