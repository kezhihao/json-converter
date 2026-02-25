/**
 * Main Converter Class
 * Orchestrates parsing and format generation
 */
import { JSONParser } from "./parser.js";
// Import all generators
import { CSVGenerator } from "./generators/csv.js";
import { SQLGenerator } from "./generators/sql.js";
import { YAMLGenerator } from "./generators/yaml.js";
import { XMLGenerator } from "./generators/xml.js";
import { TOMLGenerator } from "./generators/toml.js";
import { TypeScriptGenerator } from "./generators/typescript.js";
import { JSONLGenerator } from "./generators/jsonl.js";
export class JSONConverter {
    parser;
    generators;
    constructor() {
        this.parser = new JSONParser();
        this.generators = new Map();
        // Register all generators
        this.registerGenerator(CSVGenerator);
        this.registerGenerator(SQLGenerator);
        this.registerGenerator(YAMLGenerator);
        this.registerGenerator(XMLGenerator);
        this.registerGenerator(TOMLGenerator);
        this.registerGenerator(TypeScriptGenerator);
        this.registerGenerator(JSONLGenerator);
    }
    /**
     * Register a custom format generator
     */
    registerGenerator(generator) {
        this.generators.set(generator.name, generator);
    }
    /**
     * Get list of supported formats
     */
    getSupportedFormats() {
        return Array.from(this.generators.keys());
    }
    /**
     * Get generator description for a format
     */
    getFormatDescription(format) {
        const gen = this.generators.get(format);
        return gen?.description || "Unknown format";
    }
    /**
     * Convert JSON to specified format
     */
    convert(json, format, options = {}) {
        // Parse JSON to AST
        const ast = this.parser.parse(json);
        // Get generator
        const generator = this.generators.get(format);
        if (!generator) {
            throw new Error(`Unsupported format: ${format}`);
        }
        // Generate output with format included in options
        const fullOptions = { ...options, format };
        return generator.generate(ast, fullOptions);
    }
    /**
     * Convert JSON object (already parsed) to format
     */
    convertObject(obj, format, options = {}) {
        const json = JSON.stringify(obj, null, 2);
        return this.convert(json, format, options);
    }
    /**
     * Check if format is supported
     */
    isFormatSupported(format) {
        return this.generators.has(format);
    }
}
// Singleton instance
export const converter = new JSONConverter();
