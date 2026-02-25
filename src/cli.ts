#!/usr/bin/env node
/**
 * JSON-Converter CLI
 * Convert JSON to 15+ formats with a single command
 */

import { Command } from "commander";
import chalk from "chalk";
import { readFileSync } from "fs";
import { converter } from "./converter.js";
import type { Format, ConversionOptions } from "./types.js";

const program = new Command();

// CLI info
const cliInfo = {
  name: "json-converter",
  version: "1.0.0",
  description: "Convert JSON to 15+ formats with a single command",
};

program
  .name(cliInfo.name)
  .description(cliInfo.description)
  .version(cliInfo.version)
  .argument("[input]", "Input JSON file or string. Use '-' for stdin.")
  .option("-f, --format <format>", "Output format", "yaml")
  .option("-o, --output <file>", "Output file (default: stdout)")
  .option("-i, --indent <spaces>", "Indentation for pretty formats", "2")
  .option("-t, --table-name <name>", "Table name for SQL", "data")
  .option("-r, --root-name <name>", "Root name for code generation", "Data")
  .option("--list-formats", "List all supported formats")
  .action(action);

async function action(input: string | undefined, options: {
  format: string;
  output?: string;
  indent: string;
  tableName: string;
  rootName: string;
  listFormats?: boolean;
}) {
  // List formats if requested
  if (options.listFormats) {
    console.log(chalk.bold("\nSupported formats:\n"));
    const formats = converter.getSupportedFormats();
    const maxWidth = Math.max(...formats.map((f) => f.length));

    for (const format of formats) {
      const desc = converter.getFormatDescription(format as Format);
      console.log(
        chalk.cyan(format.padEnd(maxWidth + 2)) +
        chalk.gray("  # ") +
        chalk.white(desc)
      );
    }
    console.log();
    return;
  }

  // Validate format
  const format = options.format.toLowerCase() as Format;
  if (!converter.isFormatSupported(format)) {
    console.error(chalk.red(`Error: Unsupported format '${format}'`));
    console.error(chalk.gray(`Run with --list-formats to see all options`));
    process.exit(1);
  }

  // Get input JSON
  let json: string;
  if (!input || input === "-") {
    // Read from stdin
    if (process.stdin.isTTY) {
      console.error(chalk.red("Error: No input provided"));
      console.error(chalk.gray("Usage: json-converter <input.json> --format <format>"));
      console.error(chalk.gray("       cat data.json | json-converter --format csv"));
      process.exit(1);
    }

    // Read from stdin
    let stdinData = "";
    for await (const chunk of process.stdin) {
      stdinData += chunk;
    }
    json = stdinData.trim();
  } else if (input.startsWith("{") || input.startsWith("[")) {
    // Direct JSON string
    json = input;
  } else {
    // Read from file
    try {
      json = readFileSync(input, "utf-8");
    } catch (err) {
      console.error(chalk.red(`Error: Cannot read file: ${input}`));
      process.exit(1);
    }
  }

  // Validate JSON
  try {
    JSON.parse(json);
  } catch (err) {
    console.error(chalk.red("Error: Invalid JSON input"));
    console.error(chalk.gray((err as Error).message));
    process.exit(1);
  }

  // Convert
  const conversionOptions: ConversionOptions = {
    format,
    indent: parseInt(options.indent, 10) || 2,
    tableName: options.tableName,
    rootName: options.rootName,
  };

  try {
    const output = converter.convert(json, format, conversionOptions);

    // Write output
    if (options.output) {
      const { writeFileSync } = await import("fs");
      writeFileSync(options.output, output, "utf-8");
      console.log(chalk.green(`✓ Output written to ${options.output}`));
    } else {
      console.log(output);
    }
  } catch (err) {
    console.error(chalk.red("Error: Conversion failed"));
    console.error(chalk.gray((err as Error).message));
    process.exit(1);
  }
}

// Parse and execute
program.parse();
