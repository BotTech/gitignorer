/**
 * Schema command factory.
 *
 * Per D-04: Schema command with stub implementation.
 */
import { Command } from 'commander';
/**
 * Creates the schema command.
 */
export function createSchemaCommand() {
    const cmd = new Command('schema');
    cmd.description('Show schema for resources');
    // Add resource argument
    cmd.argument('<resource>', 'Resource to show schema for');
    // Stub action handler
    cmd.action(() => {
        console.log('Not yet implemented');
        process.exit(0);
    });
    return cmd;
}
//# sourceMappingURL=schema.js.map