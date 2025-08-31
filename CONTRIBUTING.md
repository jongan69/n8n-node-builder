# Contributing to n8n Node Builder

Thank you for your interest in contributing to the n8n Node Builder! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js (version 18.0.0 or higher)
- npm (version 9.0.0 or higher) or bun
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/n8n-node-builder.git
   cd n8n-node-builder
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   bun dev
   ```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use Prettier for code formatting
- Use ESLint for code linting

### Testing

- Write tests for new features
- Ensure all tests pass before submitting a PR
- Run tests with: `npm run test`
- Run tests with coverage: `npm run test:coverage`

### Git Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Commit your changes with descriptive commit messages
4. Push your branch to your fork
5. Create a Pull Request

### Commit Message Format

Use conventional commit messages:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(ui): add dark mode toggle
fix(builder): resolve issue with field validation
docs(readme): update installation instructions
```

## Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Add tests for new functionality
3. Update documentation if needed
4. Ensure all tests pass
5. Update the CHANGELOG.md if applicable
6. Submit your Pull Request

### Pull Request Checklist

- [ ] Code follows the project's style guidelines
- [ ] Tests have been added/updated and pass
- [ ] Documentation has been updated
- [ ] No console errors or warnings
- [ ] Code is properly typed (TypeScript)
- [ ] Accessibility considerations have been made
- [ ] Mobile responsiveness has been tested

## Reporting Issues

When reporting issues, please include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser and OS information
- Any relevant console errors

## Feature Requests

When suggesting new features:

- Describe the feature in detail
- Explain why it would be useful
- Provide examples of how it would work
- Consider the impact on existing functionality

## Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. By participating, you are expected to uphold this code.

## Questions?

If you have questions about contributing, please:

1. Check the existing documentation
2. Search existing issues and discussions
3. Create a new discussion or issue

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.
