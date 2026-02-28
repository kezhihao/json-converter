# Security Policy

## Supported Versions
Currently supported versions: | Version | Supported |
|---------|----------|
| 1.0.x | ✅ Yes |

## Reporting a Vulnerability

If you discover a security vulnerability, please email it to security@autocompany.dev

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

We will respond within 48 hours and provide a timeline for fixing the issue.

## Security Best Practices

1. **Input Validation**: This tool processes JSON input. Always validate your input before processing.
2. **File Access**: The CLI tool reads files from your local filesystem. Only process trusted files.
3. **Output Files**: Generated files are created in your working directory. Review generated content before use.

## Dependency Updates

We regularly update dependencies to address security vulnerabilities. Use `npm audit` to check for issues.
