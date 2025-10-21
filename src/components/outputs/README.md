# components/outputs

Output components for displaying calculation results and analysis.

## Purpose

This directory contains components that display calculation results, projections, and analysis in various formats (tables, graphs, summaries).

## Files Structure

```
src/components/outputs/
├── rent/
│   ├── CompactMonthlyRentGraph.tsx
│   ├── CompactMonthlyRentTable.test.tsx
│   ├── CompactMonthlyRentTable.tsx
│   ├── MonthlyRentGraph.test.tsx
│   ├── MonthlyRentGraph.tsx
│   ├── MonthlyRentTable.test.tsx
│   ├── MonthlyRentTable.tsx
│   └── README.md
└── README.md
```

## Output Categories

### Rent Outputs

**Location**: [`rent/`](./rent/README.md)

**Components** (6):
- `MonthlyRentTable` - Detailed year-by-year rent projections
- `CompactMonthlyRentTable` - Condensed rent projections
- `MonthlyRentGraph` - Visual rent growth chart
- `CompactMonthlyRentGraph` - Condensed rent graph
- Additional table/graph variants

**Purpose**: Display rent projections and cumulative costs over time

**Features**:
- Year-by-year breakdown
- Compound rent increase calculations
- Cumulative totals
- Interactive charts
- Responsive layouts

### Future Output Categories

Planned additions:
- **Buy Outputs**: Mortgage amortization, equity accumulation
- **Investment Outputs**: Portfolio growth projections
- **Comparison Outputs**: Side-by-side rent vs buy analysis

## Output Component Patterns

### Full vs Compact Variants

Most outputs come in two sizes:

**Full Components**:
- Detailed data display
- All years shown
- Comprehensive information
- Desktop-optimized

**Compact Components**:
- Summary view
- Key years only (1, 5, 10, 15, 20, 25)
- Essential metrics
- Mobile-friendly

### Tables vs Graphs

Components offer multiple visualization options:

**Tables**:
- Precise numeric values
- Year-by-year detail
- Sortable columns
- Exportable data (future)

**Graphs**:
- Visual trends
- Pattern recognition
- Interactive tooltips
- Time series visualization

## Data Visualization

### Recharts Integration

Graph components use Recharts library:

```typescript
<ResponsiveContainer>
  <LineChart data={projectionData}>
    <XAxis dataKey="year" />
    <YAxis />
    <Tooltip />
    <Line dataKey="monthlyRent" stroke="var(--chart-1)" />
  </LineChart>
</ResponsiveContainer>
```

**Features**:
- Responsive sizing
- Theme-aware colors
- Interactive tooltips
- Smooth animations

### Theme Integration

All outputs use theme-aware colors:
- Chart colors: `--chart-1` through `--chart-5`
- Background: `--background`
- Text: `--foreground`
- Borders: `--border`

## Data Sources

Output components receive data from:

### Calculation Services

```typescript
// MonthlyRentCalculator
const projections = MonthlyRentCalculator.calculate({
  initialRent: 2000,
  rentIncrease: 2.5,
  years: 25
});

// Use in component
<MonthlyRentTable {...projections} />
```

### User Inputs

Data flows from user inputs:

```
User Input (RentQuestions)
  ↓
ConfigProvider.updateConfig()
  ↓
Calculation Service
  ↓
Output Component (render results)
```

## Component Structure

### Typical Output Component

```typescript
export interface OutputComponentProps {
  data: CalculationResult[];
  compact?: boolean;
  theme?: 'light' | 'dark';
}

export const OutputComponent: React.FC<OutputComponentProps> = ({
  data,
  compact = false
}) => {
  return (
    <div className="output-container">
      {compact ? <CompactView data={data} /> : <FullView data={data} />}
    </div>
  );
};
```

## Formatting

All outputs use `FormattingService`:

```typescript
// Currency formatting
FormattingService.formatCurrency(monthlyRent)  // "$2,563.00"

// Percentage formatting
FormattingService.formatPercentage(2.5)        // "2.50%"

// Number formatting
FormattingService.formatNumber(25)             // "25"
```

## Testing Strategy

Output components have tests for:
- **Rendering**: With various data sets
- **Calculations**: Accuracy verification
- **Formatting**: Currency, percentages, numbers
- **Responsiveness**: Different screen sizes
- **Theme**: Light and dark modes
- **Edge Cases**: Zero values, large numbers, negative numbers

## Usage in Application

