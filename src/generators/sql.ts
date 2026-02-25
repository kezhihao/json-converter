/**
 * SQL Generator
 * Generates INSERT statements for PostgreSQL/MySQL compatible SQL
 */

import type { FormatGenerator, ASTNode, ConversionOptions } from "../types.js";

// Standalone helper functions
function escapeIdentifier(name: string): string {
  // Sanitize column names
  const sanitized = name.replace(/[^a-zA-Z0-9_]/g, "_");
  return `"${sanitized}"`;
}

function escapeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "NULL";
  }
  if (typeof value === "string") {
    // Escape single quotes
    const escaped = value.replace(/'/g, "''");
    return `'${escaped}'`;
  }
  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "object") {
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  }
  return "NULL";
}

// Inline flatten function to avoid circular dependency
function flatten(ast: ASTNode, maxDepth = Infinity): Record<string, unknown>[] {
  if (ast.type === "array") {
    const arrValue = ast.value as unknown[];
    if (arrValue.length > 0) {
      return arrValue
        .filter((v: unknown) => v !== null && typeof v === "object" && !Array.isArray(v))
        .map((item: unknown) => flattenObject(item as Record<string, unknown>, 0, maxDepth));
    }
    return [];
  }

  if (ast.type === "object") {
    const objValue = ast.value as Record<string, unknown>;
    // Check if object contains exactly one array value - if so, use that array
    const entries = Object.entries(objValue);
    if (entries.length === 1 && Array.isArray(entries[0][1])) {
      // Single array property - treat as array of rows
      const arrValue = entries[0][1] as unknown[];
      return arrValue
        .filter((v: unknown) => v !== null && typeof v === "object" && !Array.isArray(v))
        .map((item: unknown) => flattenObject(item as Record<string, unknown>, 0, maxDepth));
    }
    return [flattenObject(objValue, 0, maxDepth)];
  }

  return [{ value: ast.value }];
}

function flattenObject(
  obj: Record<string, unknown>,
  depth: number,
  maxDepth: number
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === null) {
      result[key] = null;
    } else if (typeof value === "object" && !Array.isArray(value) && depth < maxDepth) {
      const nested = flattenObject(value as Record<string, unknown>, depth + 1, maxDepth);
      for (const [nestedKey, nestedValue] of Object.entries(nested)) {
        result[`${key}.${nestedKey}`] = nestedValue;
      }
    } else if (Array.isArray(value) && depth < maxDepth) {
      result[key] = JSON.stringify(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

export const SQLGenerator: FormatGenerator = {
  name: "sql",
  description: "SQL INSERT statements",

  generate(ast: ASTNode, options: ConversionOptions): string {
    const tableName = options.tableName || "data";
    const rows = flatten(ast);

    if (rows.length === 0) return "";

    // Get all unique columns
    const allColumns = Array.from(
      new Set(rows.flatMap((row: Record<string, unknown>) => Object.keys(row)))
    );

    const statements: string[] = [];

    for (const row of rows) {
      const columns: string[] = [];
      const values: string[] = [];

      for (const col of allColumns) {
        const value = row[col as string];
        if (value !== null && value !== undefined) {
          columns.push(escapeIdentifier(col as string));
          values.push(escapeValue(value));
        }
      }

      if (columns.length > 0) {
        statements.push(
          `INSERT INTO ${escapeIdentifier(tableName)} (${columns.join(", ")}) VALUES (${values.join(", ")});`
        );
      }
    }

    return statements.join("\n");
  },
};
