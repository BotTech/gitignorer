/**
 * Dry-run preview formatter.
 *
 * Per SAFE-02: Shows what would be written without writing.
 * Provides both text and JSON preview formats.
 */
/**
 * Dry-run result shape.
 */
export interface DryRunInput {
    content: string;
    path: string;
}
/**
 * Formats dry-run result as text preview.
 *
 * @param result - Dry-run result with content and path
 * @returns Formatted preview string
 */
export declare function formatDryRun(result: DryRunInput): string;
/**
 * Formats dry-run result as JSON.
 *
 * @param result - Dry-run result with content and path
 * @returns JSON object with dryRun flag
 */
export declare function formatDryRunJSON(result: DryRunInput): {
    dryRun: true;
    path: string;
    content: string;
    length: number;
};
//# sourceMappingURL=dry-run.d.ts.map