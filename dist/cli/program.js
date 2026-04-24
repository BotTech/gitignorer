/**
 * Commander.js program configuration with I/O separation.
 *
 * Per CONTEXT.md D-04: All 8 commands registered with stub implementations.
 * Per CONTEXT.md D-06: configureOutput separates stdout/stderr channels.
 */
import { Command } from 'commander';
import { createHelpCommand } from '../commands/help.js';
import { createGenerateCommand } from '../commands/generate.js';
import { createScanCommand } from '../commands/scan.js';
import { createListCommand } from '../commands/list.js';
import { createSearchCommand } from '../commands/search.js';
import { createUpdateCommand } from '../commands/update.js';
import { createExamplesCommand } from '../commands/examples.js';
import { createSchemaCommand } from '../commands/schema.js';
/**
 * Creates the Commander.js program with all commands registered.
 */
export function createProgram() {
    const program = new Command();
    program.name('gitignorer');
    program.description('Generate intelligent .gitignore files');
    program.version('1.0.0');
    // Configure I/O separation (per OUTPUT-06)
    program.configureOutput({
        writeOut: (str) => process.stdout.write(str),
        writeErr: (str) => process.stderr.write(str),
        outputError: (str, write) => {
            write(`\x1b[31m${str}\x1b[0m`);
        },
    });
    // Register all 8 commands (per D-04)
    program.addCommand(createHelpCommand());
    program.addCommand(createGenerateCommand());
    program.addCommand(createScanCommand());
    program.addCommand(createListCommand());
    program.addCommand(createSearchCommand());
    program.addCommand(createUpdateCommand());
    program.addCommand(createExamplesCommand());
    program.addCommand(createSchemaCommand());
    return program;
}
//# sourceMappingURL=program.js.map