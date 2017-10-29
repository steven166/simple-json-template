
/**
 * Syntax Error
 */
export class SyntaxError extends Error {

  constructor(message: string, text: string, description?: string) {
    super(`${message} in expression '${text}'` + (description ? `, ${description}` : ""));
    Object.setPrototypeOf(this, SyntaxError.prototype);
  }

}