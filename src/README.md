# src

Main source directory containing all application code.

## Purpose

This is the root source directory for the BuyOrRent application. It contains all TypeScript/TSX code, components, services, styles, configuration, and tests.

## Files Structure

```
src/
├── assets/
│   └── README.md               # Static assets (brand logos)
├── common/
│   └── README.md               # Common utilities (config, step tracking)
├── components/
│   └── README.md               # React components (organized by purpose)
├── config/
│   └── README.md               # Configuration files and manifests
├── contexts/
│   └── README.md               # React contexts (theme, routing, providers)
├── pages/
│   └── README.md               # Top-level page components
├── services/
│   └── README.md               # Business logic services
├── test/
│   └── README.md               # Test utilities and setup
├── utils/
│   └── README.md               # Utility functions (cn, etc.)
├── App.tsx                     # Root application component
├── index.css                   # Global styles, Tailwind imports, CSS variables
├── jest-dom.d.ts               # Jest DOM type declarations
├── main.tsx                    # React application entry point
├── setupTests.ts               # Jest test setup
└── vite-env.d.ts               # Vite environment type declarations
```

## Directory Overview

### assets/
Static assets including brand logos and images.
- **Brand assets**: Logo variations (light/dark, PNG/SVG)
- **Future**: Icons, illustrations, images

See: [assets/README.md](./assets/README.md)

---

### common/
Common utilities and shared functionality.
- **ConfigProvider**: Configuration management
- **globalStep**: Step tracking
- **progress**: Progress state management
- **useConfig**: React hook for configuration

See: [common/README.md](./common/README.md)

---

### components/
All React components organized by purpose.

**Subdirectories**:
- [`common/`](./components/common/README.md) - Reusable field components
- [`inputs/`](./components/inputs/README.md) - Input fields (buy, rent, invest)
- [`navbar/`](./components/navbar/README.md) - Navigation components
- [`outputs/`](./components/outputs/README.md) - Result display components
- [`situations/`](./components/situations/README.md) - Complete user journeys
- [`theme/`](./components/theme/README.md) - Theme toggle and showcase
- `ui/` - shadcn/ui base components (excluded from docs)

See: [components/README.md](./components/README.md)

---

