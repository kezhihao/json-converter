/**
 * Core Parser: Converts JSON to Intermediate AST
 * Preserves structure, types, and nesting for format generation
 */

import type { ASTNode, ASTObject, ASTArray, ASTScalar, ASTType } from "./types.js";

export class JSONParser {
  /**
   * Parse JSON and convert to AST
   */
  parse(json: string): ASTNode {
    const value = JSON.parse(json);
    return this.toAST(value, []);
  }

  /**
   * Convert any JSON value to AST node
   */
  toAST(value: unknown, path: string[]): ASTNode {
    const type = this.getType(value);

    if (type === "object" && value !== null && !Array.isArray(value)) {
      return this.parseObject(value as Record<string, unknown>, path);
    }

    if (type === "array") {
      return this.parseArray(value as unknown[], path);
    }

    // At this point, type must be a scalar type
    const scalarType = type as "string" | "number" | "boolean" | "null";
    return this.parseScalar(value, scalarType, path);
  }

  /**
   * Detect type of JSON value
   */
  private getType(value: unknown): ASTType {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    const type = typeof value;
    if (type === "string" || type === "number" || type === "boolean") {
      return type;
    }
    return "object";
  }

  /**
   * Parse object to AST
   */
  private parseObject(obj: Record<string, unknown>, path: string[]): ASTObject {
    const children: ASTNode[] = [];

    for (const [key, value] of Object.entries(obj)) {
      const childPath = [...path, key];
      children.push(this.toAST(value, childPath));
    }

    return {
      type: "object",
      path,
      value: obj,
      children,
      metadata: { isRequired: true },
    };
  }

  /**
   * Parse array to AST
   */
  private parseArray(arr: unknown[], path: string[]): ASTArray {
    // For arrays, use the first element to infer structure
    const children: ASTNode[] = [];

    if (arr.length > 0) {
      // Infer structure from first non-null element
      const sample = arr.find((v) => v !== null && v !== undefined);
      if (sample !== undefined) {
        children.push(this.toAST(sample, [...path, "0"]));
      }
    }

    return {
      type: "array",
      path,
      value: arr,
      children,
      metadata: { isRequired: true },
    };
  }

  /**
   * Parse scalar value to AST
   */
  private parseScalar(
    value: unknown,
    type: "string" | "number" | "boolean" | "null",
    path: string[]
  ): ASTScalar {
    // Type assertion is safe here because we only call this with scalar types
    const scalarValue = value as string | number | boolean | null;
    return {
      type,
      path,
      value: scalarValue,
      metadata: {
        example: scalarValue,
        isRequired: true,
      },
    };
  }

  /**
   * Flatten AST to get all scalar values at a given depth
   * Useful for CSV generation
   */
  flatten(ast: ASTNode, maxDepth = Infinity): Record<string, unknown>[] {
    if (ast.type === "array") {
      const arrValue = ast.value as unknown[];
      if (arrValue.length > 0) {
        // Array of objects - flatten each object
        return arrValue
          .filter((v: unknown) => v !== null && typeof v === "object")
          .map((item: unknown) => this.flattenObject(item as Record<string, unknown>, 0, maxDepth));
      }
    }

    if (ast.type === "object") {
      // Single object
      return [this.flattenObject(ast.value as Record<string, unknown>, 0, maxDepth)];
    }

    // Scalar - return as single row
    return [{ value: ast.value }];
  }

  private flattenObject(
    obj: Record<string, unknown>,
    depth: number,
    maxDepth: number
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (value === null) {
        result[key] = null;
      } else if (typeof value === "object" && !Array.isArray(value) && depth < maxDepth) {
        // Nested object - flatten with dot notation
        const nested = this.flattenObject(value as Record<string, unknown>, depth + 1, maxDepth);
        for (const [nestedKey, nestedValue] of Object.entries(nested)) {
          result[`${key}.${nestedKey}`] = nestedValue;
        }
      } else if (Array.isArray(value) && depth < maxDepth) {
        // Array - convert to JSON string or join
        result[key] = JSON.stringify(value);
      } else {
        result[key] = value;
      }
    }

    return result;
  }
}
