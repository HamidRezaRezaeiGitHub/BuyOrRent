# test

Test utilities and type declarations for the Vitest testing environment.

## Purpose

This directory contains test-related utilities and type declarations used across the test suite.

## Files Structure

```
src/test/
├── assets.d.ts     # Type declarations for static asset imports
└── README.md       # This file
```

## Files

### assets.d.ts

Provides TypeScript type declarations for static asset imports (images, SVGs, etc.). This ensures TypeScript understands how to handle these imports in test files.

**Supported extensions:** `.svg`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`

## Test Configuration

The main test configuration is in:
- `vite.config.ts` - Vitest configuration (test environment, coverage, etc.)
- `src/setupTests.ts` - Global test setup (runs before all tests)

## Testing Stack

### Vitest

Test framework and assertion library:
- Fast test execution
- Jest-compatible API
- Native ESM support
- TypeScript support

**Version**: 3.0.6+

### React Testing Library

Primary testing library for React components:
- Component rendering
- User interaction simulation
- Accessibility-focused queries
- DOM assertions

**Version**: 16.3.0

### jest-dom

Custom matchers for DOM assertions:
- `toBeInTheDocument()`
- `toHaveClass()`
- `toBeVisible()`
- And more...

**Version**: 6.8.0

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run coverage

# Run specific test file
npm test -- MyComponent.test

# Run tests matching pattern
npm test -- --grep "should render"
```

### Test Coverage

Coverage reports are generated using V8 provider:
- HTML report: `coverage/index.html`
- Summary in console
- Excluded: test files, type definitions, entry files

## Test File Locations

Test files are colocated with their source files:

```
src/components/
├── MyComponent.tsx
└── MyComponent.test.tsx

src/services/
├── MyService.ts
└── MyService.test.ts
```

## Test Environment

### jsdom

Tests run in jsdom environment:
- Simulates browser DOM
- Supports most browser APIs
- Fast execution
- No real browser needed

### Global Setup

`src/setupTests.ts` runs before all tests:
- Imports jest-dom matchers
- Sets up global mocks (ResizeObserver, TextEncoder/TextDecoder)
- Configures test environment

## Writing Tests

### Test File Naming

Follow the pattern:
- Component tests: `ComponentName.test.tsx`
- Service tests: `ServiceName.test.ts`
- Hook tests: `useHookName.test.ts`

### Required Imports

Each test file must include:

```typescript
import '@testing-library/jest-dom';
```

This import is required for custom matchers to work properly.

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
const mockFn = vi.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue('async value');
```

### Mock Modules

```typescript
vi.mock('@/services/myService', () => ({
  myFunction: vi.fn().mockReturnValue('mocked'),
}));
```

### Partial Mocks with importActual

```typescript
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
```

### Mock Components

```typescript
vi.mock('@/components/MyComponent', () => ({
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
npm test -- --reporter=verbose
```

## Related Files

- [`/vite.config.ts`](../../vite.config.ts) - Vitest configuration
- [`/src/setupTests.ts`](../setupTests.ts) - Global test setup
- Component test files - Colocated with components
- Service test files - Colocated with services

## Related Documentation

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [jest-dom matchers](https://github.com/testing-library/jest-dom)
- [Vitest Migration from Jest](https://vitest.dev/guide/migration)

## Notes

- All tests use TypeScript
- Tests are colocated with source files
- Use accessible queries when possible
- Mock external dependencies
- Focus on user behavior, not implementation
- Keep tests simple and readable
- Aim for high coverage but focus on critical paths
- Run tests before committing code
- Each test file must import '@testing-library/jest-dom'

