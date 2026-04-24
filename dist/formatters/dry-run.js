/**
 * Dry-run preview formatter.
 *
 * Per SAFE-02: Shows what would be written without writing.
 * Provides both text and JSON preview formats.
 */
/**
 * Formats dry-run result as text preview.
 *
 * @param result - Dry-run result with content and path
 * @returns Formatted preview string
 */
export function formatDryRun(result) {
    return `[DRY RUN] Would write to: ${result.path}
${'─'.repeat(40)}
${result.content}
${'─'.repeat(40)}`;
}
/**
 * Formats dry-run result as JSON.
 *
 * @param result - Dry-run result with content and path
 * @returns JSON object with dryRun flag
 */
export function formatDryRunJSON(result) {
    return {
        dryRun: true,
        path: result.path,
        content: result.content,
        length: result.content.length,
    };
}
//# sourceMappingURL=dry-run.js.map