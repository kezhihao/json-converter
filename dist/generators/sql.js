/**
 * SQL Generator
 * Generates INSERT statements for PostgreSQL/MySQL compatible SQL
 */
// Standalone helper functions
function escapeIdentifier(name) {
    // Sanitize column names
    const sanitized = name.replace(/[^a-zA-Z0-9_]/g, "_");
    return `"${sanitized}"`;
}
function escapeValue(value) {
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
function flatten(ast, maxDepth = Infinity) {
    if (ast.type === "array") {
        const arrValue = ast.value;
        if (arrValue.length > 0) {
            return arrValue
                .filter((v) => v !== null && typeof v === "object" && !Array.isArray(v))
                .map((item) => flattenObject(item, 0, maxDepth));
        }
        return [];
    }
    if (ast.type === "object") {
        const objValue = ast.value;
        // Check if object contains exactly one array value - if so, use that array
        const entries = Object.entries(objValue);
        if (entries.length === 1 && Array.isArray(entries[0][1])) {
            // Single array property - treat as array of rows
            const arrValue = entries[0][1];
            return arrValue
                .filter((v) => v !== null && typeof v === "object" && !Array.isArray(v))
                .map((item) => flattenObject(item, 0, maxDepth));
        }
        return [flattenObject(objValue, 0, maxDepth)];
    }
    return [{ value: ast.value }];
}
function flattenObject(obj, depth, maxDepth) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        if (value === null) {
            result[key] = null;
        }
        else if (typeof value === "object" && !Array.isArray(value) && depth < maxDepth) {
            const nested = flattenObject(value, depth + 1, maxDepth);
            for (const [nestedKey, nestedValue] of Object.entries(nested)) {
                result[`${key}.${nestedKey}`] = nestedValue;
            }
        }
        else if (Array.isArray(value) && depth < maxDepth) {
            result[key] = JSON.stringify(value);
        }
        else {
            result[key] = value;
        }
    }
    return result;
}
export const SQLGenerator = {
    name: "sql",
    description: "SQL INSERT statements",
    generate(ast, options) {
        const tableName = options.tableName || "data";
        const rows = flatten(ast);
        if (rows.length === 0)
            return "";
        // Get all unique columns
        const allColumns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
        const statements = [];
        for (const row of rows) {
            const columns = [];
            const values = [];
            for (const col of allColumns) {
                const value = row[col];
                if (value !== null && value !== undefined) {
                    columns.push(escapeIdentifier(col));
                    values.push(escapeValue(value));
                }
            }
            if (columns.length > 0) {
                statements.push(`INSERT INTO ${escapeIdentifier(tableName)} (${columns.join(", ")}) VALUES (${values.join(", ")});`);
            }
        }
        return statements.join("\n");
    },
};
