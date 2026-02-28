# Contributing to JSON-Converter

Thank you for your interest in contributing! This is a CLI tool that converts JSON to 15+ formats.

## Quick Start

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `npm test`
5. Build: `npm run build`
6. Commit: `git commit -m "Add my feature"`
7. Push: `git push origin feature/my-feature`
8. Open a Pull Request

## Development

```bash
# Install dependencies
npm install

# Watch mode for development
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Adding a New Format

1. Create a new converter in `src/converters/`:
```typescript
export function convertToMyFormat(data: any, options: any = {}): string {
  // Your conversion logic here
  return result;
}
```

2. Register it in `src/index.ts`

3. Add tests in `test/`

## Code Style

- Use TypeScript for new files
- Follow existing code patterns
- Add JSDoc comments for public functions
- Keep functions small and focused

## Questions?

Open an issue and we'll discuss!
