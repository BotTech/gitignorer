/**
 * Flag value parser and normalizer.
 *
 * Validates output and input flag values against allowed enums.
 * Throws ValidationError with descriptive messages for invalid values.
 */

import { ValidationError } from '../schema/errors.js';

/**
 * Parses and validates the --output flag.
 *
 * @param value - The flag value to validate
 * @returns The validated output format
 * @throws ValidationError if value is not 'json', 'ndjson', or 'stdout'
 */
export function parseOutputFlag(value: unknown): 'json' | 'ndjson' | 'stdout' {
  if (value === 'json' || value === 'ndjson' || value === 'stdout') {
    return value;
  }
  throw new ValidationError(
    `Invalid output format: ${String(value)}. Must be json, ndjson, or stdout`,
    [],
  );
}

/**
 * Parses and validates the --input flag.
 *
 * @param value - The flag value to validate
 * @returns The validated input format or undefined
 * @throws ValidationError if value is not undefined or 'json'
 */
export function parseInputFlag(value: unknown): 'json' | undefined {
  if (value === undefined || value === 'json') {
    return value;
  }
  throw new ValidationError(
    `Invalid input format: ${String(value)}. Must be json`,
    [],
  );
}
