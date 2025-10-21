# components/inputs/buy

Purchase-related input field components.

## Purpose

This directory contains all input components related to purchasing/buying a property, including down payment, mortgage, property tax, maintenance, and closing costs fields.

## Files Structure

```
src/components/inputs/buy/
├── AssetAppreciationRate.test.tsx
├── AssetAppreciationRate.tsx
├── ClosingCostsAmount.test.tsx
├── ClosingCostsAmount.tsx
├── ClosingCostsPercentage.test.tsx
├── ClosingCostsPercentage.tsx
├── DownPaymentAmount.test.tsx
├── DownPaymentAmount.tsx
├── DownPaymentPercentage.test.tsx
├── DownPaymentPercentage.tsx
├── MaintenanceAmount.test.tsx
├── MaintenanceAmount.tsx
├── MaintenancePercentage.test.tsx
├── MaintenancePercentage.tsx
├── MortgageLength.test.tsx
├── MortgageLength.tsx
├── MortgageRate.test.tsx
├── MortgageRate.tsx
├── PropertyTaxAmount.test.tsx
├── PropertyTaxAmount.tsx
├── PropertyTaxPercentage.test.tsx
├── PropertyTaxPercentage.tsx
├── PurchasePrice.test.tsx
├── PurchasePrice.tsx
└── README.md
```

## Input Components

### Core Purchase Inputs

#### PurchasePrice
- **Purpose**: The purchase price of the property
- **Type**: Currency (CAD)
- **Required**: Yes
- **Related**: Base value for percentage calculations

#### AssetAppreciationRate
- **Purpose**: Expected annual property value increase
- **Type**: Percentage
- **Default**: ~2-3% (Canadian market average)

### Down Payment Inputs

#### DownPaymentAmount
- **Purpose**: Down payment in dollars
- **Type**: Currency (CAD)
- **Related**: Linked with DownPaymentPercentage

#### DownPaymentPercentage
- **Purpose**: Down payment as percentage of purchase price
- **Type**: Percentage (0-100%)
- **Related**: Linked with DownPaymentAmount
- **Minimum**: Typically 5-20% in Canada

### Mortgage Inputs

#### MortgageLength
- **Purpose**: Amortization period for the mortgage
- **Type**: Years
- **Default**: 25 years (Canadian standard)
- **Range**: Typically 5-30 years

#### MortgageRate
- **Purpose**: Annual mortgage interest rate
- **Type**: Percentage
- **Default**: Current market rate (~3-6%)

### Property Costs Inputs

#### PropertyTaxAmount
- **Purpose**: Annual property tax in dollars
- **Type**: Currency (CAD)
- **Related**: Linked with PropertyTaxPercentage

#### PropertyTaxPercentage
- **Purpose**: Property tax as percentage of property value
- **Type**: Percentage
- **Related**: Linked with PropertyTaxAmount
- **Default**: ~0.5-1.5% (varies by municipality)

#### MaintenanceAmount
- **Purpose**: Annual maintenance/upkeep costs in dollars
- **Type**: Currency (CAD)
- **Related**: Linked with MaintenancePercentage

#### MaintenancePercentage
- **Purpose**: Maintenance costs as percentage of property value
- **Type**: Percentage
- **Related**: Linked with MaintenanceAmount
- **Default**: ~1% of property value

### Closing Costs Inputs

#### ClosingCostsAmount
- **Purpose**: One-time closing costs in dollars
- **Type**: Currency (CAD)
- **Related**: Linked with ClosingCostsPercentage

#### ClosingCostsPercentage
- **Purpose**: Closing costs as percentage of purchase price
- **Type**: Percentage
- **Related**: Linked with ClosingCostsAmount
- **Default**: ~1.5-4% of purchase price

## Component Patterns

All components follow consistent patterns:

### Amount/Percentage Pairing
Many inputs come in pairs (Amount + Percentage):
- Changes to one automatically update the other
- Provides flexibility for user input preference
- Uses `PercentageAmountSwitch` component for display mode toggling

### Common Features
- Validation (required/optional modes)
- CAD currency formatting
- Touch-based error display
- Default value support
- Tooltip explanations
- Mobile-responsive design

### Display Modes
- **Input**: Text input field
- **Slider**: Visual slider control
- **Combined**: Both input and slider

## Testing

Each component has a comprehensive test file:
- Rendering tests
- Validation tests
- Interaction tests
- Amount/percentage synchronization tests
- Format tests (currency, percentage)

## Usage

These components are typically used in:
- `PurchaseQuestions` page (Situation 1)
- Purchase information panels
- Mortgage calculators

Example:
```typescript
import { PurchasePrice, DownPaymentPercentage, MortgageRate } from '@/components/inputs/buy';
```

## Related Components

- See [`../rent/`](../rent/README.md) - Rent-related inputs
- See [`../invest/`](../invest/README.md) - Investment-related inputs
- See [`../../common/`](../../common/README.md) - Shared input utilities
- See [`../PercentageAmountSwitch.tsx`](../PercentageAmountSwitch.tsx) - Display mode toggle

## Notes

- All currency values use Canadian dollars (CAD)
- Default values reflect Canadian real estate context
- Percentage inputs typically range 0-100%
- Amount/percentage pairs maintain synchronization
- Comprehensive validation ensures data integrity
