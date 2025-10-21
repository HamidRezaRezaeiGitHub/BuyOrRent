# components/situations/1

Situation 1: Currently renting, considering buying.

## Purpose

Complete implementation of the "Currently Renting, Considering Buying" user journey, including input questionnaire, calculations, and results analysis.

## Files Structure

```
src/components/situations/1/
├── inputs/
│   └── README.md               # Question pages (rent, purchase, investment)
├── outputs/
│   └── README.md               # Analysis components (rent, buy, comparison)
└── README.md                   # This file
```

## Overview

Situation 1 helps users compare the financial implications of continuing to rent versus purchasing a home.

### User Profile

**Target User**: Currently renting, considering purchasing

**Questions Answered**:
- Should I continue renting or buy a home?
- What are the financial implications over time?
- How does investing savings compare to building home equity?
- When would buying become financially better than renting?

## Journey Flow

### Complete Flow

```
Landing Page
  ↓
/situation/1/question/rent (Step 1/3)
  ↓ Collect: Monthly Rent, Rent Increase
/situation/1/question/purchase (Step 2/3)
  ↓ Collect: Purchase Price, Down Payment, Mortgage Details, Costs
/situation/1/question/investment (Step 3/3)
  ↓ Collect: Investment Return Rate
/situation/1/panel (Results)
  ↓ Display: Analysis, Comparison, Recommendations
```

### Input Steps

#### Step 1: Rent Questions
**Route**: `/situation/1/question/rent`

**Inputs**:
- Monthly Rent (required) - Current all-in monthly rent
- Rent Increase (optional) - Expected annual increase (~2.5%)

**Duration**: ~30 seconds

#### Step 2: Purchase Questions
**Route**: `/situation/1/question/purchase`

**Inputs**:
- Purchase Price (required)
- Down Payment (amount or percentage)
- Mortgage Length (default: 25 years)
- Mortgage Rate (current market rate)
- Property Tax (amount or percentage)
- Maintenance Costs (amount or percentage)
- Closing Costs (amount or percentage)
- Asset Appreciation Rate (~2-3%)

**Duration**: ~2-3 minutes

#### Step 3: Investment Questions
**Route**: `/situation/1/question/investment`

**Inputs**:
- Investment Return Rate (with educational helper)

**Duration**: ~1 minute (with helper reading)

### Output Sections

#### Rent Analysis
- Monthly rent projections over time
- Total rent paid calculations
- Compound increase impact
- Tables and graphs

#### Buy Analysis
- Mortgage payment breakdown
- Total ownership costs
- Equity accumulation
- Property value appreciation
- Cost breakdown

#### Comparison Analysis
- Side-by-side comparison
- Net worth comparison
- Break-even analysis
- Key metrics
- Decision insights

## Data Collection

### Configuration State

All inputs stored in ConfigProvider:

```typescript
interface Situation1Config {
  // Rent
  monthlyRent: number;
  rentIncrease: number;
  
  // Purchase
  purchasePrice: number;
  downPaymentAmount: number;
  downPaymentPercentage: number;
  mortgageLength: number;
  mortgageRate: number;
  propertyTaxAmount: number;
  propertyTaxPercentage: number;
  maintenanceAmount: number;
  maintenancePercentage: number;
  closingCostsAmount: number;
  closingCostsPercentage: number;
  assetAppreciationRate: number;
  
  // Investment
  investmentReturn: number;
  
  // Analysis
  analysisYears: number;
}
```

## Calculations

### Rent Scenario

```typescript
// Monthly rent with compound increases
Year N Rent = Initial Rent × (1 + Increase Rate)^(N-1)

// Total rent over time
Total Rent = Σ(Monthly Rent × 12) for each year
```

### Buy Scenario

```typescript
// Monthly mortgage payment
Payment = P × [r(1+r)^n] / [(1+r)^n - 1]
  where P = Principal, r = Monthly Rate, n = # of Payments

// Total ownership cost
Total Cost = Down Payment + Closing Costs
           + Σ(Mortgage Payments)
           + Σ(Property Tax)
           + Σ(Maintenance)

// Home equity
Equity = Down Payment 
       + Principal Paid
       + Property Appreciation
```

### Investment Scenario (Rent + Invest)

```typescript
// Investment portfolio value
Portfolio = Down Payment (invested)
          + Σ(Monthly Savings × 12) growing at Investment Return Rate

// Monthly savings = Mortgage Payment - Rent
```

