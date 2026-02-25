/**
 * YAML Generator
 * Simple YAML 1.2 compatible output
 */

import type { FormatGenerator, ASTNode, ConversionOptions } from "../types.js";

// Standalone helper functions
function needsQuotes(str: string): boolean {
  // Need quotes for: empty, special chars, numbers that look like strings
  if (str === "") return true;
  if (/^[\s,:{}\[\]&*#?|<>%'"`]/.test(str)) return true;
  if (str === "true" || str === "false" || str === "null") return true;
  if (/^\d+$/.test(str)) return true; // Number-only string
  return false;
}

function valueToYAML(value: unknown, depth: number, indent: number): string {
  if (value === null || value === undefined) {
    return "null";
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    // Check if we need quotes
    if (needsQuotes(value)) {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    return value;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const padding = " ".repeat(depth * indent);
    const items = value.map((v: unknown) => {
      const converted = valueToYAML(v, depth + 1, indent);
      if (typeof v === "object" && v !== null) {
        return `\n${padding}- ${converted.trim()}`;
      }
      return `- ${converted}`;
    });
    return items.join("\n" + padding);
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    const padding = " ".repeat(depth * indent);
    const innerPadding = " ".repeat((depth + 1) * indent);

    const lines: string[] = [];
    for (const [key, val] of entries) {
      const converted = valueToYAML(val, depth + 1, indent);
      const keyStr = needsQuotes(key) ? `"${key}"` : key;

      if (typeof val === "object" && val !== null && !Array.isArray(val)) {
        lines.push(`${keyStr}:`);
        const indented = converted
          .split("\n")
          .map((line: string) => innerPadding + line)
          .join("\n");
        lines.push(indented);
      } else if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object") {
        lines.push(`${keyStr}:`);
        const indented = converted
          .split("\n")
          .map((line: string) => innerPadding + line)
          .join("\n");
        lines.push(indented);
      } else {
        lines.push(`${keyStr}: ${converted.trim()}`);
      }
    }

    return lines.join("\n" + padding);
  }

  return "null";
}

export const YAMLGenerator: FormatGenerator = {
  name: "yaml",
  description: "YAML 1.2 format",

  generate(ast: ASTNode, options: ConversionOptions): string {
    const indent = options.indent || 2;
    return valueToYAML(ast.value, 0, indent);
  },
};
