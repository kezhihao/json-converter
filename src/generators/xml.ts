/**
 * XML Generator
 * Simple XML output with proper escaping
 */

import type { FormatGenerator, ASTNode, ConversionOptions } from "../types.js";

// Standalone helper functions
function escapeXML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toXML(value: unknown, key: string, depth: number): string {
  const indent = "  ".repeat(depth);

  if (value === null || value === undefined) {
    return `${indent}<${key} />\n`;
  }

  if (typeof value === "boolean" || typeof value === "number") {
    return `${indent}<${key}>${value}</${key}>\n`;
  }

  if (typeof value === "string") {
    return `${indent}<${key}>${escapeXML(value)}</${key}>\n`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `${indent}<${key} />\n`;
    }
    let result = `${indent}<${key}>\n`;
    for (const item of value) {
      result += toXML(item, "item", depth + 1);
    }
    result += `${indent}</${key}>\n`;
    return result;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return `${indent}<${key} />\n`;
    }
    let result = `${indent}<${key}>\n`;
    for (const [k, v] of entries) {
      // Sanitize key for XML
      const sanitizedKey = k.replace(/[^a-zA-Z0-9_-]/g, "_");
      result += toXML(v, sanitizedKey, depth + 1);
    }
    result += `${indent}</${key}>\n`;
    return result;
  }

  return `${indent}<${key} />\n`;
}

export const XMLGenerator: FormatGenerator = {
  name: "xml",
  description: "XML format",

  generate(ast: ASTNode, options: ConversionOptions): string {
    const rootName = options.rootName || "root";
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + toXML(ast.value, rootName, 0);
  },
};
