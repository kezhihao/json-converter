/**
 * XML Generator
 * Simple XML output with proper escaping
 */
// Standalone helper functions
function escapeXML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}
function toXML(value, key, depth) {
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
        const entries = Object.entries(value);
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
export const XMLGenerator = {
    name: "xml",
    description: "XML format",
    generate(ast, options) {
        const rootName = options.rootName || "root";
        return '<?xml version="1.0" encoding="UTF-8"?>\n' + toXML(ast.value, rootName, 0);
    },
};
