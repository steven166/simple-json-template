export declare class EvalError extends Error {
    readonly cause: Error;
    constructor(cause: Error, text: string);
}
