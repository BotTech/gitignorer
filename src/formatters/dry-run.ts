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
export function formatDryRun(result: DryRunInput): string {
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
export function formatDryRunJSON(result: DryRunInput): {
  dryRun: true;
  path: string;
  content: string;
  length: number;
} {
  return {
    dryRun: true,
    path: result.path,
    content: result.content,
    length: result.content.length,
  };
}
