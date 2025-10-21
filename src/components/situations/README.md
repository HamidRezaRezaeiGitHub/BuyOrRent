# components/situations

Situation-specific flows and complete user journeys.

## Purpose

This directory contains complete user journey implementations for different scenarios. Each situation represents a specific use case with its own flow, input pages, and result analysis.

## Files Structure

```
src/components/situations/
├── 1/
│   ├── inputs/
│   │   ├── InvestmentInformation.tsx
│   │   ├── InvestmentQuestions.test.tsx
│   │   ├── InvestmentQuestions.tsx
│   │   ├── PurchaseInformation.tsx
│   │   ├── PurchaseQuestions.test.tsx
│   │   ├── PurchaseQuestions.tsx
│   │   ├── README.md
│   │   ├── RentQuestions.test.tsx
│   │   ├── RentQuestions.tsx
│   │   ├── RentalInformation.tsx
│   │   └── index.ts
│   ├── outputs/
│   │   ├── BuyAnalysis.tsx
│   │   ├── ComparisonAnalysis.tsx
│   │   ├── README.md
│   │   ├── RentAnalysis.tsx
│   │   └── index.ts
│   ├── README.md
│   └── index.ts
├── README.md
├── Situation1.tsx
└── index.ts
```

## Current Situations

### Situation 1: Currently Renting, Considering Buying

**Location**: [`1/`](./1/README.md)

**Description**: For users currently renting who are considering purchasing a home.

**Journey Flow**:
```
Rent Questions
  ↓
Purchase Questions
  ↓
Investment Questions
  ↓
Results Analysis
```

**Input Pages** (3 steps):
- [`1/inputs/RentQuestions`](./1/inputs/README.md) - Monthly rent, rent increase
- [`1/inputs/PurchaseQuestions`](./1/inputs/README.md) - Purchase details, mortgage info
- [`1/inputs/InvestmentQuestions`](./1/inputs/README.md) - Investment return expectations

**Output Components**:
- [`1/outputs/RentAnalysis`](./1/outputs/README.md) - Rent scenario projections
- [`1/outputs/BuyAnalysis`](./1/outputs/README.md) - Purchase scenario analysis
- [`1/outputs/ComparisonAnalysis`](./1/outputs/README.md) - Side-by-side comparison

**Routes**:
- `/situation/1/question/rent` - Rent inputs
- `/situation/1/question/purchase` - Purchase inputs
- `/situation/1/question/investment` - Investment inputs
- `/situation/1/panel` - Results display
- `/situation/1` - Results display (alias)

**Results Container**: `Situation1.tsx`

### Future Situations

Planned additions:
- **Situation 2**: Currently owning, considering selling
- **Situation 3**: First-time buyer
- **Situation 4**: Investment property comparison
- **Situation 5**: Rent vs buy in different cities

## Situation Architecture

### Structure Pattern

Each situation follows a consistent structure:

```
situations/[number]/
├── inputs/                     # Question pages
│   ├── Step1Questions.tsx
│   ├── Step2Questions.tsx
│   ├── Step3Questions.tsx
│   └── README.md
├── outputs/                    # Result displays
│   ├── Analysis1.tsx
│   ├── Analysis2.tsx
│   ├── Comparison.tsx
│   └── README.md
└── README.md                   # Situation documentation
```

### Common Elements

All situations include:
1. **Input Flow**: Progressive questionnaire
2. **Configuration**: Situation-specific manifest
3. **Calculations**: Business logic services
4. **Outputs**: Analysis and results
5. **Container**: Main situation component

## Situation 1 Deep Dive

### Input Flow

```typescript
Step 1: Rent Information
- MonthlyRent (required)
- RentIncrease (optional with default)

Step 2: Purchase Information
- PurchasePrice (required)
- DownPayment
- Mortgage details
- Costs (tax, maintenance, closing)
- AssetAppreciationRate

Step 3: Investment Information
- InvestmentReturn (with helper)
```

### Data Collection

User inputs stored in ConfigProvider:

```typescript
{
  // Rent data
  monthlyRent: number,
  rentIncrease: number,
  
  // Purchase data
  purchasePrice: number,
  downPaymentPercentage: number,
  mortgageLength: number,
  mortgageRate: number,
  // ... more fields
  
  // Investment data
  investmentReturn: number
}
```

### Calculations

Multiple calculation services:

```typescript
// Rent projections
MonthlyRentCalculator.calculate(rentData);

// Mortgage calculations
MortgageAmortizationCalculator.calculate(mortgageData);

// Investment growth
InvestmentCalculator.calculate(investmentData);

// Comparison
ComparisonCalculator.compare(rentScenario, buyScenario);
```

### Results Display

`Situation1.tsx` container:

