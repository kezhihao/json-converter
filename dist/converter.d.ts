/**
 * Main Converter Class
 * Orchestrates parsing and format generation
 */
import type { Format, ConversionOptions, FormatGenerator } from "./types.js";
export declare class JSONConverter {
    private parser;
    private generators;
    constructor();
    /**
     * Register a custom format generator
     */
    registerGenerator(generator: FormatGenerator): void;
    /**
     * Get list of supported formats
     */
    getSupportedFormats(): Format[];
    /**
     * Get generator description for a format
     */
    getFormatDescription(format: Format): string;
    /**
     * Convert JSON to specified format
     */
    convert(json: string, format: Format, options?: Omit<ConversionOptions, 'format'>): string;
    /**
     * Convert JSON object (already parsed) to format
     */
    convertObject(obj: unknown, format: Format, options?: Omit<ConversionOptions, 'format'>): string;
    /**
     * Check if format is supported
     */
    isFormatSupported(format: string): format is Format;
}
export declare const converter: JSONConverter;
