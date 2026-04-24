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
export {};
//# sourceMappingURL=bin.d.ts.map