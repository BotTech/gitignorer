/**
 * Common flags module for CLI commands.
 *
 * Per CONTEXT.md D-06: Common flags defined once and reused.
 */
import type { Command, OptionValues } from 'commander';
/**
 * Common CLI flags interface.
 */
export interface CommonFlags {
    /** Output format: json, ndjson, or stdout */
    output?: 'json' | 'ndjson' | 'stdout';
    /** Input format: json (for agent mode) */
    input?: 'json';
    /** Skip confirmation prompts (non-interactive mode) */
    yes?: boolean;
    /** Show what would be written without writing */
    dryRun?: boolean;
}
/**
 * Extracts common flags from Commander options.
 *
 * @param opts - Commander option values
 * @returns Common flags object
 */
export declare function getCommonFlags(opts: OptionValues): CommonFlags;
/**
 * Applies common flags to a command.
 *
 * @param command - The Commander command
 * @param options - Optional flags to apply (partial CommonFlags)
 * @returns The modified command
 */
export declare function applyCommonFlags(command: Command, options?: Partial<CommonFlags>): Command;
//# sourceMappingURL=flags.d.ts.map