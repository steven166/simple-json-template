
/**
 * Render Error
 */
export class RenderError extends Error {

  public readonly cause: Error;

  constructor(cause: Error, path: string) {
    super(`${cause.message} at '${path}'`);
    this.cause = cause;
    Object.setPrototypeOf(this, RenderError.prototype);
  }

}