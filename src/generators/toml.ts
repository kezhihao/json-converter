/**
 * TOML Generator
 * TOML v1.0 compatible output
 */

import type { FormatGenerator, ASTNode, ConversionOptions } from "../types.js";

// Standalone helper functions
function sanitizeKey(key: string): string {
  // TOML keys: alphanumeric, underscore, dash
  if (/^[a-zA-Z0-9_-]+$/.test(key)) {
    return key;
  }
  return `"${key}"`;
}

function toTOML(value: unknown, prefix: string, depth: number): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "boolean") {
    return `${value}`;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    // Basic string escaping
    if (value.includes("\n") || value.includes('"')) {
      return `'''${value}'''`;
    }
    return `"${value}"`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((v: unknown) => toTOML(v, "", 0));
    return `[${items.join(", ")}]`;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "";

    let result = "";

    for (const [key, val] of entries) {
      const keyStr = sanitizeKey(key);

      if (typeof val === "object" && val !== null && !Array.isArray(val)) {
        // Nested object - use table
        const tableKey = prefix ? `${prefix}.${keyStr}` : keyStr;
        result += `\n[${tableKey}]\n`;
        result += toTOML(val, tableKey, depth + 1);
      } else if (
        Array.isArray(val) &&
        val.length > 0 &&
        typeof val[0] === "object" &&
        val[0] !== null
      ) {
        // Array of tables
        const tableKey = prefix ? `${prefix}.${keyStr}` : keyStr;
        for (const item of val) {
          result += `\n[[${tableKey}]]\n`;
          result += toTOML(item, tableKey, depth + 1);
        }
      } else {
        // Primitive value
        const valStr = toTOML(val, "", 0);
        result += `${keyStr} = ${valStr}\n`;
      }
    }

    return result;
  }

  return "";
}

export const TOMLGenerator: FormatGenerator = {
  name: "toml",
  description: "TOML v1.0 format",

  generate(ast: ASTNode, options: ConversionOptions): string {
    return toTOML(ast.value, "", 0);
  },
};
