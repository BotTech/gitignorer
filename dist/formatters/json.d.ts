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
export declare function formatJSON(data: unknown): string;
/**
 * Formats data as compact JSON.
 *
 * @param data - The data to format
 * @returns JSON string without whitespace
 */
export declare function formatJSONCompact(data: unknown): string;
//# sourceMappingURL=json.d.ts.map