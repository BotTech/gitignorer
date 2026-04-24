/**
 * CLI execution modes for three-mode behavior.
 *
 * Per CONTEXT.md D-07: Mode is determined by TTY detection and flags.
 * - INTERACTIVE: TTY detected, no --yes, no --input json
 * - NON_INTERACTIVE: No TTY OR --yes flag
 * - AGENT: --input json flag
 *
 * CLI-05 coverage: isTTY=false (piped input) returns NON_INTERACTIVE,
 * preventing prompts from hanging when input is piped.
 */

/**
 * Three execution modes for the CLI.
 */
export enum CliMode {
  /** Interactive mode with TTY and prompts enabled */
  INTERACTIVE = 'INTERACTIVE',
  /** Non-interactive mode (no TTY or --yes flag) */
  NON_INTERACTIVE = 'NON_INTERACTIVE',
  /** Agent mode with JSON input/output (--input json) */
  AGENT = 'AGENT',
}

/**
 * Options for mode resolution.
 */
export interface ModeOptions {
  /** TTY detection result (process.stdout.isTTY) */
  isTTY: boolean;
  /** Whether --input json flag is present */
  hasInputFlag: boolean;
  /** Whether --yes flag is present */
  hasYesFlag: boolean;
}

/**
 * Resolves the CLI mode based on TTY detection and flags.
 *
 * Per CONTEXT.md D-07 resolution logic:
 * 1. If hasInputFlag: return AGENT
 * 2. If !isTTY OR hasYesFlag: return NON_INTERACTIVE
 * 3. Otherwise: return INTERACTIVE
 *
 * @param opts - Mode resolution options
 * @returns The resolved CLI mode
 */
export function resolveMode(opts: ModeOptions): CliMode {
  if (opts.hasInputFlag) {
    return CliMode.AGENT;
  }
  if (!opts.isTTY || opts.hasYesFlag) {
    return CliMode.NON_INTERACTIVE;
  }
  return CliMode.INTERACTIVE;
}

/**
 * Type guard for INTERACTIVE mode.
 */
export function isInteractiveMode(mode: CliMode): boolean {
  return mode === CliMode.INTERACTIVE;
}

/**
 * Type guard for AGENT mode.
 */
export function isAgentMode(mode: CliMode): boolean {
  return mode === CliMode.AGENT;
}
