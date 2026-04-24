/**
 * Async stdin JSON parser for agent mode.
 *
 * Non-blocking: Uses async/await with for await loop (per CLI-06).
 * Returns null if no piped input (not an error).
 * Throws ValidationError if JSON is malformed.
 */
import { ValidationError } from '../schema/errors.js';
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
export async function parseStdinJSON() {
    // Check if stdin is a TTY (no piped input)
    if (process.stdin.isTTY) {
        return null;
    }
    // Read stdin asynchronously
    const chunks = [];
    for await (const chunk of process.stdin) {
        chunks.push(chunk);
    }
    // Convert to string and parse
    const data = Buffer.concat(chunks).toString('utf-8').trim();
    if (data === '') {
        return null;
    }
    try {
        return JSON.parse(data);
    }
    catch (err) {
        throw new ValidationError('Invalid JSON in stdin', []);
    }
}
//# sourceMappingURL=stdin.js.map