export declare class StringHelper {
    private static ESCAPE_CHAR;
    static readUntil(text: string, char: string): ReadResult;
}
export interface ReadResult {
    text: string;
    length: number;
}
