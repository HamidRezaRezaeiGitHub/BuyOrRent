# components/common

Common reusable field components used across the application.

## Purpose

This directory contains shared, reusable input components and utilities that are used throughout the application, providing consistent field behavior and display patterns.

## Files Structure

```
src/components/common/
├── FlexibleInputField.tsx
├── FlexibleInputField.test.tsx
├── Years.tsx
├── Years.test.tsx
└── index.ts
```

## Components

### FlexibleInputField

**Purpose**: Generic input field component with flexible display modes and validation.

**Features**:
- Multiple display modes: input, slider, combined
- Built-in validation support
- Currency and percentage formatting
- Touch-based error display
- Required/optional modes
- Label and tooltip support
- Mobile-responsive

**Display Modes**:
1. **Input**: Text input field only
2. **Slider**: Slider control only
3. **Combined**: Both input and slider side-by-side

**Props Interface**:
```typescript
interface FlexibleInputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  displayMode?: 'input' | 'slider' | 'combined';
  fieldType?: 'currency' | 'percentage' | 'number';
  min?: number;
  max?: number;
  step?: number;
  enableValidation?: boolean;
  validationMode?: 'required' | 'optional';
  tooltip?: string;
  disabled?: boolean;
  className?: string;
}
```

**Usage Example**:
```typescript
import { FlexibleInputField } from '@/components/common';

<FlexibleInputField
  label="Purchase Price"
  value={purchasePrice}
  onChange={setPurchasePrice}
  displayMode="combined"
  fieldType="currency"
  min={50000}
  max={10000000}
  enableValidation={true}
  validationMode="required"
  tooltip="The total purchase price of the property"
/>
```

**Key Features**:
- Automatic formatting based on field type
- Synchronized input and slider values
- Progressive error display
- Accessibility support (ARIA labels)

**Test Coverage**: Comprehensive tests in `FlexibleInputField.test.tsx`

### Years

**Purpose**: Specialized input component for year/duration inputs.

**Features**:
- Year-specific validation
- Range validation (typically 1-50 years)
- Slider and input modes
- Canadian mortgage context (default: 25 years)
- Clear labeling (e.g., "25 years")

**Props Interface**:
```typescript
interface YearsProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  displayMode?: 'input' | 'slider' | 'combined';
  enableValidation?: boolean;
  validationMode?: 'required' | 'optional';
  tooltip?: string;
  disabled?: boolean;
}
```

**Usage Example**:
```typescript
import { Years } from '@/components/common';

<Years
  label="Mortgage Length"
  value={mortgageLength}
  onChange={setMortgageLength}
  min={5}
  max={30}
  displayMode="combined"
  enableValidation={true}
  validationMode="required"
  tooltip="The amortization period of your mortgage (typically 25 years in Canada)"
/>
```

**Default Values**:
- Min: 1 year
- Max: 50 years
- Default: 25 years (Canadian mortgage standard)

**Test Coverage**: Comprehensive tests in `Years.test.tsx`

## Common Patterns

### Display Mode Flexibility

All components support three display modes:

```typescript
// Input only - Simple text field
<Component displayMode="input" />

// Slider only - Visual range selector
<Component displayMode="slider" />

// Combined - Both input and slider
<Component displayMode="combined" />
```

### Validation Integration

Components integrate with validation service:

```typescript
<Component
  enableValidation={true}
  validationMode="required"  // or "optional"
/>
```

**Validation Modes**:
- **Required**: Field must have a valid value
- **Optional**: Field can be empty, but if filled must be valid

### Formatting Support

Components automatically format values:

```typescript
// Currency formatting
<FlexibleInputField fieldType="currency" value={150000} />
// Displays: "$150,000.00"

// Percentage formatting
<FlexibleInputField fieldType="percentage" value={2.5} />
// Displays: "2.50%"

// Number formatting
<FlexibleInputField fieldType="number" value={25} />
// Displays: "25"
```

## Architectural Benefits

### Reusability

Common components eliminate duplication:
- Single implementation
- Consistent behavior
- Easier maintenance
- Bug fixes propagate automatically

### Consistency

All fields share:
- Same visual design
- Identical interaction patterns
- Uniform validation UX
- Consistent accessibility features

### Testability

Centralized testing:
- Test once, use everywhere
- High confidence in behavior
- Easier to maintain tests
- Better coverage

## Component Composition

These common components are used by specific field components:

```
FlexibleInputField
  ↓ Used by
PurchasePrice, DownPaymentAmount, MonthlyRent, etc.

Years
  ↓ Used by
MortgageLength component
```

## Integration with Specific Fields

Specific field components wrap common components:

```typescript
// Specific field component
export const PurchasePrice = (props) => {
  return (
    <FlexibleInputField
      {...props}
      label="Purchase Price"
      fieldType="currency"
      min={50000}
      max={10000000}
      // ... specific configuration
    />
  );
};
```

## Styling

All components use:
- Tailwind CSS utilities
- Theme-aware colors
- Responsive design
- Consistent spacing
- shadcn/ui components (Input, Slider, Label)

## Accessibility

Components ensure:
- Proper label associations
- ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader support
- Error announcements

## Mobile Optimization

- Large touch targets
- Responsive layouts
- Touch-friendly sliders
- Clear visual feedback
- Readable font sizes

## Testing Strategy

Each component has comprehensive tests:
- Rendering tests
- Interaction tests
- Validation tests
- Display mode tests
- Accessibility tests
- Edge cases

## Usage Patterns

### Basic Usage

```typescript
import { FlexibleInputField } from '@/components/common';

const MyComponent = () => {
  const [value, setValue] = useState(0);
  
  return (
    <FlexibleInputField
      label="My Field"
      value={value}
      onChange={setValue}
    />
  );
};
```

### With Validation

```typescript
<FlexibleInputField
  label="Required Field"
  value={value}
  onChange={setValue}
  enableValidation={true}
  validationMode="required"
  min={0}
  max={100}
/>
```

### With Tooltip

```typescript
<FlexibleInputField
  label="Complex Field"
  value={value}
  onChange={setValue}
  tooltip="This is a detailed explanation of what this field represents"
/>
```

## Related Components

- [`../inputs/buy/`](../inputs/buy/README.md) - Purchase-specific fields using common components
- [`../inputs/rent/`](../inputs/rent/README.md) - Rent-specific fields using common components
- [`../inputs/invest/`](../inputs/invest/README.md) - Investment-specific fields
- [`../ui/`](../ui/) - shadcn/ui base components

## Related Services

- [`../../services/validation/`](../../services/validation/README.md) - Validation logic
- [`../../services/formatting/`](../../services/formatting/README.md) - Formatting utilities

## Future Enhancements

Potential improvements:
- Additional field types (date, time, etc.)
- More display modes
- Enhanced accessibility features
- Animation support
- Advanced validation patterns
- Custom formatter support

## Notes

- Common components are the foundation for all input fields
- Changes here affect many field components
- Maintain backward compatibility
- Keep components generic and configurable
- Comprehensive testing is critical
- Focus on reusability and consistency
- Follow accessibility best practices
- Support all theme modes
