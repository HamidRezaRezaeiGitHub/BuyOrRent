# components/inputs

Input field components organized by category (rent, buy, invest).

## Purpose

This directory contains all user input components for the questionnaire, organized by the type of information they collect (rental, purchase, investment).

## Files Structure

```
src/components/inputs/
├── buy/
│   └── README.md               # Purchase-related input fields
├── invest/
│   └── README.md               # Investment-related input fields
├── rent/
│   └── README.md               # Rent-related input fields
├── PercentageAmountSwitch.tsx  # Toggle component for amount/percentage display
└── PercentageAmountSwitch.test.tsx
```

## Input Categories

### Rent Inputs

**Location**: [`rent/`](./rent/README.md)

**Components** (2):
- `MonthlyRent` - Current monthly rent (required)
- `RentIncrease` - Annual rent increase rate

**Purpose**: Collect rental scenario information

**Context**: First step in Situation 1 questionnaire

---

### Buy/Purchase Inputs

**Location**: [`buy/`](./buy/README.md)

**Components** (13 pairs + singles):
- `PurchasePrice` - Property purchase price (required)
- `DownPaymentAmount` / `DownPaymentPercentage` - Down payment
- `MortgageLength` - Amortization period
- `MortgageRate` - Interest rate
- `PropertyTaxAmount` / `PropertyTaxPercentage` - Property taxes
- `MaintenanceAmount` / `MaintenancePercentage` - Maintenance costs
- `ClosingCostsAmount` / `ClosingCostsPercentage` - Closing costs
- `AssetAppreciationRate` - Expected property value increase

**Purpose**: Collect purchase/mortgage information

**Context**: Second step in Situation 1 questionnaire

---

### Investment Inputs

**Location**: [`invest/`](./invest/README.md)

**Components** (2):
- `InvestmentReturn` - Expected annual return on investments
- `InvestmentReturnHelperDrawer` - Educational guidance component

**Purpose**: Collect investment assumptions

**Context**: Third step in Situation 1 questionnaire

## Shared Components

### PercentageAmountSwitch

**Purpose**: Toggle control for switching between amount and percentage display modes.

**Features**:
- Seamless mode switching
- Maintains data consistency
- Visual indicator of current mode
- Used by amount/percentage paired inputs

**Usage**:
```typescript
<PercentageAmountSwitch
  mode={displayMode}
  onModeChange={setDisplayMode}
/>
```

**Integration**:
Used by components with amount/percentage pairs:
- Down Payment
- Property Tax
- Maintenance
- Closing Costs

## Input Component Patterns

### Amount/Percentage Pairing

Many inputs come in pairs:
- One for dollar amount (`DownPaymentAmount`)
- One for percentage (`DownPaymentPercentage`)
- Changes to either automatically update the other
- Switch component toggles between displays

### Common Features

All input components share:
- **Validation**: Required/optional modes
- **Formatting**: Currency (CAD) or percentage
- **Error Display**: Touch-based progressive errors
- **Defaults**: Canadian context defaults
- **Tooltips**: Helpful explanations
- **Accessibility**: ARIA labels, keyboard nav
- **Responsive**: Mobile-first design

### Display Modes

Components support multiple display modes:
- **Input**: Text input field
- **Slider**: Visual slider control
- **Combined**: Both input and slider

### Canadian Context

All inputs reflect Canadian real estate context:
- Currency in CAD
- Mortgage terms (typically 25 years)
- Rent increase rates (~2.5%)
- Property tax ranges
- Closing costs percentages

## Component Architecture

### Base Components

Input components build on common components:

```
Common/FlexibleInputField (base)
  ↓ Extended by
Specific Input Components (MonthlyRent, PurchasePrice, etc.)
  ↓ Used in
Question Pages (RentQuestions, PurchaseQuestions, etc.)
```

### Validation Integration

All inputs integrate with `ValidationService`:

```typescript
<InputComponent
  enableValidation={true}
  validationMode="required"  // or "optional"
  onValidationChange={(isValid, errors) => {
    // Handle validation state
  }}
/>
```

### Formatting Integration

Components use `FormattingService`:

```typescript
// Currency formatting
FormattingService.formatCurrency(150000)  // "$150,000.00"

// Percentage formatting
FormattingService.formatPercentage(2.5)   // "2.50%"
```

## Testing Strategy

Each input component has comprehensive tests:
- **Rendering**: Default and custom props
- **Interaction**: User input, changes, blur
- **Validation**: Required, optional, edge cases
- **Formatting**: Currency, percentage display
- **Synchronization**: Amount/percentage pairing
- **Accessibility**: ARIA, keyboard navigation

## Usage in Application

### Input Flow

```
User Journey:
  1. Rent Inputs (2 fields)
       ↓
  2. Purchase Inputs (8+ fields with pairs)
       ↓
  3. Investment Inputs (1 field)
       ↓
  Results/Analysis
```

### Question Pages

Inputs are used in situation question pages:

```typescript
// RentQuestions page
<MonthlyRent value={rent} onChange={setRent} />
<RentIncrease value={increase} onChange={setIncrease} />

// PurchaseQuestions page
<PurchasePrice value={price} onChange={setPrice} />
<DownPaymentPercentage value={down} onChange={setDown} />
// ... more inputs
```

## Data Flow

### Input → State → Config

```typescript
User Input
  ↓
Component onChange
  ↓
Local State Update
  ↓
ConfigProvider.updateConfig()
  ↓
Global Config State
  ↓
Available for Calculations
```

## Related Components

- [`../common/`](../common/README.md) - Base field components
- [`../situations/1/inputs/`](../situations/1/inputs/README.md) - Question pages using these inputs
- [`../outputs/`](../outputs/README.md) - Output components displaying results

## Related Services

- [`../../services/validation/`](../../services/validation/README.md) - Field validation
- [`../../services/formatting/`](../../services/formatting/README.md) - Data formatting
- [`../../common/ConfigProvider.ts`](../../common/ConfigProvider.ts) - Configuration management

## Development Guidelines

### Adding New Input Components

1. **Determine category**: rent, buy, or invest
2. **Choose base component**: Usually `FlexibleInputField`
3. **Define props interface**: Include validation, formatting options
4. **Implement component**: With proper validation and formatting
5. **Add tests**: Comprehensive test coverage
6. **Update README**: Document in category README
7. **Integrate**: Add to relevant question page

### Creating Amount/Percentage Pairs

If creating a paired input:

1. Create both components (Amount and Percentage)
2. Ensure bidirectional synchronization
3. Use `PercentageAmountSwitch` for mode toggle
4. Test synchronization thoroughly
5. Document the relationship

## Performance

Input components are optimized:
- Memoized validation configs
- Debounced validation (when appropriate)
- Efficient re-render strategies
- Lazy loading of heavy components

## Accessibility

All inputs ensure:
- Proper label associations
- Required field indicators
- Error announcements
- Keyboard navigation
- Focus management
- ARIA attributes

## Mobile Optimization

Inputs are mobile-friendly:
- Large touch targets
- Readable font sizes
- Simplified layouts on small screens
- Touch-optimized sliders
- Virtual keyboard considerations

## Future Enhancements

Potential additions:
- More input types (date, time, etc.)
- Auto-save functionality
- Input history/undo
- Smart defaults based on location
- Real-time data integration
- Advanced calculators

## Notes

- Total: 17+ input components
- Organized by data category
- Build on common components
- Comprehensive validation
- Canadian context throughout
- Amount/percentage pairing pattern
- Mobile-first responsive
- Full accessibility support
- Colocated tests
- Theme-aware styling
