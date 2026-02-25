/**
 * JSON-Converter Library Export
 * Use as a library in your Node.js projects
 */

export { JSONConverter, converter } from "./converter.js";
export { JSONParser } from "./parser.js";
export type {
  ASTNode,
  ASTObject,
  ASTArray,
  ASTScalar,
  ASTType,
  ConversionOptions,
  Format,
  FormatGenerator,
} from "./types.js";

// Re-export generators for custom use
export { CSVGenerator } from "./generators/csv.js";
export { SQLGenerator } from "./generators/sql.js";
export { YAMLGenerator } from "./generators/yaml.js";
export { XMLGenerator } from "./generators/xml.js";
export { TOMLGenerator } from "./generators/toml.js";
export { TypeScriptGenerator } from "./generators/typescript.js";
export { JSONLGenerator } from "./generators/jsonl.js";