### Results Pages

Outputs are displayed in situation results:

```typescript
// Situation 1 Results
<RentAnalysis>
  <MonthlyRentTable 
    initialRent={config.monthlyRent}
    rentIncrease={config.rentIncrease}
    years={25}
  />
  <MonthlyRentGraph 
    initialRent={config.monthlyRent}
    rentIncrease={config.rentIncrease}
    years={25}
  />
</RentAnalysis>
```

### Dashboard/Summary Views

Compact versions for overview:

```typescript
<Dashboard>
  <CompactMonthlyRentTable {...rentData} />
  <CompactBuyAnalysis {...buyData} />
  <CompactComparison {...comparisonData} />
</Dashboard>
```

## Related Components

- [`../situations/1/outputs/`](../situations/1/outputs/README.md) - Situation-specific output pages
- [`../inputs/`](../inputs/README.md) - Input components providing data

## Related Services

- [`../../services/MonthlyRentCalculator.ts`](../../services/MonthlyRentCalculator.ts) - Rent calculations
- [`../../services/MortgageAmortizationCalculator.ts`](../../services/MortgageAmortizationCalculator.ts) - Mortgage calculations
- [`../../services/formatting/`](../../services/formatting/README.md) - Data formatting

## Styling Guidelines

### Responsive Design

```typescript
// Mobile: Stack vertically, compact view
<div className="flex flex-col md:flex-row gap-4">
  <CompactTable />
  <CompactGraph />
</div>

// Desktop: Side-by-side, full view
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <MonthlyRentTable />
  <MonthlyRentGraph />
</div>
```

### Theme-Aware

```typescript
// Use theme CSS variables
<div className="bg-background text-foreground border-border">
  <table className="w-full">
    <thead className="bg-muted">
      {/* Table header */}
    </thead>
  </table>
</div>
```

## Accessibility

Output components ensure:
- **Tables**: Proper `<thead>`, `<tbody>`, `<th>`, `<td>` semantics
- **Graphs**: ARIA labels and descriptions
- **Data**: Screen reader accessible
- **Focus**: Keyboard navigation support
- **Contrast**: WCAG AA compliance

## Performance

Optimizations:
- Memoized calculations
- Lazy rendering for large datasets
- Virtual scrolling (for very long tables)
- Debounced updates
- Efficient re-render strategies

## Mobile Optimization

- Horizontal scrolling for wide tables
- Touch-friendly graph interactions
- Simplified layouts on small screens
- Collapsible sections
- Progressive disclosure

## Future Enhancements

Planned additions:
- **Export functionality**: PDF, CSV, Excel
- **Print styling**: Optimized print layouts
- **Annotations**: User notes on data
- **Comparisons**: Side-by-side scenarios
- **Sharing**: Shareable result links
- **More visualizations**: Pie charts, bar charts, area charts
- **Interactive filtering**: Year range selection
- **Custom calculations**: User-defined formulas

## Development Guidelines

### Adding New Output Components

1. **Identify category**: Rent, buy, investment, comparison
2. **Create component**: Full and compact versions
3. **Integrate calculations**: Use appropriate service
4. **Apply formatting**: Use FormattingService
5. **Add visualizations**: Tables and/or graphs
6. **Ensure accessibility**: ARIA, semantics
7. **Test thoroughly**: Data accuracy, rendering, responsiveness
8. **Update documentation**: Add to category README

### Creating Paired Components

For full/compact pairs:

1. Extract common logic
2. Use props to control display mode
3. Maintain consistent data structure
4. Test both variants
5. Document differences

## Chart Configuration

### Color Palette

Use theme chart colors:

```typescript
const CHART_COLORS = {
  rent: 'hsl(var(--chart-1))',
  mortgage: 'hsl(var(--chart-2))',
  investment: 'hsl(var(--chart-3))',
  equity: 'hsl(var(--chart-4))',
  total: 'hsl(var(--chart-5))',
};
```

### Responsive Charts

```typescript
<ResponsiveContainer width="100%" height={400}>
  <LineChart data={data}>
    {/* Chart content */}
  </LineChart>
</ResponsiveContainer>
```

## Notes

- Currently: Rent outputs only
- Future: Buy, investment, comparison outputs
- All use Canadian currency (CAD)
- Theme-aware throughout
- Responsive and mobile-friendly
- Accessibility is a priority
- Performance optimized
- Full and compact variants
- Tables and graphs available
- Comprehensive test coverage
