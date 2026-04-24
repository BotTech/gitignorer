/**
 * Flag value parser and normalizer.
 *
 * Validates output and input flag values against allowed enums.
 * Throws ValidationError with descriptive messages for invalid values.
 */
/**
 * Parses and validates the --output flag.
 *
 * @param value - The flag value to validate
 * @returns The validated output format
 * @throws ValidationError if value is not 'json', 'ndjson', or 'stdout'
 */
export declare function parseOutputFlag(value: unknown): 'json' | 'ndjson' | 'stdout';
/**
 * Parses and validates the --input flag.
 *
 * @param value - The flag value to validate
 * @returns The validated input format or undefined
 * @throws ValidationError if value is not undefined or 'json'
 */
export declare function parseInputFlag(value: unknown): 'json' | undefined;
//# sourceMappingURL=flags.d.ts.map