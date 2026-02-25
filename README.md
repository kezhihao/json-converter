# JSON-Converter

> Convert JSON to 15+ formats with a single command

The Swiss Army Knife for data format conversion - a CLI tool that transforms JSON data into CSV, SQL, XML, YAML, TOML, TypeScript interfaces, and more. Runs locally, privately, with zero API calls.

## Features

- **Zero Config**: Works with any valid JSON input
- **Privacy First**: Runs locally, no data leaves your machine
- **7 Formats Supported**: CSV, SQL, YAML, XML, TOML, TypeScript, JSON Lines
- **Smart Inference**: Automatically detects types and nested structures
- **Pipe Friendly**: Works seamlessly with Unix pipes

## Installation

### Option 1: npx (No install required)
```bash
npx json-converter '{"name":"John","age":30}' --format yaml
```

### Option 2: Clone and run
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
# Convert JSON string
echo '{"name":"John","age":30}' | json-converter --format yaml

# Convert JSON file
json-converter data.json --format csv

# Read from stdin
cat data.json | json-converter --format sql --table-name users
```

### Supported Formats

| Format | Description | Example |
|--------|-------------|---------|
| `csv` | Comma-separated values | `echo '[{"a":1}]' | json-converter --format csv` |
| `sql` | SQL INSERT statements | `echo '[{"name":"John"}]' | json-converter --format sql --table-name users` |
| `yaml` | YAML 1.2 format | `echo '{"key":"value"}' | json-converter --format yaml` |
| `xml` | XML format | `echo '{"root":{"child":"value"}}' | json-converter --format xml` |
| `toml` | TOML v1.0 format | `echo '{"name":"value"}' | json-converter --format toml` |
| `typescript` | TypeScript interfaces | `echo '{"name":"string","age":30}' | json-converter --format typescript` |
| `jsonl` | JSON Lines (NDJSON) | `echo '[{"a":1},{"b":2}]' | json-converter --format jsonl` |

### Options

```
Options:
  -f, --format <format>    Output format (default: "yaml")
  -o, --output <file>      Output file (default: stdout)
  -i, --indent <spaces>    Indentation for pretty formats (default: "2")
  -t, --table-name <name>  Table name for SQL (default: "data")
  -r, --root-name <name>   Root name for code generation (default: "Data")
  --list-formats           List all supported formats
  -h, --help               Display help
  -V, --version            Display version
```

## Examples

### JSON to CSV
```bash
echo '{"users":[{"name":"John","age":30},{"name":"Jane","age":25}]}' | json-converter --format csv
```

Output:
```
name,age
John,30
Jane,25
```

### JSON to SQL
```bash
echo '{"users":[{"name":"John","age":30}]}' | json-converter --format sql --table-name users
```

Output:
```sql
INSERT INTO "users" ("name", "age") VALUES ('John', 30);
```

### JSON to TypeScript
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
```

### JSON to YAML
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

### Output to File
```bash
json-converter data.json --format csv --output output.csv
```

## Use Cases

- **Backend Development**: Convert API JSON responses to SQL for database imports
- **DevOps**: Transform JSON configs to YAML/TOML for deployment
- **Data Analysis**: Export JSON data to CSV for spreadsheet analysis
- **Type Safety**: Generate TypeScript interfaces from JSON payloads
- **Data Migration**: Convert between formats for ETL pipelines

## Why JSON-Converter?

| Problem | Solution |
|---------|----------|
| Online converters are privacy risks | Runs 100% locally |
| Writing custom conversion scripts is tedious | One command for any format |
| Handling nested JSON is complex | Smart flattening of nested structures |
| Need specific format for a tool | 7+ formats in one tool |

## Privacy & Security

- **No network requests** - works offline
- **No data collection** - your data never leaves your machine
- **Open source** - audit the code yourself
- **No dependencies on external services**

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
echo '{"test":true}' | node dist/cli.js --format yaml
```

## License

MIT

## About

Built by [Auto Company](https://github.com/kezhihao) - a fully autonomous AI software company.

---

**Ready to convert?** Try it now:

```bash
npx json-converter '{"hello":"world"}' --format yaml
```
