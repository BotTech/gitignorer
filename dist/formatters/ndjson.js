/**
 * NDJSON output formatter for streaming.
 *
 * Per CONTEXT.md D-10: NDJSON mode streams progress events.
 * Uses async generator for non-blocking streaming.
 */
/**
 * Formats data array as NDJSON stream.
 *
 * @param data - Array of items to serialize
 * @returns NodeJS Readable stream
 */
export function formatNDJSON(data) {
    const { Readable: ReadableStream } = require('stream');
    const ndjson = require('ndjson');
    const stream = ndjson.serialize();
    for (const item of data) {
        stream.write(item);
    }
    stream.end();
    return stream;
}
/**
 * Streams data as NDJSON using async generator.
 *
 * @param data - Async iterable of items
 * @returns Async generator yielding JSON lines
 */
export async function* streamNDJSON(data) {
    for await (const item of data) {
        yield JSON.stringify(item) + '\n';
    }
}
//# sourceMappingURL=ndjson.js.map