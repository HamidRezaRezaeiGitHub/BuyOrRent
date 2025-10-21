# services/formatting

Formatting service for consistent data presentation throughout the application.

## Purpose

This directory contains the `FormattingService` which provides centralized formatting utilities for currency, numbers, percentages, and other data types with Canadian localization.

## Files Structure

```
src/services/formatting/
├── FormattingService.test.ts
├── FormattingService.ts
├── README.md
└── index.ts
```

## FormattingService

Singleton service providing consistent formatting across the application.

### Key Features

- **Currency Formatting**: Canadian dollars (CAD) with proper symbols and separators
- **Percentage Formatting**: Configurable decimal places
- **Number Formatting**: Thousand separators and decimal handling
- **Locale Support**: Canadian English (en-CA) by default
- **Type Safety**: Full TypeScript support

### Main Methods

#### Currency Formatting

```typescript
FormattingService.formatCurrency(amount: number, options?: FormatOptions): string
```

**Examples**:
```typescript
formatCurrency(1500.50)        // "$1,500.50"
formatCurrency(1000000)         // "$1,000,000.00"
formatCurrency(99.9)            // "$99.90"
```

**Options**:
- `minimumFractionDigits`: Minimum decimal places (default: 2)
- `maximumFractionDigits`: Maximum decimal places (default: 2)
- `useGrouping`: Show thousand separators (default: true)

#### Percentage Formatting

```typescript
FormattingService.formatPercentage(value: number, decimals?: number): string
```

**Examples**:
```typescript
formatPercentage(2.5)           // "2.50%"
formatPercentage(10)            // "10.00%"
formatPercentage(3.456, 3)      // "3.456%"
```

#### Number Formatting

```typescript
FormattingService.formatNumber(value: number, options?: FormatOptions): string
```

**Examples**:
```typescript
formatNumber(1234.56)           // "1,234.56"
formatNumber(1000000)           // "1,000,000"
```

### Parsing Methods

#### Parse Currency

```typescript
FormattingService.parseCurrency(formattedValue: string): number
```

Removes currency symbols, thousand separators, and parses to number.

**Examples**:
```typescript
parseCurrency("$1,500.50")      // 1500.50
parseCurrency("$1,000,000")     // 1000000
parseCurrency("1500")           // 1500
```

#### Parse Percentage

```typescript
FormattingService.parsePercentage(formattedValue: string): number
```

Removes percentage symbol and parses to number.

**Examples**:
```typescript
parsePercentage("2.50%")        // 2.50
parsePercentage("10%")          // 10
parsePercentage("3.456")        // 3.456
```

## Usage

Import the service:

```typescript
import { FormattingService } from '@/services/formatting';
```

### In Components

```typescript
const MonthlyRentDisplay = ({ rent }: { rent: number }) => {
  const formattedRent = FormattingService.formatCurrency(rent);
  
  return <div>Monthly Rent: {formattedRent}</div>;
};
```

### In Input Fields

```typescript
const CurrencyInput = ({ value, onChange }) => {
  const [displayValue, setDisplayValue] = useState(
    FormattingService.formatCurrency(value)
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = FormattingService.parseCurrency(e.target.value);
    onChange(rawValue);
    setDisplayValue(FormattingService.formatCurrency(rawValue));
  };
  
  return <input value={displayValue} onChange={handleChange} />;
};
```

### In Calculations

```typescript
const calculateTotalRent = (monthlyRent: number, years: number) => {
  const totalRent = monthlyRent * 12 * years;
  return FormattingService.formatCurrency(totalRent);
};
```

## Testing

Comprehensive test suite covers:
- Currency formatting with various amounts
- Percentage formatting with different decimal places
- Number formatting with grouping options
- Currency parsing with various formats
- Percentage parsing with and without symbols
- Edge cases (zero, negative, very large numbers)
- Locale-specific behavior

## Configuration

### Default Locale

The service uses Canadian English (`en-CA`) locale by default, which provides:
- Dollar sign: `$`
- Decimal separator: `.`
- Thousand separator: `,`
- Currency code: `CAD`

### Customization

To customize formatting options, pass options to formatting methods:

```typescript
// Custom decimal places
FormattingService.formatCurrency(1500, { 
  minimumFractionDigits: 0,
  maximumFractionDigits: 0 
}); // "$1,500"

// Disable grouping
FormattingService.formatNumber(1000000, { 
  useGrouping: false 
}); // "1000000"
```

## Integration Points

The FormattingService is used throughout:
- **Input Components**: Currency and percentage fields
- **Output Components**: Tables and graphs
- **Calculation Services**: Result formatting
- **Display Components**: Summary panels

## Performance Considerations

- Singleton pattern ensures single instance
- Methods are stateless and can be called frequently
- Uses native `Intl.NumberFormat` for efficient formatting
- Parsing operations are optimized for common formats

## Canadian Context

All formatting follows Canadian conventions:
- Currency symbol: Canadian Dollar (`$`)
- Locale: en-CA
- Decimal separator: period (`.`)
- Thousand separator: comma (`,`)
- Date format: YYYY-MM-DD (when applicable)

## Related Services

- See [`../validation/`](../validation/README.md) - Field validation service
- See [`../MonthlyRentCalculator.ts`](../MonthlyRentCalculator.ts) - Rent calculations
- See [`../MortgageAmortizationCalculator.ts`](../MortgageAmortizationCalculator.ts) - Mortgage calculations

## Future Enhancements

Potential improvements:
- Multi-locale support (French Canadian, etc.)
- Date/time formatting utilities
- Compact number formatting (1K, 1M notation)
- Custom currency symbols
- Negative number formatting options
- Localized error messages

## Notes

- All monetary values assume CAD
- Percentage values are stored as numeric (2.5 = 2.5%, not 0.025)
- Parsing is forgiving and handles various input formats
- Formatting is consistent across all components
- Test coverage ensures reliability
- Service is stateless and thread-safe
