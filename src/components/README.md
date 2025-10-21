# components

React components organized by functionality and purpose.

## Purpose

This directory contains all React components for the BuyOrRent application, organized into logical subdirectories by their purpose (common utilities, inputs, outputs, navigation, themes, situations).

## Files Structure

```
src/components/
├── common/
│   ├── FlexibleInputField.test.tsx
│   ├── FlexibleInputField.tsx
│   ├── README.md
│   ├── Years.test.tsx
│   ├── Years.tsx
│   └── index.ts
├── inputs/
│   ├── buy/
│   │   ├── [24 buy-related input files]
│   │   └── README.md
│   ├── invest/
│   │   ├── InvestmentReturn.test.tsx
│   │   ├── InvestmentReturn.tsx
│   │   ├── InvestmentReturnHelperDrawer.tsx
│   │   └── README.md
│   ├── rent/
│   │   ├── MonthlyRent.test.tsx
│   │   ├── MonthlyRent.tsx
│   │   ├── README.md
│   │   ├── RentIncrease.test.tsx
│   │   └── RentIncrease.tsx
│   ├── PercentageAmountSwitch.test.tsx
│   ├── PercentageAmountSwitch.tsx
│   └── README.md
├── navbar/
│   ├── Avatar.tsx
│   ├── FlexibleNavbar.test.tsx
│   ├── FlexibleNavbar.tsx
│   ├── LoginButton.tsx
│   ├── Logo.tsx
│   ├── README.md
│   ├── SignUpButton.tsx
│   ├── dependencies.ts
│   ├── index.ts
│   └── types.ts
├── outputs/
│   ├── rent/
│   │   ├── [7 rent output files]
│   │   └── README.md
│   └── README.md
├── situations/
│   ├── 1/
│   │   ├── inputs/
│   │   │   └── [12 input files + README.md]
│   │   ├── outputs/
│   │   │   └── [5 output files + README.md]
│   │   ├── README.md
│   │   └── index.ts
│   ├── README.md
│   ├── Situation1.tsx
│   └── index.ts
├── theme/
│   ├── README.md
│   ├── ThemeShowcase.tsx
│   ├── ThemeToggle.tsx
│   └── index.ts
├── ui/
│   └── [28 shadcn/ui components]
└── README.md
```

## Component Categories

### Common Components

**Location**: [`common/`](./common/README.md)

**Purpose**: Shared, reusable components used across the application.

**Key Components**:
- `FlexibleInputField` - Generic input with multiple display modes
- `Years` - Specialized year/duration input

**Usage**: Foundation for all input field components

---

### Input Components

**Location**: [`inputs/`](./inputs/README.md)

**Purpose**: User input fields organized by category (rent, buy, invest).

**Subdirectories**:
- [`inputs/buy/`](./inputs/buy/README.md) - Purchase-related inputs (13 components)
- [`inputs/rent/`](./inputs/rent/README.md) - Rent-related inputs (2 components)
- [`inputs/invest/`](./inputs/invest/README.md) - Investment-related inputs (2 components)

**Total Components**: 17+ input field components

**Features**:
- Validation support
- Currency/percentage formatting
- Amount/percentage pairing
- Touch-based error display
- Multiple display modes

---

### Navbar Components

**Location**: [`navbar/`](./navbar/README.md)

**Purpose**: Navigation and header components.

**Key Components**:
- `FlexibleNavbar` - Main navigation component
- `Logo` - Brand logo display
- `LoginButton` / `SignUpButton` - Auth buttons
- `Avatar` - User profile display

**Features**:
- Responsive mobile menu
- Theme toggle integration
- Authentication state handling
- Flexible configuration

---

### Output Components

**Location**: [`outputs/`](./outputs/README.md)

**Purpose**: Display calculation results and analysis.

**Subdirectories**:
- [`outputs/rent/`](./outputs/rent/README.md) - Rent projections (tables & graphs)

**Components**:
- `MonthlyRentTable` / `CompactMonthlyRentTable`
- `MonthlyRentGraph` / `CompactMonthlyRentGraph`

**Features**:
- Data visualization with Recharts
- Table displays
- Responsive layouts
- Theme-aware styling

---

### Situation Components

**Location**: [`situations/`](./situations/README.md)

**Purpose**: Complete flows for specific user situations.

**Current Situations**:
- [`situations/1/`](./situations/1/README.md) - Currently renting, considering buying

**Structure**:
- [`situations/1/inputs/`](./situations/1/inputs/README.md) - Question pages
- [`situations/1/outputs/`](./situations/1/outputs/README.md) - Analysis/results

**Situation 1 Flow**:
```
RentQuestions → PurchaseQuestions → InvestmentQuestions → Results
```

---

### Theme Components

