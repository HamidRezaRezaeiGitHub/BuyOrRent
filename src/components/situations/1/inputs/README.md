# components/situations/1/inputs

Input question pages for Situation 1: Currently renting, considering buying.

## Purpose

This directory contains the question page components that collect user inputs for Situation 1 journey, organized by category (rent, purchase, investment).

## Files Structure

```
src/components/situations/1/inputs/
├── InvestmentInformation.tsx
├── InvestmentQuestions.tsx
├── InvestmentQuestions.test.tsx
├── PurchaseInformation.tsx
├── PurchaseQuestions.tsx
├── PurchaseQuestions.test.tsx
├── RentQuestions.tsx
├── RentQuestions.test.tsx
├── RentalInformation.tsx
└── index.ts
```

## Question Page Components

### RentQuestions

**Route**: `/situation/1/question/rent`

**Purpose**: Collects rental information (first step in Situation 1).

**Inputs Collected**:
- Monthly Rent (required)
- Annual Rent Increase Rate (optional with default)

**Features**:
- Step 1 of 3 in the journey
- Simple, focused questions
- Mobile-first design
- Progress indication
- Navigation to next step

**Related Information Component**: `RentalInformation.tsx`

### PurchaseQuestions

**Route**: `/situation/1/question/purchase`

**Purpose**: Collects purchase/mortgage information (second step).

**Inputs Collected**:
- Purchase Price (required)
- Down Payment (Amount or Percentage)
- Mortgage Length (years)
- Mortgage Rate (percentage)
- Property Tax (Amount or Percentage)
- Maintenance Costs (Amount or Percentage)
- Closing Costs (Amount or Percentage)
- Asset Appreciation Rate (percentage)

**Features**:
- Step 2 of 3 in the journey
- Multiple related inputs
- Amount/Percentage toggle support
- Comprehensive mortgage details
- Information panel with context
- Back/Next navigation

**Related Information Component**: `PurchaseInformation.tsx`

### InvestmentQuestions

**Route**: `/situation/1/question/investment`

**Purpose**: Collects investment return assumptions (final input step).

**Inputs Collected**:
- Expected Annual Investment Return (percentage)

**Features**:
- Step 3 of 3 in the journey
- Educational helper drawer
- Investment context explanation
- Simple single-input focus
- Completes input phase
- Navigation to results

**Related Information Component**: `InvestmentInformation.tsx`

## Information Panel Components

### RentalInformation

**Purpose**: Provides context and explanations for rent questions.

**Content**:
- What "all-in rent" means
- How to calculate total monthly rent
- What to include (utilities, parking, etc.)
- Why rent increase matters

### PurchaseInformation

**Purpose**: Provides detailed context for purchase questions.

**Content**:
- Purchase price guidelines
- Down payment requirements
- Mortgage basics
- Property tax explanation
- Maintenance cost expectations
- Closing costs overview
- Asset appreciation context

**Features**:
- Expandable sections
- Canadian context (CMHC, regulations)
- Tooltips and examples
- Links to resources

### InvestmentInformation

**Purpose**: Provides context for investment return assumptions.

**Content**:
- What investment return means
- Realistic return ranges
- Portfolio examples (conservative, balanced, aggressive)
- Risk considerations
- Time horizon importance

## Component Structure Pattern

All question pages follow a consistent structure:

```typescript
export const QuestionPage = () => {
  return (
    <div className="question-page">
      <ProgressIndicator currentStep={n} totalSteps={3} />
      
      <div className="question-content">
        <InformationPanel />
        
        <div className="input-fields">
          <InputComponent1 />
          <InputComponent2 />
          {/* ... */}
        </div>
      </div>
      
      <Navigation 
        previousUrl="/previous"
        nextUrl="/next"
        canProceed={isValid}
      />
    </div>
  );
};
```

## Journey Flow

```
/situation/1/question/rent
  ↓
/situation/1/question/purchase
  ↓
/situation/1/question/investment
  ↓
/situation/1/panel  (Results)
```

## State Management

Question pages interact with:
- `ConfigProvider` - Global configuration state
- `useConfig` hook - Access to user inputs
- URL parameters - Step tracking
- Local state - Component-specific UI state

## Validation

Each question page:
- Uses field-level validation
- Displays errors after touch
- Required fields prevent progression
- Optional fields provide defaults
- Validation respects user journey state

## Testing

Comprehensive test coverage:
- Page rendering tests
- Input interaction tests
- Validation tests
- Navigation tests
- Information panel tests
- State management tests

## Usage

These components are routed in `AppRouter`:

```typescript
<Route path="/situation/1/question/rent" element={<RentQuestions />} />
<Route path="/situation/1/question/purchase" element={<PurchaseQuestions />} />
<Route path="/situation/1/question/investment" element={<InvestmentQuestions />} />
```

## Related Components

- See [`../../../inputs/rent/`](../../../inputs/rent/README.md) - Rent input components
- See [`../../../inputs/buy/`](../../../inputs/buy/README.md) - Purchase input components
- See [`../../../inputs/invest/`](../../../inputs/invest/README.md) - Investment input components
- See [`../outputs/`](../outputs/README.md) - Result analysis components
- See [`../../`](../../README.md) - Situations overview

## Design Patterns

### Progressive Disclosure
- Start with simple questions (rent)
- Progress to complex questions (purchase)
- Finish with conceptual questions (investment)

### Information Density
- Step 1: Low density (2 inputs)
- Step 2: High density (8+ inputs)
- Step 3: Low density (1 input)

### User Education
- Information panels explain concepts
- Tooltips provide quick help
- Helper drawers offer deep dives
- Examples clarify expectations

## Mobile Optimization

- Single column layouts
- Large touch targets
- Collapsible information panels
- Sticky navigation
- Progress indicators

## Notes

- Pages load configuration from manifest
- Each step is independently testable
- State persists across navigation
- Back button maintains entered data
- Canadian context in all defaults and examples
- Accessibility features throughout (ARIA, keyboard nav)
- Information panels enhance understanding
- Progressive validation improves UX
