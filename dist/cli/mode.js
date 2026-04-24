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
export var CliMode;
(function (CliMode) {
    /** Interactive mode with TTY and prompts enabled */
    CliMode["INTERACTIVE"] = "INTERACTIVE";
    /** Non-interactive mode (no TTY or --yes flag) */
    CliMode["NON_INTERACTIVE"] = "NON_INTERACTIVE";
    /** Agent mode with JSON input/output (--input json) */
    CliMode["AGENT"] = "AGENT";
})(CliMode || (CliMode = {}));
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
export function resolveMode(opts) {
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
export function isInteractiveMode(mode) {
    return mode === CliMode.INTERACTIVE;
}
/**
 * Type guard for AGENT mode.
 */
export function isAgentMode(mode) {
    return mode === CliMode.AGENT;
}
//# sourceMappingURL=mode.js.map