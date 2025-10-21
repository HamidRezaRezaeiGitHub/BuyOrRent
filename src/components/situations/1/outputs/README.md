# components/situations/1/outputs

Output/results components for Situation 1 analysis.

## Purpose

This directory contains the output components that display analysis results after the user completes all input questions for Situation 1.

## Files Structure

```
src/components/situations/1/outputs/
├── BuyAnalysis.tsx
├── ComparisonAnalysis.tsx
├── RentAnalysis.tsx
└── index.ts
```

## Output Components

### RentAnalysis

**Purpose**: Displays detailed rent scenario analysis and projections.

**Content**:
- Monthly rent projections over time
- Total rent paid calculations
- Rent increase impact visualization
- Year-by-year breakdown

**Features**:
- Tables showing rent projections
- Graphs visualizing rent growth
- Cumulative cost calculations
- Canadian currency formatting

**Used Data**:
- Monthly Rent (from RentQuestions)
- Rent Increase Rate (from RentQuestions)
- Analysis period (from configuration)

**Components Used**:
- `MonthlyRentTable`
- `MonthlyRentGraph`
- `CompactMonthlyRentTable`

### BuyAnalysis

**Purpose**: Displays detailed purchase scenario analysis.

**Content**:
- Mortgage payment breakdown
- Total ownership costs
- Equity accumulation
- Property value appreciation
- Maintenance and tax projections

**Features**:
- Amortization tables
- Equity vs debt visualization
- Cost breakdown charts
- Return on investment calculations

**Used Data**:
- Purchase Price
- Down Payment
- Mortgage Length & Rate
- Property Tax
- Maintenance Costs
- Closing Costs
- Asset Appreciation Rate

**Components Used**:
- Mortgage amortization charts
- Cost breakdown tables
- Equity accumulation graphs

### ComparisonAnalysis

**Purpose**: Side-by-side comparison of renting vs buying scenarios.

**Content**:
- Net worth comparison
- Cash flow comparison
- Total costs comparison
- Break-even analysis
- Decision guidance

**Features**:
- Comparative charts
- Key metrics comparison
- Scenario summaries
- Recommendation insights
- Interactive year selection

**Used Data**:
- All rent inputs
- All purchase inputs
- Investment return rate
- Analysis period

**Comparison Metrics**:
- Total costs (rent vs own)
- Net worth impact
- Monthly cash flow
- Opportunity cost
- Break-even timeline
- Wealth accumulation

## Component Structure

Each analysis component follows a pattern:

```typescript
export const AnalysisComponent = () => {
  const config = useConfig();
  const calculatedData = useCalculations(config);
  
  return (
    <div className="analysis-container">
      <AnalysisHeader />
      <KeyMetrics />
      <DetailedTables />
      <Visualizations />
      <Insights />
    </div>
  );
};
```

## Analysis Calculations

### Rent Scenario
```
Total Rent Cost = Σ(Monthly Rent × 12) for each year
  where Monthly Rent increases by Rent Increase Rate annually
```

### Buy Scenario
```
Total Ownership Cost = 
  + Down Payment
  + Closing Costs
  + Σ(Monthly Mortgage Payment × 12) for each year
  + Σ(Annual Property Tax) for each year
  + Σ(Annual Maintenance) for each year
  
Home Equity = 
  + Down Payment
  + Mortgage Principal Paid
  + Property Appreciation
```

### Investment Scenario (Rent + Invest)
```
Investment Portfolio Value =
  + Down Payment (invested instead)
  + Monthly Savings (rent vs mortgage difference, invested)
  Growing at Investment Return Rate annually
```

## Data Visualization

### Chart Types

**Line Charts**:
- Rent growth over time
- Property value appreciation
- Investment portfolio growth
- Net worth comparison

**Bar Charts**:
- Annual cost breakdown
- Rent vs own comparison
- Cash flow analysis

**Tables**:
- Detailed year-by-year data
- Amortization schedules
- Cost breakdowns

### Theme Integration

All visualizations use:
- Theme-aware colors
- Chart color palette (CSS variables)
- Responsive containers
- Dark/light mode support

## Testing

Test coverage includes:
- Rendering tests
- Calculation accuracy tests
- Data transformation tests
- Visualization tests
- Edge case handling

## Usage

These components are displayed in the results panel:

```typescript
<Route path="/situation/1/panel" element={
  <Situation1Results>
    <RentAnalysis />
    <BuyAnalysis />
    <ComparisonAnalysis />
  </Situation1Results>
} />
```

## Related Components

- See [`../inputs/`](../inputs/README.md) - Input question pages
- See [`../../../outputs/rent/`](../../../outputs/rent/README.md) - Reusable rent output components
- See [`../../../../services/`](../../../../services/README.md) - Calculation services
- See [`../../`](../../README.md) - Situations overview

## Services Used

- `MonthlyRentCalculator` - Rent projections
- `MortgageAmortizationCalculator` - Mortgage calculations
- `FormattingService` - Currency and number formatting

## Analysis Period

Default analysis period: 25 years (typical Canadian mortgage)

User can adjust via configuration.

## Key Metrics Displayed

### Rent Scenario
- Total Rent Paid
- Average Monthly Rent
- Final Monthly Rent

### Buy Scenario
- Total Ownership Cost
- Home Equity Built
- Property Value
- Total Interest Paid
- Net Gain/Loss

### Comparison
- Cost Difference
- Net Worth Difference
- Break-even Year
- Recommendation

## Decision Framework

Analysis helps users understand:
- **Financial Impact**: Total costs over time
- **Wealth Building**: Equity vs investment growth
- **Flexibility**: Ownership obligations vs renting freedom
- **Risk**: Market assumptions and uncertainties
- **Timeline**: Break-even analysis

## Mobile Optimization

- Responsive charts
- Collapsible sections
- Swipeable tabs
- Touch-friendly controls
- Simplified mobile views

## Accessibility

- Screen reader friendly tables
- Chart alt text and descriptions
- Keyboard navigation
- High contrast support
- Clear data labels

## Notes

- All calculations use Canadian context
- Currency displayed in CAD
- Analysis is educational, not financial advice
- Assumptions clearly stated
- Results update reactively with input changes
- Multiple view options (detailed/compact)
- Export/print functionality (future enhancement)
- Comparison emphasizes long-term perspective
- Conservative assumptions preferred
