/**
 * Intermediate AST representation for JSON data
 * Preserves structure and type information for format generation
 */

export type ASTType =
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "array"
  | "object";

export interface ASTNode {
  type: ASTType;
  path: string[];
  value: unknown;
  children?: ASTNode[];
  metadata?: {
    isRequired?: boolean;
    description?: string;
    example?: unknown;
  };
}

export interface ASTObject extends ASTNode {
  type: "object";
  value: Record<string, unknown>;
  children: ASTNode[];
}

export interface ASTArray extends ASTNode {
  type: "array";
  value: unknown[];
  children: ASTNode[];
}

export interface ASTScalar extends ASTNode {
  type: "string" | "number" | "boolean" | "null";
  value: string | number | boolean | null;
}

export interface ConversionOptions {
  format: Format;
  input?: string;
  output?: string;
  pretty?: boolean;
  indent?: number;
  tableName?: string; // For SQL
  rootName?: string; // For code generation
  stream?: boolean; // For large files
}

export type Format =
  | "csv"
  | "sql"
  | "xml"
  | "yaml"
  | "toml"
  | "typescript"
  | "go"
  | "rust"
  | "java"
  | "csharp"
  | "python"
  | "graphql"
  | "protobuf"
  | "avro"
  | "jsonl";

export interface FormatGenerator {
  name: Format;
  generate(ast: ASTNode, options: ConversionOptions): string;
  description: string;
}