**Location**: [`theme/`](./theme/README.md)

**Purpose**: Theme management and display components.

**Key Components**:
- `ThemeToggle` - Toggle between light/dark/system themes
- `ThemeShowcase` - Theme demonstration page (dev)

**Features**:
- Light/dark/system modes
- Theme persistence
- CSS variable integration

---

### UI Components (Excluded)

**Location**: `ui/` - **EXCLUDED FROM DOCUMENTATION**

**Purpose**: shadcn/ui base components (auto-generated).

**Note**: This directory is excluded from README audits as it contains third-party components managed by shadcn/ui.

## Component Architecture

### Hierarchy

```
Common Components (foundation)
  ↓
Specific Input/Output Components
  ↓
Page Components (situations)
  ↓
Route Pages
```

### Composition Pattern

Components follow composition over inheritance:

```typescript
// Common component provides base functionality
<FlexibleInputField {...baseProps} />

// Specific component wraps with domain logic
<PurchasePrice> uses <FlexibleInputField>

// Page component composes multiple fields
<PurchaseQuestions> uses multiple <PurchasePrice>, <DownPayment>, etc.
```

### Shared Patterns

All components follow consistent patterns:
- TypeScript with full typing
- Props interface definitions
- Theme-aware styling (Tailwind)
- Responsive design (mobile-first)
- Accessibility features (ARIA, keyboard nav)
- Colocated tests

## Component Guidelines

### File Naming

- Component files: `ComponentName.tsx`
- Test files: `ComponentName.test.tsx`
- Index exports: `index.ts`
- README docs: `README.md`

### Component Structure

```typescript
import React from 'react';

export interface ComponentNameProps {
  // Props with JSDoc comments
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  // Props destructuring
}) => {
  // Component logic
  
  return (
    <div className="component-container">
      {/* JSX */}
    </div>
  );
};
```

### Testing

Every component should have:
- Rendering tests
- Interaction tests
- Validation tests (if applicable)
- Accessibility tests
- Edge case tests

### Styling

Components use:
- Tailwind CSS utilities
- Theme-aware classes (`bg-background`, `text-foreground`)
- Responsive modifiers (`sm:`, `md:`, `lg:`)
- shadcn/ui components where appropriate

## Integration Points

Components integrate with:
- **ConfigProvider** - Global configuration
- **ThemeContext** - Theme state
- **ValidationService** - Field validation
- **FormattingService** - Data formatting
- **React Router** - Navigation

## Related Directories

- [`src/pages/`](../pages/README.md) - Top-level page components
- [`src/contexts/`](../contexts/README.md) - React contexts
- [`src/services/`](../services/README.md) - Business logic services
- [`src/common/`](../common/README.md) - Utility functions

## Development Guidelines

### Adding New Components

1. **Choose location**:
   - Common utilities → `common/`
   - Input fields → `inputs/[category]/`
   - Output displays → `outputs/[category]/`
   - Navigation → `navbar/`
   - Theme-related → `theme/`

2. **Create component file**:
   - Use TypeScript
   - Define Props interface
   - Implement component
   - Export from index.ts

3. **Add tests**:
   - Create `.test.tsx` file
   - Test all functionality
   - Aim for high coverage

4. **Update documentation**:
   - Add to relevant README
   - Document props and usage
   - Include examples

5. **Follow patterns**:
   - Use existing components as reference
   - Follow naming conventions
   - Apply consistent styling
   - Ensure accessibility

### Modifying Existing Components

1. **Understand impact**:
   - Check where component is used
   - Review tests
   - Consider breaking changes

2. **Update tests**:
   - Modify existing tests
   - Add tests for new functionality

3. **Update documentation**:
   - Update prop descriptions
   - Add new examples
   - Note breaking changes

4. **Test thoroughly**:
   - Run all tests
   - Manual testing in UI
   - Check multiple scenarios

## Performance Considerations

- Use `React.memo` for expensive components
- Lazy load situation-specific components
- Optimize re-renders with proper dependencies
- Keep component trees shallow

## Accessibility

All components must:
- Use semantic HTML
- Provide ARIA labels
- Support keyboard navigation
- Maintain focus management
- Ensure sufficient contrast
- Support screen readers

## Mobile Optimization

Components should be:
- Mobile-first responsive
- Touch-friendly (44x44px min targets)
- Optimized for small screens
- Performance-conscious

## Future Enhancements

Potential additions:
- User profile components
- Settings components
- Dashboard widgets
- Chart library expansion
- Animation components
- More situation types

## Notes

- All components are TypeScript
- Tests are colocated with components
- shadcn/ui provides base UI components
- Theme system is integrated throughout
- Mobile-first responsive design
- Accessibility is a priority
- Follow established patterns
- Keep components focused and composable
