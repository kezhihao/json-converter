/**
 * JSON Lines Generator
 * One JSON object per line
 */

import type { FormatGenerator, ASTNode, ConversionOptions } from "../types.js";

export const JSONLGenerator: FormatGenerator = {
  name: "jsonl",
  description: "JSON Lines (newline-delimited JSON)",

  generate(ast: ASTNode, options: ConversionOptions): string {
    const { JSONParser } = require("../parser.js");
    const parser = new JSONParser();

    if (ast.type === "array") {
      // Array of objects - one per line
      const arrValue = ast.value as unknown[];
      return arrValue
        .filter((v: unknown) => v !== null && typeof v === "object")
        .map((v: unknown) => JSON.stringify(v))
        .join("\n");
    }

    if (ast.type === "object") {
      // Single object - wrap in array or just output
      return JSON.stringify(ast.value);
    }

    // Scalar - wrap as object
    return JSON.stringify({ value: ast.value });
  },
};
