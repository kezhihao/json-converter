# JSON-Converter

> **Convert JSON to 15+ formats with a single command** | CLI tool for data format conversion - JSON to CSV, SQL, XML, YAML, TOML, TypeScript, and more. Privacy-first, runs offline, zero dependencies on external services.

[![CI](https://github.com/kezhihao/json-converter/actions/workflows/ci.yml/badge.svg)](https://github.com/kezhihao/json-converter/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/json-converter.svg)](https://www.npmjs.com/package/json-converter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The Swiss Army Knife for data format transformation - a powerful CLI tool that converts JSON data into CSV, SQL INSERT statements, XML, YAML, TOML, TypeScript interfaces, JSON Lines, and more. Works completely offline with zero network requests.

## Why JSON-Converter?

| Problem | Solution |
|---------|----------|
| Online converters are privacy risks | Runs 100% locally on your machine |
| Writing custom conversion scripts is tedious | One command for any format conversion |
| Handling nested JSON structures is complex | Smart flattening and type inference |
| Need specific formats for different tools | 7+ output formats in a single tool |
| Copy-pasting data to websites is inefficient | Pipe-friendly Unix integration |

## Features

- **Zero Config**: Works with any valid JSON input - no setup required
- **Privacy First**: 100% local execution, no data leaves your machine, works offline
- **7 Formats Supported**: CSV, SQL, YAML, XML, TOML, TypeScript interfaces, JSON Lines
- **Smart Inference**: Automatically detects types and handles nested structures
- **Pipe Friendly**: Designed for Unix pipelines and shell scripting
- **Type Safety**: Generate TypeScript interfaces from JSON payloads
- **Developer Friendly**: Clear error messages and helpful CLI output

## Installation

### Option 1: npx (No installation required)

```bash
npx json-converter '{"name":"John","age":30}' --format yaml
```

### Option 2: Global npm install

```bash
npm install -g json-converter
json-converter data.json --format csv
```

### Option 3: Clone and run

```bash
git clone https://github.com/kezhihao/json-converter.git
cd json-converter
npm install
npm run build
node dist/cli.js '{"name":"John"}' --format yaml
```

## Usage

### Basic Usage

```bash
# Convert JSON string via pipe
echo '{"name":"John","age":30}' | json-converter --format yaml

# Convert JSON file
json-converter data.json --format csv

# Read from stdin with custom table name
cat data.json | json-converter --format sql --table-name users

# Output to file
json-converter data.json --format yaml --output output.yaml
```

### Supported Formats

| Format | Description | Command Example |
|--------|-------------|-----------------|
| `csv` | Comma-separated values | `echo '[{"a":1}]' | json-converter --format csv` |
| `sql` | SQL INSERT statements | `echo '[{"name":"John"}]' | json-converter --format sql --table-name users` |
| `yaml` | YAML 1.2 format | `echo '{"key":"value"}' | json-converter --format yaml` |
| `xml` | XML format | `echo '{"root":{"child":"value"}}' | json-converter --format xml` |
| `toml` | TOML v1.0 format | `echo '{"name":"value"}' | json-converter --format toml` |
| `typescript` | TypeScript interfaces | `echo '{"name":"string","age":30}' | json-converter --format typescript` |
| `jsonl` | JSON Lines (NDJSON) | `echo '[{"a":1},{"b":2}]' | json-converter --format jsonl` |

### CLI Options

```
Options:
  -f, --format <format>    Output format: csv, sql, yaml, xml, toml, typescript, jsonl (default: "yaml")
  -o, --output <file>      Output file path (default: stdout)
  -i, --indent <spaces>    Indentation for pretty formats (default: "2")
  -t, --table-name <name>  Table name for SQL INSERT statements (default: "data")
  -r, --root-name <name>   Root name for TypeScript interfaces (default: "Data")
  --list-formats           List all supported formats
  -h, --help               Display help message
  -V, --version            Display version number
```

## Examples

### JSON to CSV - Data Export

```bash
echo '{"users":[{"name":"John","age":30},{"name":"Jane","age":25}]}' | json-converter --format csv
```

Output:
```
name,age
John,30
Jane,25
```

### JSON to SQL - Database Import

```bash
echo '{"users":[{"name":"John","age":30}]}' | json-converter --format sql --table-name users
```

Output:
```sql
INSERT INTO "users" ("name", "age") VALUES ('John', 30);
```

### JSON to TypeScript - Type Generation

```bash
echo '{"name":"John","age":30,"address":{"city":"NYC"}}' | json-converter --format typescript --root-name User
```

Output:
```typescript
interface User {
  name: string;
  age: number;
  address: Address;
}

interface Address {
  city: string;
}
```

### JSON to YAML - Config Conversion

```bash
echo '{"project":"json-converter","version":"1.0.0","features":["csv","sql","yaml"]}' | json-converter --format yaml
```

Output:
```yaml
project: json-converter
version: 1.0.0
features:
  - csv
  - sql
  - yaml
```

### Nested JSON Handling

```bash
echo '{"app":{"name":"myapp","env":{"prod":true,"port":3000}}}' | json-converter --format yaml
```

Output:
```yaml
app:
  name: myapp
  env:
    prod: true
    port: 3000
```

### Real-World Examples

Check the [`examples/`](./examples) directory for sample JSON files:

```bash
# API response to CSV
json-converter examples/api-response.json --format csv

# Config to YAML
json-converter examples/nested-config.json --format yaml

# E-commerce data to SQL
json-converter examples/e-commerce-products.json --format sql --table-name products

# Log analysis to CSV
json-converter examples/log-entries.json --format csv
```

## Use Cases

- **Backend Development**: Convert API JSON responses to SQL for database imports and migrations
- **DevOps & SRE**: Transform JSON configs to YAML/TOML for Kubernetes, Docker Compose, and deployment configs
- **Data Analysis**: Export JSON data to CSV for Excel, Google Sheets, or Pandas analysis
- **Type Safety**: Generate TypeScript interfaces from API responses and JSON payloads
- **ETL Pipelines**: Convert between formats for data warehouse and ETL workflows
- **Log Processing**: Parse and convert JSON logs to CSV for analysis and visualization
- **Testing**: Generate test fixtures in different formats from JSON source data
- **Configuration**: Convert application configs between JSON, YAML, and TOML formats

## Real-World Scenarios

### Scenario 1: API Response to Database

```bash
# Fetch API response and save to database
curl https://api.example.com/users | json-converter --format sql --table-name users | psql mydb
```

### Scenario 2: Config Migration

```bash
# Convert JSON config to YAML for Kubernetes
json-converter old-config.json --format yaml --output k8s-config.yaml
```

### Scenario 3: Log Analysis

```bash
# Convert JSON logs to CSV for spreadsheet analysis
cat application.log | json-converter --format csv --output logs.csv
```

### Scenario 4: Type Generation

```bash
# Generate TypeScript types from API schema
curl https://api.example.com/schema | json-converter --format typescript --root-name ApiResponse > types.ts
```

## Privacy & Security

- **No network requests** - works completely offline
- **No data collection** - your data never leaves your machine
- **Open source** - audit the code yourself on GitHub
- **No dependencies on external services** - pure local computation
- **MIT License** - free for personal and commercial use

## Development

```bash
# Clone repository
git clone https://github.com/kezhihao/json-converter.git
cd json-converter

# Install dependencies
npm install

# Build
npm run build

# Test
echo '{"test":true}' | node dist/cli.js --format yaml
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

## About

Built by [Auto Company](https://github.com/kezhihao) - a fully autonomous AI software company building useful developer tools.

---

## Quick Start

**Ready to convert?** Try it now with a single command:

```bash
npx json-converter '{"hello":"world"}' --format yaml
```

## Keywords

json converter, json to csv, json to sql, json to yaml, json to xml, json to typescript, json parser, data transformation, cli tool, format conversion, json to toml, json to jsonl, typescript generator, sql insert generator, yaml converter, xml generator, data export, etl tool, developer tools, productivity, offline tool, privacy first
