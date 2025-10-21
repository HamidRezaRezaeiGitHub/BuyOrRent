# components/inputs/invest

Investment-related input field components.

## Purpose

This directory contains input components related to investment returns and strategies when renting instead of buying.

## Files Structure

```
src/components/inputs/invest/
├── InvestmentReturn.tsx
├── InvestmentReturn.test.tsx
└── InvestmentReturnHelperDrawer.tsx
```

## Input Components

### InvestmentReturn

**Purpose**: Annual return rate on investments made with money saved from renting vs buying.

**Type**: Percentage

**Features**:
- Percentage input with validation
- Range typically 0-20% (realistic investment returns)
- Default: ~5-7% (conservative investment portfolio)
- Includes helper drawer for guidance

**Context**: When renting and investing the difference (down payment money, monthly savings), this rate determines the growth of the investment portfolio over time.

**Validation**:
- Required when validation enabled
- Must be reasonable investment return
- Provides warnings for unrealistic values

### InvestmentReturnHelperDrawer

**Purpose**: Educational drawer/modal to help users understand investment returns.

**Features**:
- Explains what investment return means
- Provides context on realistic rates
- Shows examples of different portfolios
- Helps users make informed decisions
- Accessible from InvestmentReturn field

**Content**:
- Conservative portfolio (~4-5%)
- Balanced portfolio (~6-7%)
- Growth portfolio (~8-10%)
- Historical market averages
- Risk considerations

## Component Patterns

### User Education Focus
Unlike other input components, investment inputs emphasize user education:
- Helper drawer with detailed explanations
- Contextual tooltips
- Example scenarios
- Risk warnings

### Realistic Defaults
Default values reflect:
- Long-term market averages
- Conservative assumptions
- Canadian investment context
- Diversified portfolio expectations

## Testing

Comprehensive test coverage includes:
- Rendering tests
- Validation scenarios
- Helper drawer functionality
- User interaction flows
- Edge cases (unrealistic values)
- Error handling

## Usage

These components are used in:
- `InvestmentQuestions` page (Situation 1)
- Investment analysis panels
- Rent vs Buy comparison calculators

Example:
```typescript
import { InvestmentReturn } from '@/components/inputs/invest';

<InvestmentReturn
  value={investmentReturn}
  onChange={setInvestmentReturn}
  enableValidation={true}
/>
```

## Related Components

- See [`../buy/`](../buy/README.md) - Purchase-related inputs
- See [`../rent/`](../rent/README.md) - Rent-related inputs
- See [`../../common/`](../../common/README.md) - Shared input utilities
- See [`../../outputs/rent/`](../../outputs/rent/README.md) - Investment calculation outputs

## Financial Context

### Investment Return Assumptions

**Conservative (4-5%)**:
- High-quality bonds
- Dividend stocks
- Balanced funds
- Lower risk, lower return

**Moderate (6-7%)**:
- Diversified portfolio
- Mix of stocks and bonds
- Index funds
- Historical long-term average

**Aggressive (8-10%)**:
- Growth stocks
- Equity-heavy portfolio
- Higher risk, higher potential return
- Not guaranteed

### Important Considerations

- Past performance doesn't guarantee future results
- Returns fluctuate year-to-year
- Consider investment fees and taxes
- Time horizon matters
- Risk tolerance is personal

## Notes

- Default values are conservative and realistic
- Helper drawer provides essential context
- Validation prevents unrealistic assumptions
- Educational approach helps informed decisions
- Canadian investment context (TFSA, RRSP considerations)
- All rates are annual returns (APR equivalent)