### Comparison Metrics

```typescript
// Net worth difference
Net Worth (Buy) = Home Equity - Remaining Mortgage
Net Worth (Rent) = Investment Portfolio

// Break-even year
Year where Net Worth (Buy) > Net Worth (Rent)
```

## Results Display

### Container Component

Located at: Parent directory (`Situation1.tsx`)

```typescript
export const Situation1 = () => {
  const config = useConfig();
  
  return (
    <div className="situation-1-results">
      <header>
        <h1>Rent vs Buy Analysis</h1>
        <p>Based on your inputs</p>
      </header>
      
      <Tabs>
        <TabPanel title="Rent Scenario">
          <RentAnalysis config={config} />
        </TabPanel>
        
        <TabPanel title="Buy Scenario">
          <BuyAnalysis config={config} />
        </TabPanel>
        
        <TabPanel title="Comparison">
          <ComparisonAnalysis config={config} />
        </TabPanel>
      </Tabs>
    </div>
  );
};
```

## Key Assumptions

### Canadian Context

- **Currency**: All values in CAD
- **Mortgage**: 25-year amortization default
- **Rent Control**: ~2.5% increase (varies by province)
- **Property Tax**: ~1% of property value
- **Maintenance**: ~1% of property value
- **Closing Costs**: ~1.5-4% of purchase price

### Conservative Defaults

- Rent increase: 2.5% annually
- Asset appreciation: 2-3% annually
- Investment return: 5-7% annually
- Mortgage rate: Current market rate

## User Education

### Information Panels

Each question page includes educational content:
- What the input means
- Why it matters
- How to determine the value
- Examples and context
- Canadian-specific information

### Helper Components

- `InvestmentReturnHelperDrawer` - Explains investment returns
- Tooltips on all inputs
- Information icons with expandable details

### Disclaimers

- Not financial advice
- For educational purposes
- Assumptions are estimates
- Consult with professionals

## Related Components

### Inputs
See: [`inputs/README.md`](./inputs/README.md)
- `RentQuestions.tsx`
- `PurchaseQuestions.tsx`
- `InvestmentQuestions.tsx`

### Outputs
See: [`outputs/README.md`](./outputs/README.md)
- `RentAnalysis.tsx`
- `BuyAnalysis.tsx`
- `ComparisonAnalysis.tsx`

## Configuration

### Manifest File

Located at: [`src/config/journey/situation1.manifest.json`](../../../config/journey/situation1.manifest.json)

Defines:
- Step structure
- Field configurations
- Default values
- Validation rules
- Navigation flow

## Testing

### Test Coverage

- Question page interactions
- Input validation
- Calculation accuracy
- Output displays
- Navigation flow
- Edge cases
- Error handling

### Test Files

- `RentQuestions.test.tsx`
- `PurchaseQuestions.test.tsx`
- `InvestmentQuestions.test.tsx`
- Individual input component tests
- Output component tests

## Routing

Routes defined in `AppRouter.tsx`:

```typescript
// Input routes
/situation/1/question/rent
/situation/1/question/purchase
/situation/1/question/investment

// Results routes
/situation/1/panel
/situation/1
```

## Navigation

### Previous/Next URLs

Each question page specifies:
- `previousUrl`: Where back button goes
- `nextUrl`: Where next button goes
- Validation: Next disabled until required fields valid

### Progress Tracking

- Step indicator: "Step X of 3"
- Progress bar
- Completion status
- Can return to edit inputs

## Accessibility

- Progressive disclosure
- Clear step indicators
- Focus management on navigation
- Screen reader announcements
- Keyboard navigation
- High contrast support

## Mobile Optimization

- Single-column layouts
- Touch-friendly inputs
- Sticky navigation
- Collapsible information panels
- Optimized for smaller screens

## Performance

- Lazy load output components
- Memoize calculations
- Efficient re-renders
- Optimistic UI updates

## Future Enhancements

- Save/resume functionality
- Multiple scenarios
- Sensitivity analysis
- What-if comparisons
- PDF report generation
- Sharing capabilities
- Email results

## Notes

- Most comprehensive situation
- 3-step questionnaire
- Canadian context throughout
- Educational approach
- Conservative assumptions
- Mobile-first design
- Comprehensive calculations
- Multiple visualizations
- Detailed analysis
- User-friendly interface
