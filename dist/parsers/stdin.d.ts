/**
 * Async stdin JSON parser for agent mode.
 *
 * Non-blocking: Uses async/await with for await loop (per CLI-06).
 * Returns null if no piped input (not an error).
 * Throws ValidationError if JSON is malformed.
 */
/**
 * Parses JSON from stdin if available.
 *
 * Key requirements:
 * - Non-blocking: Uses async/await with for await loop
 * - Returns null if no piped input (not an error)
 * - Throws ValidationError if JSON is malformed
 * - Generic type parameter for type safety
 *
 * @returns Parsed JSON object or null if no input
 */
export declare function parseStdinJSON<T>(): Promise<T | null>;
//# sourceMappingURL=stdin.d.ts.map