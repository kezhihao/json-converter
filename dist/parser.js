/**
 * Core Parser: Converts JSON to Intermediate AST
 * Preserves structure, types, and nesting for format generation
 */
export class JSONParser {
    /**
     * Parse JSON and convert to AST
     */
    parse(json) {
        const value = JSON.parse(json);
        return this.toAST(value, []);
    }
    /**
     * Convert any JSON value to AST node
     */
    toAST(value, path) {
        const type = this.getType(value);
        if (type === "object" && value !== null && !Array.isArray(value)) {
            return this.parseObject(value, path);
        }
        if (type === "array") {
            return this.parseArray(value, path);
        }
        // At this point, type must be a scalar type
        const scalarType = type;
        return this.parseScalar(value, scalarType, path);
    }
    /**
     * Detect type of JSON value
     */
    getType(value) {
        if (value === null)
            return "null";
        if (Array.isArray(value))
            return "array";
        const type = typeof value;
        if (type === "string" || type === "number" || type === "boolean") {
            return type;
        }
        return "object";
    }
    /**
     * Parse object to AST
     */
    parseObject(obj, path) {
        const children = [];
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
    parseArray(arr, path) {
        // For arrays, use the first element to infer structure
        const children = [];
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
    parseScalar(value, type, path) {
        // Type assertion is safe here because we only call this with scalar types
        const scalarValue = value;
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
    flatten(ast, maxDepth = Infinity) {
        if (ast.type === "array") {
            const arrValue = ast.value;
            if (arrValue.length > 0) {
                // Array of objects - flatten each object
                return arrValue
                    .filter((v) => v !== null && typeof v === "object")
                    .map((item) => this.flattenObject(item, 0, maxDepth));
            }
        }
        if (ast.type === "object") {
            // Single object
            return [this.flattenObject(ast.value, 0, maxDepth)];
        }
        // Scalar - return as single row
        return [{ value: ast.value }];
    }
    flattenObject(obj, depth, maxDepth) {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value === null) {
                result[key] = null;
            }
            else if (typeof value === "object" && !Array.isArray(value) && depth < maxDepth) {
                // Nested object - flatten with dot notation
                const nested = this.flattenObject(value, depth + 1, maxDepth);
                for (const [nestedKey, nestedValue] of Object.entries(nested)) {
                    result[`${key}.${nestedKey}`] = nestedValue;
                }
            }
            else if (Array.isArray(value) && depth < maxDepth) {
                // Array - convert to JSON string or join
                result[key] = JSON.stringify(value);
            }
            else {
                result[key] = value;
            }
        }
        return result;
    }
}
