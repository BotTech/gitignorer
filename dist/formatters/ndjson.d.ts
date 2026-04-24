/**
 * NDJSON output formatter for streaming.
 *
 * Per CONTEXT.md D-10: NDJSON mode streams progress events.
 * Uses async generator for non-blocking streaming.
 */
import { Readable } from 'stream';
/**
 * Formats data array as NDJSON stream.
 *
 * @param data - Array of items to serialize
 * @returns NodeJS Readable stream
 */
export declare function formatNDJSON(data: unknown[]): Readable;
/**
 * Streams data as NDJSON using async generator.
 *
 * @param data - Async iterable of items
 * @returns Async generator yielding JSON lines
 */
export declare function streamNDJSON(data: AsyncIterable<unknown>): AsyncGenerator<string, void, unknown>;
//# sourceMappingURL=ndjson.d.ts.map