# services

Business logic services and calculation engines.

## Purpose

This directory contains business logic services that perform calculations, data transformations, and provide core functionality for the application.

## Files Structure

```
src/services/
├── formatting/
│   └── README.md                       # Currency and data formatting
├── validation/
│   └── README.md                       # Field validation and rules
├── MonthlyRentCalculator.ts
├── MonthlyRentCalculator.test.ts
├── MortgageAmortizationCalculator.ts
└── MortgageAmortizationCalculator.test.ts
```

## Service Categories

### Formatting Services

**Location**: [`formatting/`](./formatting/README.md)

**Purpose**: Consistent data formatting across the application.

**Main Service**: `FormattingService`

**Features**:
- Currency formatting (CAD)
- Percentage formatting
- Number formatting
- Parsing utilities

**Usage**:
```typescript
FormattingService.formatCurrency(150000)    // "$150,000.00"
FormattingService.formatPercentage(2.5)     // "2.50%"
```

---

### Validation Services

**Location**: [`validation/`](./validation/README.md)

**Purpose**: Field validation with built-in and custom rules.

**Main Service**: `ValidationService`

**Main Hook**: `useSmartFieldValidation`

**Features**:
- Centralized validation rules
- Field-level validation
- Autofill detection
- Touch-based error display
- Type-safe validation

**Usage**:
```typescript
const result = ValidationService.validateField('email', value, config);

// Or use smart hook
const { state, handlers } = useSmartFieldValidation({
  value,
  config: { fieldName: 'email', fieldType: 'email' }
});
```

---

### Calculation Services

Direct service files in this directory.

#### MonthlyRentCalculator

**Purpose**: Calculate rent projections over time with compound increases.

**Key Functions**:
```typescript
MonthlyRentCalculator.calculate({
  initialRent: number,
  rentIncrease: number,  // Annual percentage
  years: number
}): RentProjection[]
```

**Returns**:
```typescript
interface RentProjection {
  year: number;
  monthlyRent: number;
  annualRent: number;
  cumulativeRent: number;
  rentIncrease: number;
}
```

**Calculation**:
```typescript
Month Rent (Year N) = Initial Rent × (1 + Increase Rate)^(N-1)
Annual Rent = Monthly Rent × 12
Cumulative = Sum of all annual rents up to Year N
```

**Test Coverage**: `MonthlyRentCalculator.test.ts`

---

#### MortgageAmortizationCalculator

**Purpose**: Calculate mortgage payments, amortization schedules, and equity accumulation.

**Key Functions**:
```typescript
MortgageAmortizationCalculator.calculate({
  principal: number,
  annualRate: number,      // Percentage
  amortizationYears: number,
  paymentFrequency: 'monthly' | 'biweekly' | 'weekly'
}): AmortizationSchedule
```

**Returns**:
```typescript
interface AmortizationSchedule {
  payments: PaymentDetail[];
  summary: {
    totalPaid: number;
    totalInterest: number;
    totalPrincipal: number;
    monthlyPayment: number;
  };
}

interface PaymentDetail {
  paymentNumber: number;
  year: number;
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}
```

**Calculations**:
```typescript
// Monthly payment
M = P × [r(1+r)^n] / [(1+r)^n - 1]
  where:
  M = Monthly payment
  P = Principal
  r = Monthly interest rate (annual rate / 12)
  n = Total number of payments (years × 12)

// For each payment
Interest = Remaining Balance × Monthly Rate
Principal = Payment - Interest
New Balance = Remaining Balance - Principal
```

**Test Coverage**: `MortgageAmortizationCalculator.test.ts`

## Service Architecture

### Singleton Pattern

Most services use singleton pattern:
```typescript
class FormattingService {
  private static instance: FormattingService;
  
  private constructor() {}
  
  public static getInstance(): FormattingService {
    if (!FormattingService.instance) {
      FormattingService.instance = new FormattingService();
    }
    return FormattingService.instance;
  }
  
  // Service methods...
}
```

### Pure Functions

Calculation services use pure functions:
- No side effects
- Deterministic results
- Stateless
- Easily testable

### TypeScript

All services are fully typed:
- Interface definitions
- Type parameters
- Return type specifications
- Strict null checks

## Service Integration

### Component Usage

```typescript
import { MonthlyRentCalculator } from '@/services';

const RentAnalysis = ({ initialRent, rentIncrease, years }) => {
  const projections = MonthlyRentCalculator.calculate({
    initialRent,
    rentIncrease,
    years
  });
  
  return <RentTable data={projections} />;
};
```

### Chained Services

Services can be composed:

