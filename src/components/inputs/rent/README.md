# components/inputs/rent

Rent-related input field components.

## Purpose

This directory contains input components related to renting scenarios, including monthly rent and rent increase projections.

## Files Structure

```
src/components/inputs/rent/
├── MonthlyRent.test.tsx
├── MonthlyRent.tsx
├── README.md
├── RentIncrease.test.tsx
└── RentIncrease.tsx
```

## Input Components

### MonthlyRent

**Purpose**: Current monthly rent payment (all-in cost).

**Type**: Currency (CAD)

**Required**: Yes (core input for rent vs buy comparison)

**Features**:
- Currency formatting (CAD)
- Validation for reasonable rent amounts
- Touch-based error display
- Mobile-responsive design

**Definition**: "All-in" monthly rent includes:
- Base rent payment
- Utilities paid by tenant
- Parking fees
- Any other monthly costs

**Validation**:
- Required field
- Must be positive number
- Typically $500-$5,000+ range (Canadian context)
- Warning for unrealistic values

**Usage Context**: This is one of the first inputs in Situation 1 questionnaire and serves as the baseline for comparing renting vs buying scenarios.

### RentIncrease

**Purpose**: Expected annual rent increase rate.

**Type**: Percentage

**Default**: ~2.5% (approximate Canadian rental market average)

**Features**:
- Percentage input with validation
- Reasonable range checking (0-10%)
- Provincial rent control consideration
- Historical context tooltips

**Context**: In Canada, rent increases are often regulated by provincial rent control laws. Default reflects typical long-term average but can vary by:
- Province/territory
- Rent control regulations
- Market conditions
- Type of rental unit

**Validation**:
- Must be non-negative
- Warning for values > 5% (unusual in rent-controlled markets)
- Considers provincial guidelines

**Provincial Context**:
- Ontario: Typically capped at ~2.5%
- BC: Typically capped at ~2-3%
- Alberta: No rent control (market-based)
- Quebec: Régie du logement guidelines

## Component Patterns

### All-In Cost Approach
MonthlyRent emphasizes "all-in" cost:
- Not just base rent
- Includes all tenant-paid expenses
- Provides fair comparison to ownership costs
- Tooltips explain what to include

### Canadian Context
Both components reflect Canadian rental market:
- CAD currency
- Rent control awareness
- Provincial variations
- Realistic defaults

### Validation Strategy
- Required vs optional modes
- Touch-based error display
- Reasonable range validation
- User-friendly error messages

## Testing

Comprehensive test coverage:
- Rendering tests
- Validation scenarios
- Currency formatting tests
- Interaction tests
- Edge cases (zero, negative, extreme values)
- Touch-based validation flow

## Usage

These components are used in:
- `RentQuestions` page (Situation 1)
- Rent information panels
- Monthly rent calculations and projections

Example:
```typescript
import { MonthlyRent, RentIncrease } from '@/components/inputs/rent';

<MonthlyRent
  value={monthlyRent}
  onChange={setMonthlyRent}
  enableValidation={true}
  validationMode="required"
/>

<RentIncrease
  value={rentIncrease}
  onChange={setRentIncrease}
  enableValidation={true}
  validationMode="optional"
/>
```

## Related Components

- See [`../buy/`](../buy/README.md) - Purchase-related inputs
- See [`../invest/`](../invest/README.md) - Investment-related inputs
- See [`../../outputs/rent/`](../../outputs/rent/README.md) - Rent calculation outputs
- See [`../../common/`](../../common/README.md) - Shared input utilities

## Calculation Context

### MonthlyRent Usage

Used to calculate:
- Total annual rent cost
- Projected rent over time
- Comparison with mortgage payments
- Investment opportunity cost

### RentIncrease Usage

Used to project:
- Future monthly rent amounts
- Total rent paid over analysis period
- Compound effect of annual increases
- Long-term renting costs

**Example Projection**:
```
Initial Rent: $2,000/month
Rent Increase: 2.5% annually

Year 1: $2,000/month
Year 2: $2,050/month
Year 3: $2,101/month
Year 5: $2,207/month
Year 10: $2,563/month
```

## Notes

- All currency values in Canadian dollars (CAD)
- Rent increase defaults are conservative
- Provincial rent control laws may cap increases
- "All-in" rent ensures fair comparison
- Touch-based validation improves UX
- Both fields critical for accurate analysis
- Consider geographic location for realistic values
