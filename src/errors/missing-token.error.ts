/**
 * Missing token Error
 */
export class MissingTokenError extends Error {

  constructor(token: string, text: string) {
    super(`Missing '${token}' after '${text}'`);
  }

}