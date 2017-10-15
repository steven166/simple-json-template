import { UnexpectedTokenError } from "../errors/unexpected-token.error";
import { MissingTokenError } from "../errors/missing-token.error";

/**
 * String utils
 */
export class StringHelper {

  private static ESCAPE_CHAR = "\\";

  /**
   * Read a string until a characters
   * Possible to escape the endCharacter by a \
   * @param {string} text
   * @param {string} char
   * @returns {ReadResult} the length and read text
   */
  public static readUntil(text: string, char: string): ReadResult {
    let escaping = false;
    let stringBuilder = [];

    for (let index = 0; index < text.length; index++) {
      const c = text[index];

      if (escaping) {
        escaping = false;
        stringBuilder.push(c);
      } else if (c === StringHelper.ESCAPE_CHAR) {
        escaping = true;
        continue;
      } else if (char === c) {
        return {
          text: stringBuilder.join(""),
          length: index
        };
      } else {
        stringBuilder.push(c);
      }
    }

    throw new MissingTokenError(char, text);
  }

}

export interface ReadResult {

  text: string;
  length: number;

}