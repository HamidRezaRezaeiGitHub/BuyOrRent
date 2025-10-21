# components/outputs/rent

Rent-related output components for displaying calculations and projections.

## Purpose

This directory contains components that display rent calculations, projections, and analysis results in both table and graph formats.

## Files Structure

```
src/components/outputs/rent/
├── CompactMonthlyRentGraph.tsx
├── CompactMonthlyRentTable.test.tsx
├── CompactMonthlyRentTable.tsx
├── MonthlyRentGraph.test.tsx
├── MonthlyRentGraph.tsx
├── MonthlyRentTable.test.tsx
├── MonthlyRentTable.tsx
└── README.md
```

## Output Components

### MonthlyRentTable

**Purpose**: Displays detailed monthly rent projections in a tabular format.

**Features**:
- Year-by-year breakdown
- Monthly rent amounts
- Annual increases
- Cumulative totals
- Canadian currency formatting

**Columns**:
- Year
- Monthly Rent
- Annual Rent
- Rent Increase
- Cumulative Rent Paid

**Use Case**: Detailed analysis view showing complete rent projection over time.

### CompactMonthlyRentTable

**Purpose**: Condensed version of rent projections table.

**Features**:
- Key years only (e.g., 1, 5, 10, 15, 20, 25)
- Essential data columns
- Smaller footprint
- Mobile-friendly

**Use Case**: Summary view or space-constrained displays.

### MonthlyRentGraph

**Purpose**: Visual representation of rent projections over time.

**Features**:
- Line chart showing rent growth
- Time series data
- Interactive tooltips
- Theme-aware colors
- Responsive design

**Chart Type**: Line chart (using Recharts)

**Data Displayed**:
- Monthly rent over years
- Trend visualization
- Compound growth curve

**Use Case**: Visual understanding of rent escalation over time.

### CompactMonthlyRentGraph

**Purpose**: Condensed version of rent projections graph.

**Features**:
- Smaller size
- Essential data points
- Simplified axes
- Mobile-optimized

**Use Case**: Dashboard widgets or mobile views.

## Component Patterns

### Compact vs Full Versions

**Full Components**:
- Detailed data display
- All data points
- Larger footprint
- Desktop-optimized

**Compact Components**:
- Summary data only
- Key milestones
- Smaller size
- Mobile-friendly

### Data Visualization

All components use:
- Consistent color schemes
- Theme-aware styling
- Canadian currency formatting
- Responsive layouts

### Recharts Integration

Graph components leverage Recharts:
- `ResponsiveContainer` for responsive sizing
- `LineChart` for time series
- `Tooltip` for interactive data
- `XAxis`/`YAxis` for labeled axes

## Testing

Comprehensive test coverage:
- Rendering tests
- Data formatting tests
- Calculation accuracy tests
- Responsive behavior tests
- Theme integration tests

## Usage

These components are used in:
- Results panels (Situation 1)
- Rent analysis section
- Comparison views

Example:
```typescript
import { 
  MonthlyRentTable, 
  MonthlyRentGraph,
  CompactMonthlyRentTable 
} from '@/components/outputs/rent';

<MonthlyRentTable
  initialRent={2000}
  rentIncrease={2.5}
  years={25}
/>

<MonthlyRentGraph
  initialRent={2000}
  rentIncrease={2.5}
  years={25}
/>
```

## Data Source

Components receive data from:
- `MonthlyRentCalculator` service
- User inputs (monthly rent, rent increase)
- Configuration defaults

See: [`src/services/MonthlyRentCalculator.ts`](../../../services/MonthlyRentCalculator.ts)

## Related Components

- See [`../../inputs/rent/`](../../inputs/rent/README.md) - Rent input fields
- See [`../../../services/`](../../../services/README.md) - Calculation services
- See [`../../situations/1/outputs/`](../../situations/1/outputs/README.md) - Situation 1 analysis outputs

## Calculation Context

### Rent Projection Formula

```
Monthly Rent (Year N) = Initial Rent × (1 + Rent Increase Rate)^(N-1)
Annual Rent (Year N) = Monthly Rent (Year N) × 12
Cumulative Rent = Sum of all annual rents up to Year N
```

### Example Calculation

```
Initial Monthly Rent: $2,000
Annual Rent Increase: 2.5%

Year 1:  $2,000/month → $24,000/year
Year 5:  $2,207/month → $26,484/year
Year 10: $2,563/month → $30,756/year
Year 25: $3,704/month → $44,448/year

Total Paid (25 years): ~$787,000
```

## Styling

### Table Styling
- Clean, readable rows
- Alternating row colors
- Header emphasis
- Responsive columns
- Mobile stacking

### Graph Styling
- Theme-aware colors
- Chart color palette (CSS variables)
- Smooth line curves
- Interactive tooltips
- Axis labels and formatting

## Accessibility

- Proper table semantics (`<thead>`, `<tbody>`)
- ARIA labels for graphs
- Screen reader friendly
- Keyboard navigation support
- High contrast mode compatible

## Notes

- All currency values displayed in CAD
- Rent increase compounded annually
- Years typically range from 5-30
- Compact versions ideal for dashboards
- Full versions provide complete detail
- Charts use HSL color space from theme
- Mobile-first responsive design
- Test coverage ensures calculation accuracy
