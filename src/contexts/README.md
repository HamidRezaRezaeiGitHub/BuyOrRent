# contexts

React contexts for global state management (theme, routing, providers).

## Purpose

This directory contains React context providers that manage global application state, including theme management, routing configuration, and aggregated provider patterns.

## Files Structure

```
src/contexts/
├── AppProviders.tsx
├── AppRouter.tsx
├── RouterProvider.tsx
├── ThemeContext.tsx
├── ThemeContext.README.md
├── ThemeContext.test.tsx
└── index.ts
```

## Context Providers

### ThemeContext

**Purpose**: Manages application-wide theme state (light/dark/system modes).

**Features**:
- Light/dark/system theme modes
- Theme persistence to localStorage
- System preference detection
- Reactive theme updates

**API**:
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// Usage in components
const { theme, setTheme } = useTheme();
```

**Documentation**: See [`ThemeContext.README.md`](ThemeContext.README.md)

**Test Coverage**: Comprehensive tests in `ThemeContext.test.tsx`

### RouterProvider

**Purpose**: Provides routing configuration and context to the application.

**Features**:
- React Router DOM integration
- Route configuration management
- Navigation helpers
- Route state management

**Usage**:
```typescript
<RouterProvider>
  <AppRouter />
</RouterProvider>
```

### AppProviders

**Purpose**: Aggregates all context providers in a single component.

**Features**:
- Clean provider composition
- Single wrapper for app tree
- Proper provider ordering
- Easy to extend with new providers

**Structure**:
```typescript
export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider>
      <RouterProvider>
        {/* Additional providers here */}
        {children}
      </RouterProvider>
    </ThemeProvider>
  );
};
```

**Usage in App**:
```typescript
ReactDOM.createRoot(rootElement).render(
  <AppProviders>
    <App />
  </AppProviders>
);
```

### AppRouter

**Purpose**: Defines application routing structure and routes.

**Routes Configured**:
```
/ → LandingPage
/questionnaire → QuestionnairePage
/situation/1/question/rent → RentQuestions
/situation/1/question/purchase → PurchaseQuestions
/situation/1/question/investment → InvestmentQuestions
/situation/1/panel → Situation1 (Results)
/situation/1 → Situation1 (Results)
/temp/theme → ThemeShowcase (Dev)
* → Redirect to /
```

**Features**:
- React Router v7 integration
- Route definitions
- Navigation flow
- Redirect handling
- 404 fallback

## Architecture Patterns

### Provider Pattern

All contexts follow React Provider pattern:
- Context creation with `createContext`
- Provider component wrapping
- Custom hooks for consumption
- Type-safe context values

### Aggregation Pattern

AppProviders aggregates multiple providers:
- Single import point
- Clean component tree
- Proper nesting order
- Easy maintenance

### Separation of Concerns

- **ThemeContext**: Theme state only
- **RouterProvider**: Routing only
- **AppProviders**: Composition only
- **AppRouter**: Route definitions only

## Theme System

### Theme Modes

1. **Light**: Bright interface for well-lit environments
2. **Dark**: Dark interface for reduced eye strain
3. **System**: Follows OS preference automatically

### Theme Persistence

Theme preference is saved to `localStorage`:
- Key: `'theme'`
- Values: `'light'` | `'dark'` | `'system'`
- Restored on app load

### CSS Variables

Theme changes update CSS custom properties:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

## Routing Structure

### Route Hierarchy

```
/
├── /questionnaire
└── /situation/1/
    ├── question/
    │   ├── rent
    │   ├── purchase
    │   └── investment
    └── panel (results)
```

### Navigation Flow

**Situation 1 Flow**:
```
LandingPage → RentQuestions → PurchaseQuestions → InvestmentQuestions → Results
```

### Route Parameters

Routes can include:
- Situation ID (e.g., `/situation/1`)
- Question type (e.g., `/question/rent`)
- Dynamic segments (future)

## Testing

### ThemeContext Tests

- Theme initialization
- Theme switching
- localStorage persistence
- System preference detection
- Re-renders on theme change

### Provider Tests

- Provider wrapping
- Context value accessibility
- Proper nesting
- Error boundaries

## Usage Examples

### Using Theme Context

```typescript
import { useTheme } from '@/contexts';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme (Current: {theme})
    </button>
  );
};
```

### Using Router Context

```typescript
import { useNavigate } from 'react-router-dom';

const NavigationButton = () => {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate('/situation/1/question/rent')}>
      Start Questionnaire
    </button>
  );
};
```

### Setting Up Providers

```typescript
// In main.tsx
import { AppProviders } from '@/contexts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
```

## Integration Points

These contexts are used by:
- **All Components**: Access theme state
- **Navigation**: Route components
- **Theme Toggle**: Theme switching UI
- **Layout Components**: Theme-aware styling

## Related Components

- [`src/components/theme/`](../components/theme/README.md) - Theme toggle components
- [`src/pages/`](../pages/README.md) - Route page components
- [`src/common/`](../common/README.md) - Configuration and state utilities

## File Details

### index.ts

Exports all contexts and hooks:
```typescript
export { AppProviders } from './AppProviders';
export { AppRouter } from './AppRouter';
export { ThemeProvider, useTheme } from './ThemeContext';
```

### ThemeContext.README.md

Detailed documentation for theme system. See that file for comprehensive theme documentation.

## Performance Considerations

- Theme changes trigger minimal re-renders
- localStorage operations are async
- Context values are memoized
- Provider nesting is optimized

## Accessibility

- Theme changes maintain contrast ratios
- Focus states work in all themes
- High contrast mode support
- Keyboard navigation preserved

## Future Enhancements

Potential additions:
- User authentication context
- Configuration context
- Modal/dialog context
- Notification/toast context
- Data fetching context
- Analytics context

## Notes

- All contexts are TypeScript with full type safety
- Providers are composable and extensible
- Theme persistence uses localStorage
- Router uses React Router v7
- AppProviders should wrap entire app
- Context values are stable (memoized)
- Test coverage ensures reliability
- System theme preference respects OS settings
