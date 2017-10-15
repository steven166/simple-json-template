export declare class RenderError extends Error {
    readonly cause: Error;
    constructor(cause: Error, path: string);
}
