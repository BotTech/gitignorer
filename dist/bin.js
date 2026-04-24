#!/usr/bin/env node
/**
 * CLI binary entry point for gitignorer.
 *
 * Orchestrates mode resolution, program creation, and error handling.
 *
 * ARCHITECTURAL SEQUENCING NOTE:
 * - mode.ts is created in Plan 01 (enum, resolver function)
 * - program.ts is created in Plan 03 (Commander.js setup)
 * - Mode resolution with program flags is wired in Plan 03
 * - In Phase 1, mode defaults to INTERACTIVE when TTY because program.opts()
 *   returns empty object before parseAsync(). This is correct behavior.
 */
import { createProgram } from './cli/program.js';
import { resolveMode } from './cli/mode.js';
import { handleTopLevelError } from './cli/error-handler.js';
/**
 * Main entry point.
 */
async function main() {
    // Create program instance (will be implemented in Plan 03)
    const program = createProgram();
    // Resolve mode before parsing
    // In Phase 1, program.opts() returns {} before parseAsync(),
    // so hasInputFlag/hasYesFlag default to false. This is correct.
    const mode = resolveMode({
        isTTY: process.stdout.isTTY ?? false,
        hasInputFlag: program.opts().input === 'json',
        hasYesFlag: program.opts().yes === true,
    });
    // Mode available for formatters via global or context (Phase 2+)
    // For Phase 1, mode is determined but not yet used by formatters.
    // Parse arguments async with error handling
    await program.parseAsync(process.argv);
}
// Start the CLI
main().catch(handleTopLevelError);
//# sourceMappingURL=bin.js.map