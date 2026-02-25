/**
 * CSV Generator
 */
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
export const CSVGenerator = {
    name: "csv",
    description: "Comma-separated values (flat structure only)",
    generate(ast, options) {
        const rows = flatten(ast);
        if (rows.length === 0)
            return "";
        // Get all unique keys from all rows
        const allKeys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
        // Build CSV
        const lines = [];
        // Header
        lines.push(allKeys.join(","));
        // Data rows
        for (const row of rows) {
            const values = allKeys.map((key) => {
                const value = row[key];
                if (value === null || value === undefined)
                    return "";
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
