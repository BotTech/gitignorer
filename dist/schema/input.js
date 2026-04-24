/**
 * Zod input schemas with security refinements.
 *
 * Per INPUT-02, SAFE-04, SAFE-05: dangerousPatternSchema rejects
 * path traversal (..), control characters (< 0x20), and query
 * injection chars (?, #, %).
 */
import { z } from 'zod';
/**
 * JSON input schema for agent mode.
 */
export const jsonInputSchema = z.object({
    command: z.enum(['generate', 'scan', 'list', 'search', 'update']),
    options: z.record(z.string(), z.unknown()).optional(),
    cwd: z.string().optional(),
});
/**
 * Dangerous pattern schema that rejects:
 * - Path traversal: ..
 * - Control characters: < 0x20 (including \x00)
 * - Query injection: ?, #, %
 */
export const dangerousPatternSchema = z
    .string()
    .refine((val) => !val.includes('..'), 'Path traversal patterns (..) not allowed')
    .refine((val) => !val.includes('\x00') && ![...val].some((c) => c.charCodeAt(0) < 0x20 && c !== '\n' && c !== '\r' && c !== '\t'), 'Control characters not allowed')
    .refine((val) => !val.includes('?') && !val.includes('#') && !val.includes('%'), 'Query injection patterns (?, #, %) not allowed');
/**
 * Generate command input schema.
 */
export const generateInputSchema = z.object({
    templates: z.array(z.string()).optional(),
    output: z.enum(['json', 'ndjson', 'stdout']).optional(),
    yes: z.boolean().optional(),
    dryRun: z.boolean().optional(),
});
/**
 * Scan command input schema.
 */
export const scanInputSchema = z.object({
    cwd: dangerousPatternSchema,
    output: z.enum(['json', 'ndjson', 'stdout']).optional(),
});
/**
 * List command input schema.
 */
export const listInputSchema = z.object({
    output: z.enum(['json', 'ndjson', 'stdout']).optional(),
});
/**
 * Search command input schema.
 */
export const searchInputSchema = z.object({
    query: dangerousPatternSchema,
    output: z.enum(['json', 'ndjson', 'stdout']).optional(),
});
//# sourceMappingURL=input.js.map