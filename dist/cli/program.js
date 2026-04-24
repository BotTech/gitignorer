/**
 * STUB: Commander.js program configuration.
 *
 * This stub is created in Plan 01 to satisfy imports in bin.ts.
 * Full implementation happens in Plan 03.
 */
import { Command } from 'commander';
/**
 * Creates the Commander.js program (stub implementation).
 */
export function createProgram() {
    const program = new Command();
    program.name('gitignorer');
    program.description('Generate intelligent .gitignore files');
    program.version('1.0.0');
    return program;
}
//# sourceMappingURL=program.js.map