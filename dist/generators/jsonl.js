/**
 * JSON Lines Generator
 * One JSON object per line
 */
export const JSONLGenerator = {
    name: "jsonl",
    description: "JSON Lines (newline-delimited JSON)",
    generate(ast, options) {
        const { JSONParser } = require("../parser.js");
        const parser = new JSONParser();
        if (ast.type === "array") {
            // Array of objects - one per line
            const arrValue = ast.value;
            return arrValue
                .filter((v) => v !== null && typeof v === "object")
                .map((v) => JSON.stringify(v))
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
