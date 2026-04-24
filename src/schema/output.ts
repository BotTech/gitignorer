/**
 * Zod output schemas for all result shapes.
 *
 * Defines TypeScript types using z.infer for type safety.
 */

import { z } from 'zod';

/**
 * Template info schema.
 */
export const templateInfoSchema = z.object({
  name: z.string(),
  description: z.string(),
  lines: z.number(),
});

/**
 * Scan result schema.
 */
export const scanResultSchema = z.object({
  detected: z.array(z.string()),
  suggested: z.array(z.string()),
  confidence: z.number(),
});

/**
 * Generate result schema.
 */
export const generateResultSchema = z.object({
  templates: z.array(z.string()),
  content: z.string(),
  path: z.string(),
  dryRun: z.boolean().optional(),
});

/**
 * List result schema.
 */
export const listResultSchema = z.object({
  templates: z.array(templateInfoSchema),
  count: z.number(),
});

/**
 * Search result schema.
 */
export const searchResultSchema = z.object({
  results: z.array(templateInfoSchema),
  query: z.string(),
});

/**
 * Dry run result schema.
 */
export const dryRunResultSchema = z.object({
  dryRun: z.literal(true),
  path: z.string(),
  content: z.string(),
  length: z.number(),
});

// TypeScript types inferred from schemas
export type TemplateInfo = z.infer<typeof templateInfoSchema>;
export type ScanResult = z.infer<typeof scanResultSchema>;
export type GenerateResult = z.infer<typeof generateResultSchema>;
export type ListResult = z.infer<typeof listResultSchema>;
export type SearchResult = z.infer<typeof searchResultSchema>;
export type DryRunResult = z.infer<typeof dryRunResultSchema>;
