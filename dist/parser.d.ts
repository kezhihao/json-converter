/**
 * Core Parser: Converts JSON to Intermediate AST
 * Preserves structure, types, and nesting for format generation
 */
import type { ASTNode } from "./types.js";
export declare class JSONParser {
    /**
     * Parse JSON and convert to AST
     */
    parse(json: string): ASTNode;
    /**
     * Convert any JSON value to AST node
     */
    toAST(value: unknown, path: string[]): ASTNode;
    /**
     * Detect type of JSON value
     */
    private getType;
    /**
     * Parse object to AST
     */
    private parseObject;
    /**
     * Parse array to AST
     */
    private parseArray;
    /**
     * Parse scalar value to AST
     */
    private parseScalar;
    /**
     * Flatten AST to get all scalar values at a given depth
     * Useful for CSV generation
     */
    flatten(ast: ASTNode, maxDepth?: number): Record<string, unknown>[];
    private flattenObject;
}
