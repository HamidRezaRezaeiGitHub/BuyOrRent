# common

Common utilities and shared functionality for configuration, step management, and progress tracking.

## Purpose

This directory contains core utilities that provide foundational functionality used throughout the application, including configuration management, global step tracking, and progress state management.

## Files Structure

```
src/common/
├── ConfigProvider.ts
├── ConfigProvider.test.ts
├── globalStep.ts
├── globalStep.test.ts
├── progress.ts
├── progress.test.ts
└── useConfig.tsx
```

## Core Modules

### ConfigProvider

**Purpose**: Centralized configuration management system for the application.

**Features**:
- Loads journey manifests
- Manages user input state
- Provides configuration defaults
- Handles situation-specific configs
- Type-safe configuration access

**Key Functions**:
```typescript
// Initialize configuration
ConfigProvider.initialize(situationManifest)

// Get configuration
const config = ConfigProvider.getConfig()

// Update configuration
ConfigProvider.updateConfig(partialConfig)
```

**Documentation**: See [`/docs/CONFIG_IMPLEMENTATION.md`](../../docs/CONFIG_IMPLEMENTATION.md)

**Test Coverage**: Comprehensive tests in `ConfigProvider.test.ts`

### globalStep

**Purpose**: Global step counter and management for multi-step flows.

**Features**:
- Track current step in journey
- Navigate between steps
- Validate step transitions
- Persist step state

**Key Functions**:
```typescript
// Get current step
const currentStep = globalStep.getCurrentStep()

// Set step
globalStep.setStep(2)

// Next/Previous
globalStep.next()
globalStep.previous()

// Reset
globalStep.reset()
```

**Documentation**: See [`/docs/GLOBAL_STEP_CURSOR.md`](../../docs/GLOBAL_STEP_CURSOR.md)

**Test Coverage**: Comprehensive tests in `globalStep.test.ts`

### progress

**Purpose**: Track and manage progress state throughout the application.

**Features**:
- Track completion status
- Calculate progress percentage
- Manage step completion states
- Provide progress indicators

**Key Functions**:
```typescript
// Mark step as complete
progress.markStepComplete(stepId)

// Check if step is complete
const isComplete = progress.isStepComplete(stepId)

// Get overall progress
const percentage = progress.getProgressPercentage()

// Reset progress
progress.reset()
```

**Test Coverage**: Comprehensive tests in `progress.test.ts`

### useConfig

**Purpose**: React hook for accessing configuration in components.

**Features**:
- Type-safe configuration access
- Reactive updates
- Easy component integration
- Encapsulates ConfigProvider complexity

**Usage**:
```typescript
import { useConfig } from '@/common';

const MyComponent = () => {
  const config = useConfig();
  
  return (
    <div>
      Monthly Rent: {config.monthlyRent}
      Purchase Price: {config.purchasePrice}
    </div>
  );
};
```

## Architecture Patterns

### Singleton Pattern

ConfigProvider and globalStep use singleton pattern:
- Single source of truth
- Consistent state across components
- Efficient memory usage

### Hook Pattern

useConfig provides React integration:
- Component-friendly API
- Automatic re-renders on config changes
- Follows React best practices

### Test-Driven Development

All modules have comprehensive test coverage:
- Unit tests for each function
- Integration tests for workflows
- Edge case coverage

## Integration Points

These utilities are used by:
- **Question Pages**: Access and update configuration
- **Input Components**: Read default values
- **Output Components**: Access user inputs for calculations
- **Navigation**: Track and manage step flow
- **Routing**: Determine available routes

## Usage Examples

### Loading Configuration

```typescript
import { ConfigProvider } from '@/common';
import situation1Manifest from '@/config/journey/situation1.manifest.json';

// Initialize on app startup
ConfigProvider.initialize(situation1Manifest);
```

### Using Configuration in Components

```typescript
import { useConfig } from '@/common';

const PurchaseQuestions = () => {
  const config = useConfig();
  
  const handlePriceChange = (newPrice: number) => {
    ConfigProvider.updateConfig({ purchasePrice: newPrice });
  };
  
  return (
    <PurchasePrice
      value={config.purchasePrice}
      onChange={handlePriceChange}
    />
  );
};
```

### Tracking Step Progress

```typescript
import { globalStep, progress } from '@/common';

const QuestionFlow = () => {
  const currentStep = globalStep.getCurrentStep();
  const progressPercent = progress.getProgressPercentage();
  
  const handleNext = () => {
    progress.markStepComplete(currentStep);
    globalStep.next();
  };
  
  return (
    <div>
      <ProgressBar value={progressPercent} />
      <StepIndicator current={currentStep} />
      <button onClick={handleNext}>Next</button>
    </div>
  );
};
```

## State Management

### Configuration State

Configuration is stored in memory and can be:
- Initialized from manifest files
- Updated by user interactions
- Persisted to localStorage (future enhancement)
- Reset to defaults

### Step State

Step state tracks:
- Current active step
- Completed steps
- Available steps
- Step validation status

### Progress State

Progress state includes:
- Individual step completion
- Overall completion percentage
- Journey milestones

## Testing Strategy

### Unit Tests

Each module has isolated unit tests:
- Individual function testing
- State management verification
- Error handling validation

### Integration Tests

Test interactions between modules:
- ConfigProvider + useConfig
- globalStep + progress
- Multi-step workflows

### Test Files

- `ConfigProvider.test.ts` - Configuration management tests
- `globalStep.test.ts` - Step tracking tests
- `progress.test.ts` - Progress tracking tests

## Related Documentation

- [`/docs/CONFIG_IMPLEMENTATION.md`](../../docs/CONFIG_IMPLEMENTATION.md) - Detailed configuration system docs
- [`/docs/GLOBAL_STEP_CURSOR.md`](../../docs/GLOBAL_STEP_CURSOR.md) - Step management documentation
- [`src/config/journey/`](../config/journey/README.md) - Journey manifest configurations

## Related Components

- [`src/contexts/`](../contexts/README.md) - React contexts that use these utilities
- [`src/pages/`](../pages/README.md) - Pages that consume configuration
- [`src/components/situations/`](../components/situations/README.md) - Situation-specific flows

## Future Enhancements

Potential improvements:
- LocalStorage persistence
- Undo/redo functionality
- Configuration validation
- Migration support for config changes
- Multi-user support
- Configuration export/import

## Notes

- All modules are TypeScript with full type safety
- Singleton patterns ensure consistent state
- Test coverage is comprehensive
- Configuration is reactive and updates UI automatically
- Step management is linear but extensible
- Progress tracking is flexible and customizable
- Hook integration follows React best practices
