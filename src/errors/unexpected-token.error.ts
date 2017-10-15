/**
 * Unexpected token Error
 */
export class UnexpectedTokenError extends Error {

  constructor(token: string, text: string, index: number) {
    super(`Unexpected token '${token}' in '${text}' at position ${index}`);
  }

}