### config/
Configuration files and journey manifests.
- **config-canada.ts**: Canadian market defaults
- **journey/**: Situation-specific manifests

See: [config/README.md](./config/README.md)

---

### contexts/
React context providers for global state.
- **ThemeContext**: Theme management (light/dark/system)
- **AppProviders**: Aggregated providers
- **AppRouter**: Route definitions
- **RouterProvider**: Routing configuration

See: [contexts/README.md](./contexts/README.md)

---

### pages/
Top-level page components for routes.
- **LandingPage**: Home page
- **QuestionnairePage**: Questionnaire container
- **MainAppPage**: App layout wrapper

See: [pages/README.md](./pages/README.md)

---

### services/
Business logic services and calculations.

**Services**:
- [`formatting/`](./services/formatting/README.md) - Data formatting (currency, percentage)
- [`validation/`](./services/validation/README.md) - Field validation and rules
- **MonthlyRentCalculator**: Rent projections
- **MortgageAmortizationCalculator**: Mortgage calculations

See: [services/README.md](./services/README.md)

---

### test/
Test utilities, setup, and mocks.
- **setupTests.ts**: Jest configuration
- **__mocks__/**: Mock modules
- **assets.d.ts**: Asset type declarations

See: [test/README.md](./test/README.md)

---

### utils/
Utility functions used throughout the app.
- **utils.ts**: Contains `cn()` function for className merging

See: [utils/README.md](./utils/README.md)

---

## Root Files

### App.tsx

**Purpose**: Root application component.

**Responsibilities**:
- Renders main application structure
- Integrates with AppRouter
- Top-level component composition

**Usage**: Wrapped by AppProviders in main.tsx

---

### main.tsx

**Purpose**: React application entry point.

**Responsibilities**:
- Creates React root
- Wraps App with AppProviders
- Renders to DOM
- Development mode setup

**Code**:
```typescript
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
```

---

### index.css

**Purpose**: Global styles and Tailwind CSS configuration.

**Contains**:
- Tailwind directives (`@tailwind base/components/utilities`)
- CSS custom properties (theme variables)
- Global styles
- Theme-specific variables (`:root` and `.dark`)
- Chart color palette

**Theme Variables**:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  /* ... */
}
```

---

### setupTests.ts

**Purpose**: Additional Jest setup (if needed beyond test/setupTests.ts).

**Note**: Main test setup is in `test/setupTests.ts`.

---

### vite-env.d.ts

**Purpose**: Vite environment type declarations.

**Contains**:
- Vite client types
- Environment variable types
- Import.meta types

**Code**:
```typescript
/// <reference types="vite/client" />
```

---

### jest-dom.d.ts

**Purpose**: Jest DOM custom matcher type declarations.

**Ensures**: TypeScript recognizes jest-dom matchers like `toBeInTheDocument()`.

---

## Technology Stack

### Core

- **React**: 19.1.1
- **TypeScript**: 5.8.3
- **Vite**: 7.1.7

### Styling

- **Tailwind CSS**: 4.1.13
- **shadcn/ui**: UI component library
- **CSS Variables**: Theme system

### Routing

- **React Router**: 7.9.1

### Forms & Validation

- **Custom validation**: ValidationService
- **React Hook Form**: (if added)
- **Zod**: (if added)

### Data Visualization

- **Recharts**: Chart library

### Testing

- **Jest**: 30.1.3
- **React Testing Library**: 16.3.0
- **ts-jest**: 29.4.4

## Code Organization

### Import Paths

Using path aliases configured in `tsconfig.app.json`:

```typescript
import { Component } from '@/components/Component';
import { service } from '@/services/service';
import { config } from '@/config/config-canada';
```

**Alias**: `@/*` → `./src/*`

### Component Collocation

Components and related files are colocated:

```
ComponentName.tsx       # Component implementation
ComponentName.test.tsx  # Component tests
ComponentName.css       # Component styles (if needed)
README.md               # Component documentation
```

### Barrel Exports

Using `index.ts` for clean imports:

```typescript
// components/common/index.ts
export { FlexibleInputField } from './FlexibleInputField';
export { Years } from './Years';

// Import usage
import { FlexibleInputField, Years } from '@/components/common';
```

## Build Process

### Development

```bash
npm run dev
```

- Starts Vite dev server
- Hot module replacement
- Fast refresh
- Port: 5173

### Production Build

```bash
npm run build
```

- TypeScript type checking
- Vite bundling and optimization
- Output: `dist/` directory
- Time: ~3-6 seconds

### Preview

```bash
npm run preview
```

- Serves production build locally
- Port: 4173
- Tests production build

## Code Quality

### Linting

```bash
npm run lint
```

- ESLint with TypeScript support
- React hooks plugin
- React refresh plugin

### Testing

```bash
npm test
```

- Jest test runner
- React Testing Library
- Coverage reporting

### Type Checking

```bash
npx tsc --noEmit
```

- TypeScript type checking
- No output files
- Validates types only

## Development Workflow

1. **Start dev server**: `npm run dev`
2. **Make changes**: Edit files in `src/`
3. **Test changes**: View in browser (auto-refresh)
4. **Run tests**: `npm test`
5. **Lint code**: `npm run lint`
6. **Build**: `npm run build`
7. **Commit**: Git commit with meaningful message

## Project Conventions

### Naming

- **Components**: PascalCase (`MyComponent.tsx`)
- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

### Styling

- Use Tailwind utilities
- Theme-aware classes (`bg-background`, `text-foreground`)
- Mobile-first responsive design
- Consistent spacing scale

### TypeScript

- Strict mode enabled
- Explicit types preferred
- Interface for props
- Type for data structures

### Testing

- Colocated test files
- Descriptive test names: `ComponentName_shouldBehavior_whenCondition`
- Arrange-Act-Assert pattern
- Test user behavior, not implementation

## Canadian Context

The application is built for the Canadian market:

- **Currency**: CAD ($)
- **Locale**: en-CA
- **Mortgage**: 25-year amortization standard
- **Regulations**: CMHC, provincial rent control
- **Market Data**: Canadian real estate context
- **Tax**: Canadian tax considerations

## Accessibility

All code should ensure:
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Focus management
- Sufficient contrast
- Screen reader support

## Performance

Optimizations applied:
- Code splitting
- Lazy loading
- Memoization
- Efficient re-renders
- Optimized assets
- Tree shaking

## Security

Security considerations:
- No sensitive data in client
- Input validation
- Output sanitization
- Secure dependencies
- Regular updates

## Future Structure

Potential additions:

```
src/
├── hooks/              # Custom React hooks
├── types/              # Shared TypeScript types
├── constants/          # App-wide constants
├── api/                # API integration
├── store/              # State management (if needed)
└── layouts/            # Layout components
```

## Notes

- All code is TypeScript
- Mobile-first design
- Canadian context throughout
- Theme support required
- Accessibility is priority
- Performance optimized
- Well tested
- Thoroughly documented
