# test

Test utilities, setup, and mock modules for Jest testing environment.

## Purpose

This directory contains test configuration, setup files, and mock modules that support the Jest testing infrastructure for the entire application.

## Files Structure

```
src/test/
├── __mocks__/
│   └── README.md               # Mock modules documentation
├── assets.d.ts                 # TypeScript declarations for asset imports
└── setupTests.ts               # Jest setup and global test configuration
```

## Test Configuration Files

### setupTests.ts

**Purpose**: Global test setup and configuration for Jest.

**Contains**:
- Jest DOM extensions import
- Global test utilities
- Mock configurations
- Test environment setup

**Key Imports**:
```typescript
import '@testing-library/jest-dom';
```

This provides custom Jest matchers like:
- `toBeInTheDocument()`
- `toHaveClass()`
- `toHaveStyle()`
- `toBeVisible()`
- And many more...

### assets.d.ts

**Purpose**: TypeScript type declarations for static asset imports in tests.

**Declares**:
- Image file types (.png, .jpg, .svg, etc.)
- Asset module types
- Ensures TypeScript doesn't error on asset imports

**Example**:
```typescript
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}
```

## Subdirectories

### __mocks__/

Contains mock implementations for non-JavaScript modules.

See: [__mocks__/README.md](./__mocks__/README.md)

**Contents**:
- File mocks for static assets
- Module mocks for external dependencies
- Test data mocks

## Jest Configuration

The main Jest configuration is in `/jest.config.js` at the project root.

### Key Configuration

```javascript
// jest.config.js
export default {
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/test/__mocks__/fileMock.js',
    '@/(.*)': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
};
```

## Test Utilities

### Common Test Patterns

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('should handle user interaction', () => {
    render(<Component />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Result')).toBeVisible();
  });
});
```

### Test File Locations

Test files are colocated with their source files:

```
src/components/
├── MyComponent.tsx
└── MyComponent.test.tsx

src/services/
├── MyService.ts
└── MyService.test.ts
```

## Testing Libraries

### React Testing Library

Primary testing library for React components:
- Component rendering
- User interaction simulation
- Accessibility-focused queries
- DOM assertions

**Version**: 16.3.0

### Jest

Test framework and assertion library:
- Test runner
- Assertion matchers
- Mocking utilities
- Coverage reporting

**Version**: 30.1.3

### jest-dom

Custom matchers for DOM assertions:
- `toBeInTheDocument()`
- `toHaveClass()`
- `toBeVisible()`
- And more...

### ts-jest

TypeScript support for Jest:
- TypeScript compilation in tests
- Type checking during tests
- Source map support

**Version**: 29.4.4

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- MyComponent.test

# Run tests with coverage
npm test -- --coverage

# Run tests for changed files
npm test -- --onlyChanged
```

### Test Coverage

Coverage reports are generated in `/coverage/` directory:
- HTML report: `coverage/lcov-report/index.html`
- Summary in console
- Excluded: `node_modules/`, `dist/`, test files

## Test Environment

### jsdom

Tests run in jsdom environment:
- Simulates browser DOM
- Supports most browser APIs
- Fast execution
- No real browser needed

### Global Setup

`setupTests.ts` runs before each test file:
- Imports jest-dom matchers
- Sets up global mocks
- Configures test environment

## Writing Tests

### Test File Naming

Follow the pattern:
- Component tests: `ComponentName.test.tsx`
- Service tests: `ServiceName.test.ts`
- Hook tests: `useHookName.test.ts`

### Test Structure

Use descriptive test names:

```typescript
// ✅ Good: Clear what is being tested and expected
test('MyComponent_shouldDisplayError_whenValidationFails', () => {
  // Test implementation
});

// ❌ Avoid: Vague test names
test('test error', () => {
  // Test implementation
});
```

### Test Organization

```typescript
describe('ComponentName', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {});
    it('should render with custom props', () => {});
  });
  
  describe('User Interaction', () => {
    it('should handle click events', () => {});
    it('should handle input changes', () => {});
  });
  
  describe('Validation', () => {
    it('should show errors when invalid', () => {});
    it('should clear errors when valid', () => {});
  });
});
```

## Mocking

### Mock Functions

```typescript
const mockFn = jest.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue('async value');
```

### Mock Modules

```typescript
jest.mock('@/services/myService', () => ({
  myFunction: jest.fn().mockReturnValue('mocked'),
}));
```

### Mock Components

```typescript
jest.mock('@/components/MyComponent', () => ({
  MyComponent: () => <div>Mocked Component</div>,
}));
```

## Best Practices

### Accessibility-First Queries

```typescript
// ✅ Prefer accessible queries
screen.getByRole('button', { name: 'Submit' });
screen.getByLabelText('Email Address');
screen.getByText('Expected Text');

// ❌ Avoid test-specific attributes
screen.getByTestId('submit-button');
```

### User-Centric Testing

```typescript
// ✅ Test from user perspective
fireEvent.click(screen.getByRole('button'));
fireEvent.change(screen.getByLabelText('Email'), { 
  target: { value: 'test@example.com' } 
});

// ❌ Avoid implementation details
wrapper.instance().handleSubmit();
```

### Async Testing

```typescript
// ✅ Wait for async operations
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});

// Use findBy queries for async elements
const element = await screen.findByText('Loaded Data');
```

## Debugging Tests

### Debug Output

```typescript
import { screen, render } from '@testing-library/react';

render(<Component />);
screen.debug(); // Prints current DOM
screen.debug(element); // Prints specific element
```

### Verbose Mode

```bash
npm test -- --verbose
```

### Inspect Failed Tests

```bash
npm test -- --no-coverage --verbose
```

## Related Files

- [`/jest.config.js`](../../jest.config.js) - Main Jest configuration
- [`/src/setupTests.ts`](../setupTests.ts) - Additional setup (if exists)
- Component test files - Colocated with components
- Service test files - Colocated with services

## Related Documentation

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [jest-dom matchers](https://github.com/testing-library/jest-dom)

## Future Enhancements

Potential improvements:
- E2E tests with Playwright
- Visual regression testing
- Performance testing
- Accessibility testing automation
- Integration test helpers
- Custom test utilities
- Shared test fixtures

## Notes

- All tests use TypeScript
- Tests are colocated with source files
- Use accessible queries when possible
- Mock external dependencies
- Focus on user behavior, not implementation
- Keep tests simple and readable
- Aim for high coverage but focus on critical paths
- Run tests before committing code
