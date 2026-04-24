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
export declare const jsonInputSchema: z.ZodObject<{
    command: z.ZodEnum<{
        generate: "generate";
        scan: "scan";
        list: "list";
        search: "search";
        update: "update";
    }>;
    options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    cwd: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Dangerous pattern schema that rejects:
 * - Path traversal: ..
 * - Control characters: < 0x20 (including \x00)
 * - Query injection: ?, #, %
 */
export declare const dangerousPatternSchema: z.ZodString;
/**
 * Generate command input schema.
 */
export declare const generateInputSchema: z.ZodObject<{
    templates: z.ZodOptional<z.ZodArray<z.ZodString>>;
    output: z.ZodOptional<z.ZodEnum<{
        json: "json";
        ndjson: "ndjson";
        stdout: "stdout";
    }>>;
    yes: z.ZodOptional<z.ZodBoolean>;
    dryRun: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
/**
 * Scan command input schema.
 */
export declare const scanInputSchema: z.ZodObject<{
    cwd: z.ZodString;
    output: z.ZodOptional<z.ZodEnum<{
        json: "json";
        ndjson: "ndjson";
        stdout: "stdout";
    }>>;
}, z.core.$strip>;
/**
 * List command input schema.
 */
export declare const listInputSchema: z.ZodObject<{
    output: z.ZodOptional<z.ZodEnum<{
        json: "json";
        ndjson: "ndjson";
        stdout: "stdout";
    }>>;
}, z.core.$strip>;
/**
 * Search command input schema.
 */
export declare const searchInputSchema: z.ZodObject<{
    query: z.ZodString;
    output: z.ZodOptional<z.ZodEnum<{
        json: "json";
        ndjson: "ndjson";
        stdout: "stdout";
    }>>;
}, z.core.$strip>;
//# sourceMappingURL=input.d.ts.map