```typescript
export const Situation1 = () => {
  const config = useConfig();
  
  return (
    <div className="results-panel">
      <RentAnalysis config={config} />
      <BuyAnalysis config={config} />
      <ComparisonAnalysis config={config} />
    </div>
  );
};
```

## Navigation Flow

### Progressive Disclosure

Questions progress from simple to complex:

```
Simple (Rent)
  ↓ 2 fields
Complex (Purchase)
  ↓ 8+ fields
Conceptual (Investment)
  ↓ 1 field with education
Results
```

### Back/Forward Navigation

Users can:
- Navigate back to previous questions
- Edit previous answers
- Skip ahead (if data exists)
- Return to results from questions

### State Persistence

- Data persists across navigation
- Can return to questionnaire from results
- Configuration maintained in ConfigProvider
- No data loss on back/forward

## Routing Configuration

Situation 1 routes in `AppRouter.tsx`:

```typescript
<Route path="/situation/1/question/rent" 
  element={<RentQuestions />} 
/>
<Route path="/situation/1/question/purchase" 
  element={<PurchaseQuestions />} 
/>
<Route path="/situation/1/question/investment" 
  element={<InvestmentQuestions />} 
/>
<Route path="/situation/1/panel" 
  element={<Situation1 />} 
/>
<Route path="/situation/1" 
  element={<Situation1 />} 
/>
```

## Configuration System

### Situation Manifest

Each situation has a manifest:

```json
// config/journey/situation1.manifest.json
{
  "id": 1,
  "name": "Currently Renting, Considering Buying",
  "steps": [
    {
      "id": "rent",
      "title": "Rent Information",
      "fields": [...]
    },
    {
      "id": "purchase",
      "title": "Purchase Information",
      "fields": [...]
    },
    {
      "id": "investment",
      "title": "Investment Assumptions",
      "fields": [...]
    }
  ]
}
```

### Manifest Loading

```typescript
import situation1Manifest from '@/config/journey/situation1.manifest.json';

ConfigProvider.initialize(situation1Manifest);
```

## Testing Strategy

Situations require comprehensive testing:
- **Input pages**: User interactions, validation
- **Navigation**: Flow progression, back/forward
- **Calculations**: Accuracy, edge cases
- **Outputs**: Display, formatting
- **Integration**: End-to-end flow

## Related Components

- [`../inputs/`](../inputs/README.md) - Input field components
- [`../outputs/`](../outputs/README.md) - Output display components
- [`../../pages/`](../../pages/README.md) - Page containers
- [`../../contexts/AppRouter.tsx`](../../contexts/AppRouter.tsx) - Route definitions

## Related Services

- [`../../common/ConfigProvider.ts`](../../common/ConfigProvider.ts) - Configuration management
- [`../../services/MonthlyRentCalculator.ts`](../../services/MonthlyRentCalculator.ts) - Rent calculations
- [`../../services/MortgageAmortizationCalculator.ts`](../../services/MortgageAmortizationCalculator.ts) - Mortgage calculations

## Development Guidelines

### Adding New Situations

1. **Create situation directory**: `situations/[number]/`
2. **Add subdirectories**: `inputs/`, `outputs/`
3. **Create manifest**: `config/journey/situation[number].manifest.json`
4. **Build input pages**: Question components
5. **Implement calculations**: Business logic services
6. **Create output pages**: Analysis components
7. **Build container**: Main situation component
8. **Add routes**: Update AppRouter
9. **Test thoroughly**: End-to-end testing
10. **Document**: Create README files

### Situation Checklist

- [ ] Manifest file created
- [ ] Input pages implemented
- [ ] Validation configured
- [ ] Calculation services ready
- [ ] Output components created
- [ ] Container component built
- [ ] Routes added
- [ ] Navigation tested
- [ ] Documentation complete
- [ ] Tests passing

## Canadian Context

All situations reflect Canadian context:
- Currency in CAD
- Tax considerations (provincial/federal)
- Mortgage regulations (CMHC, etc.)
- Market assumptions
- Legal requirements
- Regional variations

## User Education

Situations emphasize education:
- Information panels
- Tooltips and help text
- Helper drawers
- Examples and defaults
- Context explanations
- No financial advice disclaimers

## Accessibility

Situations ensure:
- Progressive disclosure
- Clear navigation
- Focus management
- Error handling
- Screen reader support
- Keyboard navigation

## Mobile Optimization

- Step-by-step flow
- Touch-friendly controls
- Simplified layouts
- Progress indicators
- Easy navigation
- Responsive design

## Future Enhancements

Planned improvements:
- Save/load functionality
- Scenario comparison
- What-if analysis
- Sensitivity testing
- PDF report generation
- Shareable results
- More situation types

## Notes

- Currently: 1 situation implemented
- Each situation is self-contained
- Progressive questionnaire design
- Canadian context throughout
- Educational approach
- No financial advice given
- Mobile-first responsive
- Comprehensive documentation
- Extensible architecture
