/**
 * CSV Generator
 */

import type { FormatGenerator, ASTNode, ConversionOptions } from "../types.js";

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

export const CSVGenerator: FormatGenerator = {
  name: "csv",
  description: "Comma-separated values (flat structure only)",

  generate(ast: ASTNode, options: ConversionOptions): string {
    const rows = flatten(ast);
    if (rows.length === 0) return "";

    // Get all unique keys from all rows
    const allKeys = Array.from(
      new Set(rows.flatMap((row: Record<string, unknown>) => Object.keys(row)))
    );

    // Build CSV
    const lines: string[] = [];

    // Header
    lines.push(allKeys.join(","));

    // Data rows
    for (const row of rows) {
      const values = allKeys.map((key) => {
        const value = row[key as string];
        if (value === null || value === undefined) return "";
        if (typeof value === "string") {
          // Escape quotes and wrap in quotes if contains comma or quote
          const escaped = value.replace(/"/g, '""');
          if (escaped.includes(",") || escaped.includes('"') || escaped.includes("\n")) {
            return `"${escaped}"`;
          }
          return escaped;
        }
        if (typeof value === "object") {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        return String(value);
      });
      lines.push(values.join(","));
    }

    return lines.join("\n");
  },
};
