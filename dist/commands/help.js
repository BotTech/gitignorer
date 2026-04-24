/**
 * Help command factory (per D-04).
 *
 * While Commander.js provides built-in help, D-04 explicitly requires
 * help to be stubbed alongside the other 7 commands for consistency.
 */
import { Command } from 'commander';
/**
 * Creates the help command.
 *
 * Per D-04: All 8 commands stubbed now (help, generate...).
 * This ensures all commands have consistent factory patterns.
 */
export function createHelpCommand() {
    const cmd = new Command('help');
    cmd.description('Show help information');
    cmd.argument('[command]', 'Command to show help for');
    cmd.action(() => {
        console.log('Not yet implemented');
        process.exit(0);
    });
    return cmd;
}
//# sourceMappingURL=help.js.map