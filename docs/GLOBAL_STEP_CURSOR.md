# Global Step Cursor (gs) Navigation System

## Overview

The Global Step Cursor system provides accurate Previous/Next navigation across all question components in the BuyOrRent questionnaire flow. It ensures that clicking "Previous" always returns to the exact preceding question, even when crossing component boundaries.

## Problem Solved

**Before:** Clicking Previous from InvestmentQuestions would always return to PurchaseQuestions step 1 (purchase price), losing the user's place in the flow.

**After:** Clicking Previous from InvestmentQuestions now returns to PurchaseQuestions step 8 (the last question), maintaining the user's exact position.

## How It Works

### Global Step Mapping

All questions across components are assigned a global step number (1-11):

| Component | Local Steps | Global Steps | Description |
|-----------|-------------|--------------|-------------|
| RentQuestions | 1-2 | 1-2 | Monthly rent, rent increase |
| PurchaseQuestions | 1-8 | 3-10 | Purchase price, down payment, mortgage details, etc. |
| InvestmentQuestions | 1 | 11 | Investment return rate |

### URL Parameter

The global step is stored in the URL as a query parameter: `?gs=N`

Example URLs:
- `?gs=1` → RentQuestions step 1 (monthly rent)
- `?gs=3` → PurchaseQuestions step 1 (purchase price)
- `?gs=10` → PurchaseQuestions step 8 (asset appreciation)
- `?gs=11` → InvestmentQuestions step 1

### Navigation Flow

1. **Initial navigation:** Components start without `gs` parameter
2. **Forward navigation:** When clicking Next, the system:
   - Calculates the current global step
   - Increments to the next global step
   - Builds the navigation URL with the new `gs` parameter
3. **Backward navigation:** When clicking Previous, the system:
   - Calculates the current global step
   - Decrements to the previous global step
   - Navigates to the appropriate component and local step
4. **State restoration:** When a component loads with `gs` parameter:
   - Converts global step to local step
   - Sets the local step state automatically

## Implementation Details

### Helper Functions

Located in `src/common/globalStep.ts`:

- **`buildComponentStepMap()`**: Maps components to their global step ranges
- **`localToGlobalStep(component, localStep)`**: Converts local step to global step
- **`globalToLocalStep(globalStep)`**: Converts global step to component and local step
- **`buildNavigationUrl(globalStep, dataParams)`**: Constructs URL with gs and data params
- **`getTotalSteps()`**: Returns total number of steps (11)
- **`getComponentRoute(component)`**: Returns the route path for a component

### Component Integration

Each question component (RentQuestions, PurchaseQuestions, InvestmentQuestions):

1. **Imports helper functions:**
   ```typescript
   import { localToGlobalStep, globalToLocalStep, buildNavigationUrl } from '@/common/globalStep'
   ```

2. **Initializes step from gs parameter:**
   ```typescript
   useEffect(() => {
     const gsParam = searchParams.get('gs')
     if (gsParam) {
       const globalStep = parseInt(gsParam, 10)
       const stepInfo = globalToLocalStep(globalStep)
       if (stepInfo && stepInfo.component === 'ComponentName') {
         setStep(stepInfo.localStep as StepType)
       }
     }
   }, [searchParams])
   ```

3. **Uses gs for navigation:**
   ```typescript
   const handleNext = () => {
     // ... local step transitions ...
     
     // For cross-component navigation:
     const currentGlobalStep = localToGlobalStep('ComponentName', step)
     if (currentGlobalStep) {
       const nextGlobalStep = currentGlobalStep + 1
       const navUrl = buildNavigationUrl(nextGlobalStep, dataParams)
       if (navUrl) {
         navigate(navUrl)
         return
       }
     }
     // Fallback to legacy navigation
   }
   ```

### Configuration

The step counts are configured in `src/config/journey/situation1.manifest.json`:

```json
{
  "situationId": 1,
  "sections": [
    { "component": "RentQuestions", "stepCount": 2 },
    { "component": "PurchaseQuestions", "stepCount": 8 },
    { "component": "InvestmentQuestions", "stepCount": 1 }
  ]
}
```

## Testing

Comprehensive tests are located in `src/common/globalStep.test.ts` with 21 test cases covering:

- Component step mapping
- Local to global step conversions
- Global to local step conversions
- Navigation URL building
- Edge cases (out of range steps, unknown components)
- Round-trip conversion consistency

## Backward Compatibility

The system includes fallback behavior:
- If `gs` parameter is not present, components work as before
- If `gs` conversion fails, falls back to legacy navigation
- No breaking changes to existing functionality

## Future Enhancements

To add new components or modify step counts:

1. Update `src/config/journey/situation1.manifest.json`
2. Add route mapping in `getComponentRoute()` if needed
3. Integrate the component following the patterns above
4. Tests will automatically adapt to the new configuration

## Examples

### Example 1: Full Forward Navigation
```
Start → gs=1 (Rent step 1) → gs=2 (Rent step 2) → 
gs=3 (Purchase step 1) → ... → gs=10 (Purchase step 8) → 
gs=11 (Investment step 1) → Results
```

### Example 2: Backward from Investment
```
gs=11 (Investment step 1) → [Previous] → 
gs=10 (Purchase step 8) ✅ (not step 1!)
```

### Example 3: Cross-component Backward
```
gs=3 (Purchase step 1) → [Previous] → 
gs=2 (Rent step 2) ✅ (crosses component boundary)
```
