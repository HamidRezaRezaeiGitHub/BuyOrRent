# components/outputs/mortgage

Mortgage-related output components for displaying amortization calculations and projections.

## Purpose

This directory contains components that display mortgage amortization calculations in both table and graph formats, showing the breakdown of principal and interest payments over time.

## Files Structure

```
src/components/outputs/mortgage/
├── MortgageAmortizationGraph.test.tsx
├── MortgageAmortizationGraph.tsx
├── MortgageAmortizationTable.test.tsx
├── MortgageAmortizationTable.tsx
└── README.md
```

## Output Components

### MortgageAmortizationTable

**Purpose**: Displays detailed mortgage amortization schedule in a tabular format.

**Features**:
- Year-by-year breakdown
- Payment, principal, and interest amounts
- Remaining balance tracking
- Cumulative totals for principal and interest
- Canadian currency formatting

**Columns**:
- Year
- Payment (annual total)
- Principal (annual total)
- Interest (annual total)
- Balance (end of year)
- Cumulative Principal
- Cumulative Interest

**Use Case**: Detailed analysis view showing complete amortization schedule over the loan term.

### MortgageAmortizationGraph

**Purpose**: Visual representation of mortgage amortization over time.

**Features**:
- Three-line chart showing:
  - Cumulative principal paid (chart-2 color)
  - Cumulative interest paid (chart-1 color)
  - Remaining balance (chart-3 color)
- Interactive tooltips
- Theme-aware colors
- Responsive design

**Chart Type**: Multi-line chart (using Recharts)

**Data Displayed**:
- Principal paid accumulation
- Interest paid accumulation
- Balance reduction over time

**Use Case**: Visual understanding of how mortgage payments are split between principal and interest, and how the balance decreases over time.

## Component Patterns

### Data Visualization

All components use:
- Consistent color schemes (`--chart-1`, `--chart-2`, `--chart-3`)
- Theme-aware styling
- Canadian currency formatting
- Responsive layouts
- Year-based aggregation (showing annual totals rather than monthly)

### Recharts Integration

Graph component leverages Recharts:
- `ResponsiveContainer` for responsive sizing
- `LineChart` for time series visualization
- `Tooltip` for interactive data display
- `XAxis`/`YAxis` for labeled axes
- Multiple lines for comparing principal, interest, and balance

## Testing

Comprehensive test coverage:
- Rendering tests (null/empty/valid data states)
- Data formatting tests (currency, commas, no decimals)
- Calculation accuracy tests (decreasing balance, increasing cumulatives)
- Responsive behavior tests
- Theme integration tests
- Edge cases (zero interest, small/large values, short/long amortization)

## Usage

These components are used in:
- Buy analysis section (Situation 1)
- Comparison views
- Mortgage analysis panels

Example:
```typescript
import { 
  MortgageAmortizationTable, 
  MortgageAmortizationGraph 
} from '@/components/outputs/mortgage';

const mortgageData = calculateMortgageAmortization(
  800000,  // purchase price
  20,      // down payment percentage
  5.0,     // annual interest rate
  25       // amortization years
);

<MortgageAmortizationTable data={mortgageData} />
<MortgageAmortizationGraph data={mortgageData} />
```

## Data Source

Components receive data from:
- `MortgageAmortizationCalculator` service
- User inputs (purchase price, down payment, interest rate, amortization period)
- Configuration defaults

See: [`src/services/MortgageAmortizationCalculator.ts`](../../../services/MortgageAmortizationCalculator.ts)

## Related Components

- See [`../../inputs/buy/`](../../inputs/buy/README.md) - Purchase input fields
- See [`../../../services/`](../../../services/README.md) - Calculation services
- See [`../../situations/1/outputs/`](../../situations/1/outputs/README.md) - Situation 1 analysis outputs
- See [`../rent/`](../rent/README.md) - Rent output components (similar pattern)

## Calculation Context

### Mortgage Amortization Formula

The components display data calculated using standard mortgage amortization formulas:

```
Monthly Payment = P × [r(1+r)^n] / [(1+r)^n - 1]

Where:
- P = Loan amount (purchase price - down payment)
- r = Monthly interest rate (annual rate / 12 / 100)
- n = Total months (years × 12)

Each month:
- Interest = Balance × Monthly Rate
- Principal = Payment - Interest
- New Balance = Balance - Principal
```

### Example Calculation

```
Purchase Price: $800,000
Down Payment: 20% ($160,000)
Loan Amount: $640,000
Interest Rate: 5.0% annually
Amortization: 25 years

Monthly Payment: ~$3,732
Total Interest Paid (25 years): ~$479,600
Total Principal Paid: $640,000
Total Paid: ~$1,119,600
```

## Styling

### Table Styling
- Clean, readable rows
- Aligned numeric columns (right-aligned)
- Header emphasis with font-semibold
- Responsive columns
- Horizontal scrolling on mobile

### Graph Styling
- Theme-aware colors using CSS variables
- Three distinct lines for principal, interest, and balance
- Smooth line curves
- Interactive tooltips with formatted values
- Axis labels and formatting
- Principal: `--chart-2` (typically green/blue)
- Interest: `--chart-1` (typically primary color)
- Balance: `--chart-3` (typically orange/amber)

## Accessibility

- Proper table semantics (`<thead>`, `<tbody>`, `<th>`, `<td>`)
- ARIA labels for graphs
- Screen reader friendly currency formatting
- Keyboard navigation support
- High contrast mode compatible
- Descriptive chart title and axis labels

## Notes

- All currency values displayed in CAD
- Data aggregated by year for clarity (monthly data available in service)
- Years run from 1 to amortization period
- Balance decreases over time (approaching zero at end)
- Principal paid increases each year (more principal, less interest over time)
- Charts use HSL color space from theme
- Mobile-first responsive design
- Test coverage ensures calculation accuracy
- Follows same pattern as rent outputs for consistency
