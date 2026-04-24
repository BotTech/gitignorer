/**
 * Zod output schemas for all result shapes.
 *
 * Defines TypeScript types using z.infer for type safety.
 */
import { z } from 'zod';
/**
 * Template info schema.
 */
export declare const templateInfoSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    lines: z.ZodNumber;
}, z.core.$strip>;
/**
 * Scan result schema.
 */
export declare const scanResultSchema: z.ZodObject<{
    detected: z.ZodArray<z.ZodString>;
    suggested: z.ZodArray<z.ZodString>;
    confidence: z.ZodNumber;
}, z.core.$strip>;
/**
 * Generate result schema.
 */
export declare const generateResultSchema: z.ZodObject<{
    templates: z.ZodArray<z.ZodString>;
    content: z.ZodString;
    path: z.ZodString;
    dryRun: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
/**
 * List result schema.
 */
export declare const listResultSchema: z.ZodObject<{
    templates: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        lines: z.ZodNumber;
    }, z.core.$strip>>;
    count: z.ZodNumber;
}, z.core.$strip>;
/**
 * Search result schema.
 */
export declare const searchResultSchema: z.ZodObject<{
    results: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        lines: z.ZodNumber;
    }, z.core.$strip>>;
    query: z.ZodString;
}, z.core.$strip>;
/**
 * Dry run result schema.
 */
export declare const dryRunResultSchema: z.ZodObject<{
    dryRun: z.ZodLiteral<true>;
    path: z.ZodString;
    content: z.ZodString;
    length: z.ZodNumber;
}, z.core.$strip>;
export type TemplateInfo = z.infer<typeof templateInfoSchema>;
export type ScanResult = z.infer<typeof scanResultSchema>;
export type GenerateResult = z.infer<typeof generateResultSchema>;
export type ListResult = z.infer<typeof listResultSchema>;
export type SearchResult = z.infer<typeof searchResultSchema>;
export type DryRunResult = z.infer<typeof dryRunResultSchema>;
//# sourceMappingURL=output.d.ts.map