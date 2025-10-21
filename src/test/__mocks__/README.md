# test/__mocks__

Mock modules for Jest testing environment.

## Purpose

This directory contains mock implementations for non-JavaScript files and modules that need special handling during Jest test execution.

## Files Structure

```
src/test/__mocks__/
└── fileMock.js     # Mock for static asset imports (images, SVGs, etc.)
```

## Mock Files

### fileMock.js

Provides a simple string mock for file imports in tests. When tests import image files, SVGs, or other static assets, Jest uses this mock instead of attempting to load the actual file.

**Usage:** Automatically applied through Jest configuration for file extensions like `.png`, `.jpg`, `.svg`, etc.

## Configuration

These mocks are configured in `jest.config.js`:

```javascript
moduleNameMapper: {
  '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/test/__mocks__/fileMock.js'
}
```

## Adding New Mocks

To add a new mock module:

1. Create a mock file in this directory
2. Export the mocked functionality
3. Reference it in `jest.config.js` under `moduleNameMapper`

## Notes

- Mock files use `.js` extension even in TypeScript projects
- Mocks are applied globally to all tests
- Keep mocks simple and focused on test needs
