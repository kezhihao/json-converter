/**
 * TypeScript Generator
 * Generates TypeScript interfaces from JSON
 */
// Standalone helper functions
function toPascalCase(str) {
    return str
        .replace(/[^a-zA-Z0-9]/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join("");
}
function toSingular(str) {
    if (str.endsWith("ies"))
        return str.slice(0, -3) + "y";
    if (str.endsWith("es"))
        return str.slice(0, -2);
    if (str.endsWith("s"))
        return str.slice(0, -1);
    return str;
}
function toSafePropName(name) {
    // Escape reserved keywords and invalid identifiers
    const reserved = [
        "break",
        "case",
        "catch",
        "class",
        "const",
        "continue",
        "debugger",
        "default",
        "delete",
        "do",
        "else",
        "enum",
        "export",
        "extends",
        "false",
        "finally",
        "for",
        "function",
        "if",
        "import",
        "in",
        "instanceof",
        "new",
        "null",
        "return",
        "super",
        "switch",
        "this",
        "throw",
        "true",
        "try",
        "typeof",
        "var",
        "void",
        "while",
        "with",
    ];
    if (reserved.includes(name)) {
        return `"${name}"`;
    }
    if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
        return `"${name}"`;
    }
    return name;
}
function getTypeName(node) {
    const scalarTypes = {
        string: "string",
        number: "number",
        boolean: "boolean",
        null: "null",
    };
    if (node.type in scalarTypes) {
        return scalarTypes[node.type];
    }
    if (node.type === "array") {
        const firstChild = node.children?.[0];
        if (firstChild) {
            const innerType = getTypeName(firstChild);
            return `${innerType}[]`;
        }
        return "any[]";
    }
    if (node.type === "object") {
        const name = node.path[node.path.length - 1] || "Object";
        return toPascalCase(name);
    }
    return "any";
}
function generateType(node, name, depth) {
    const indent = "  ".repeat(depth);
    if (node.type === "object") {
        let result = `${indent}interface ${name} {\n`;
        for (const child of node.children || []) {
            const propName = toSafePropName(child.path[child.path.length - 1] || "prop");
            const typeName = getTypeName(child);
            const optional = child.metadata?.isRequired ? "" : "?";
            result += `${indent}  ${propName}${optional}: ${typeName};\n`;
        }
        result += `${indent}}\n`;
        return result;
    }
    if (node.type === "array") {
        const firstChild = node.children?.[0];
        if (firstChild) {
            const itemName = toSingular(name);
            return generateType(firstChild, itemName, depth);
        }
        return `${indent}type ${name} = any[];\n`;
    }
    return `${indent}type ${name} = ${getTypeName(node)};\n`;
}
export const TypeScriptGenerator = {
    name: "typescript",
    description: "TypeScript interface/type definitions",
    generate(ast, options) {
        const interfaceName = toPascalCase(options.rootName || "Data");
        return generateType(ast, interfaceName, 0);
    },
};