```typescript
// Calculate rent
const rentProjections = MonthlyRentCalculator.calculate(...);

// Format for display
const formatted = rentProjections.map(p => ({
  ...p,
  monthlyRent: FormattingService.formatCurrency(p.monthlyRent),
  cumulativeRent: FormattingService.formatCurrency(p.cumulativeRent)
}));
```

## Testing Strategy

### Unit Tests

Each service has comprehensive unit tests:
- Basic calculations
- Edge cases
- Error handling
- Boundary conditions
- Invalid inputs

### Test Patterns

```typescript
describe('MonthlyRentCalculator', () => {
  describe('calculate', () => {
    it('should calculate correct monthly rent for year 1', () => {
      const result = MonthlyRentCalculator.calculate({
        initialRent: 2000,
        rentIncrease: 2.5,
        years: 1
      });
      
      expect(result[0].monthlyRent).toBe(2000);
      expect(result[0].annualRent).toBe(24000);
    });
    
    it('should apply compound increase correctly', () => {
      const result = MonthlyRentCalculator.calculate({
        initialRent: 2000,
        rentIncrease: 2.5,
        years: 2
      });
      
      expect(result[1].monthlyRent).toBeCloseTo(2050, 2);
    });
  });
});
```

## Canadian Context

Services reflect Canadian context:

### Currency

All calculations in CAD:
- Formatting uses Canadian locale
- Currency symbol: $
- Thousand separator: ,
- Decimal separator: .

### Mortgage Standards

- Default amortization: 25 years
- CMHC insurance considerations
- Typical mortgage rates
- Payment frequency options

### Market Assumptions

- Rent increase rates (provincial)
- Property appreciation
- Investment returns
- Cost percentages

## Performance

Services are optimized:

### Memoization

Expensive calculations can be memoized:

```typescript
const memoizedCalculation = useMemo(() => 
  MonthlyRentCalculator.calculate(params),
  [params]
);
```

### Lazy Calculation

Calculate only when needed:
- On-demand calculation
- No pre-calculation
- Efficient memory usage

### Efficient Algorithms

- O(n) time complexity for most calculations
- Minimal object creation
- Optimized loops

## Error Handling

Services include robust error handling:

```typescript
if (initialRent <= 0) {
  throw new Error('Initial rent must be positive');
}

if (years < 1 || years > 50) {
  throw new Error('Years must be between 1 and 50');
}
```

## Related Components

- [`src/components/outputs/`](../components/outputs/README.md) - Display calculation results
- [`src/components/inputs/`](../components/inputs/README.md) - Collect calculation inputs
- [`src/common/ConfigProvider.ts`](../common/ConfigProvider.ts) - Manage input state

## Development Guidelines

### Adding New Services

1. **Create service file**: `NewService.ts`
2. **Define interfaces**: Input and output types
3. **Implement logic**: Pure functions or singleton class
4. **Add tests**: `NewService.test.ts`
5. **Document**: JSDoc comments
6. **Export**: Add to `index.ts` (if exists)
7. **Update README**: Document in this file

### Service Design Principles

- **Single Responsibility**: One service, one purpose
- **Pure Functions**: No side effects when possible
- **Type Safety**: Full TypeScript typing
- **Testability**: Easy to test in isolation
- **Documentation**: Clear JSDoc comments
- **Error Handling**: Validate inputs, throw meaningful errors

## Future Enhancements

Potential additions:

### New Services

- `InvestmentCalculator` - Portfolio growth calculations
- `ComparisonCalculator` - Rent vs buy comparisons
- `TaxCalculator` - Canadian tax implications
- `AffordabilityCalculator` - Qualification calculations
- `BreakEvenCalculator` - Break-even point analysis
- `SensitivityAnalyzer` - What-if scenarios

### Enhancements

- Caching layer for repeated calculations
- Worker threads for heavy calculations
- Progressive calculation (streaming results)
- Calculation history/undo
- Export calculations (PDF, CSV)

## Documentation

### JSDoc Comments

All services should have JSDoc:

```typescript
/**
 * Calculates monthly rent projections over time.
 * 
 * @param options - Calculation parameters
 * @param options.initialRent - Starting monthly rent in CAD
 * @param options.rentIncrease - Annual increase rate as percentage (e.g., 2.5 for 2.5%)
 * @param options.years - Number of years to project (1-50)
 * @returns Array of rent projections, one per year
 * @throws Error if parameters are invalid
 * 
 * @example
 * const projections = MonthlyRentCalculator.calculate({
 *   initialRent: 2000,
 *   rentIncrease: 2.5,
 *   years: 25
 * });
 */
```

## Notes

- All services are TypeScript
- Comprehensive test coverage
- Canadian market context
- Pure functional approach preferred
- Singleton pattern for stateful services
- Performance optimized
- Error handling included
- Well documented
- Easily extensible
