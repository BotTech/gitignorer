/**
 * JSON output formatter.
 *
 * Per CONTEXT.md D-09: JSON mode outputs structured data for agent mode.
 * Provides both pretty (2-space) and compact formatting.
 */
/**
 * Formats data as pretty-printed JSON.
 *
 * @param data - The data to format
 * @returns JSON string with 2-space indentation
 */
export function formatJSON(data) {
    return JSON.stringify(data, null, 2);
}
/**
 * Formats data as compact JSON.
 *
 * @param data - The data to format
 * @returns JSON string without whitespace
 */
export function formatJSONCompact(data) {
    return JSON.stringify(data);
}
//# sourceMappingURL=json.js.map