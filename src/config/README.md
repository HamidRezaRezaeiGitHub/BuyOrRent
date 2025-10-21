# config

Configuration files and journey manifests for the application.

## Purpose

This directory contains configuration files that define application behavior, journey structures, and Canadian market defaults.

## Files Structure

```
src/config/
├── journey/
│   └── README.md               # Situation journey manifests
└── config-canada.ts            # Canadian market defaults and constants
```

## Configuration Files

### config-canada.ts

**Purpose**: Canadian market defaults, constants, and assumptions.

**Contains**:
- Default values for Canadian real estate
- Market assumptions (rent increases, appreciation rates)
- Mortgage defaults (25-year amortization)
- Provincial considerations
- Currency formatting defaults
- Tax rate assumptions

**Example Content**:
```typescript
export const CANADIAN_DEFAULTS = {
  // Rent
  rentIncrease: 2.5,              // Annual % increase
  
  // Mortgage
  mortgageLength: 25,             // Years (Canadian standard)
  mortgagePeriod: 5,              // Typical term length
  
  // Property Costs
  propertyTaxRate: 1.0,           // % of property value
  maintenanceRate: 1.0,           // % of property value
  closingCostsRate: 2.0,          // % of purchase price
  
  // Investment
  conservativeReturn: 5.0,        // Annual % return
  moderateReturn: 7.0,
  aggressiveReturn: 10.0,
  
  // Appreciation
  propertyAppreciation: 2.5,      // Annual % increase
  
  // Down Payment
  minimumDownPayment: 5.0,        // % for CMHC insured
  conventionalDownPayment: 20.0,  // % to avoid insurance
  
  // Analysis
  defaultAnalysisYears: 25,
};
```

**Usage**:
```typescript
import { CANADIAN_DEFAULTS } from '@/config/config-canada';

const initialConfig = {
  mortgageLength: CANADIAN_DEFAULTS.mortgageLength,
  rentIncrease: CANADIAN_DEFAULTS.rentIncrease,
  // ...
};
```

## Subdirectories

### journey/

Contains situation-specific journey manifests.

See: [`journey/README.md`](./journey/README.md)

**Contents**:
- `situation1.manifest.json` - Rent vs Buy journey

**Purpose**: Define structure and flow of each situation

**Manifest Structure**:
```json
{
  "situationId": 1,
  "name": "Currently Renting, Considering Buying",
  "description": "...",
  "steps": [
    {
      "id": "rent",
      "title": "Rent Information",
      "route": "/situation/1/question/rent",
      "fields": [...]
    },
    // More steps...
  ],
  "defaults": {
    "rentIncrease": 2.5,
    "mortgageLength": 25,
    // ...
  }
}
```

## Configuration Loading

### Initialization

Configuration is loaded at application startup:

```typescript
import { ConfigProvider } from '@/common';
import situation1Manifest from '@/config/journey/situation1.manifest.json';
import { CANADIAN_DEFAULTS } from '@/config/config-canada';

// Initialize with manifest and defaults
ConfigProvider.initialize({
  manifest: situation1Manifest,
  defaults: CANADIAN_DEFAULTS
});
```

### Access in Components

```typescript
import { useConfig } from '@/common';

const MyComponent = () => {
  const config = useConfig();
  
  return (
    <div>
      Mortgage Length: {config.mortgageLength} years
    </div>
  );
};
```

## Canadian Market Context

### Regional Variations

Configuration considers provincial differences:

**Ontario**:
- Land transfer tax
- Rent control guidelines
- CMHC considerations

**BC**:
- Property transfer tax
- Rent increase caps
- Foreign buyer restrictions

**Alberta**:
- No provincial rent control
- Different market dynamics

**Quebec**:
- Régie du logement
- Notary requirements
- Different legal framework

### Regulatory Considerations

**CMHC (Canada Mortgage and Housing Corporation)**:
- Minimum down payment requirements
- Mortgage insurance thresholds
- Amortization limits

**Stress Test**:
- Qualification rate considerations
- Payment calculations
- Affordability assessments

## Default Values Rationale

### Rent Increase (2.5%)

- Based on historical Ontario guidelines
- Conservative estimate
- Accounts for inflation
- Provincial rent control varies

### Mortgage Length (25 years)

- Canadian standard amortization
- CMHC default
- Balanced between payment size and interest
- Can extend to 30 years with 20%+ down

### Property Tax (1%)

- Average across Canadian municipalities
- Varies significantly by location
- Toronto: ~0.6-0.7%
- Calgary: ~0.6-0.8%
- Vancouver: ~0.2-0.3%

### Maintenance (1%)

- Industry standard rule of thumb
- Covers ongoing repairs and upkeep
- May vary by property age and type
- Conservative estimate

### Investment Return (5-7%)

- Long-term stock market average
- Accounts for diversified portfolio
- Conservative to moderate range
- After-inflation returns

### Asset Appreciation (2-3%)

- Long-term Canadian real estate average
- Conservative estimate
- Varies by market and timing
- Above inflation typically

## Configuration Management

### Updating Configuration

Configuration can be updated dynamically:

```typescript
ConfigProvider.updateConfig({
  mortgageLength: 30,
  rentIncrease: 3.0
});
```

### Validation

Configuration changes are validated:
- Range checks
- Required fields
- Logical consistency
- Type safety

### Persistence

Future enhancement: Save configuration
- localStorage for temporary
- Backend for permanent
- User accounts for multiple scenarios

## Testing Configuration

### Test Scenarios

Configuration should be tested with:
- Minimum values
- Maximum values
- Default values
- Edge cases
- Invalid values

### Test Configuration

Tests use separate test configuration:

```typescript
const TEST_CONFIG = {
  ...CANADIAN_DEFAULTS,
  // Override for testing
  mortgageLength: 10,
};
```

## Related Files

- [`src/common/ConfigProvider.ts`](../common/ConfigProvider.ts) - Configuration management
- [`src/common/useConfig.tsx`](../common/useConfig.tsx) - React hook for config access
- [`docs/CONFIG_IMPLEMENTATION.md`](../../docs/CONFIG_IMPLEMENTATION.md) - Detailed configuration docs

## Related Components

- All components consume configuration
- Question pages update configuration
- Output pages read configuration
- Services use configuration for calculations

## Development Guidelines

### Adding New Defaults

1. Add to `config-canada.ts`
2. Document the value and rationale
3. Update TypeScript interfaces
4. Add to manifest defaults if applicable
5. Update tests

### Creating New Manifests

1. Create in `journey/` directory
2. Follow existing structure
3. Define all steps and fields
4. Include defaults
5. Document in README
6. Register with ConfigProvider

### Provincial Variations

To add provincial-specific configs:

```typescript
export const PROVINCIAL_DEFAULTS = {
  ON: { propertyTaxRate: 1.0, ... },
  BC: { propertyTaxRate: 0.5, ... },
  AB: { propertyTaxRate: 0.7, ... },
  // ...
};
```

## Best Practices

### Keep Defaults Conservative

- Prefer lower returns
- Higher costs
- Realistic assumptions
- Don't oversell benefits

### Document Assumptions

- Explain each default value
- Cite sources when possible
- Note regional variations
- Update periodically

### Make Configurable

- Allow users to override
- Provide reasonable ranges
- Validate user inputs
- Explain implications

## Future Enhancements

Potential improvements:
- Dynamic defaults based on location
- Market data integration
- Periodic updates from APIs
- User-saved configurations
- Multiple scenario comparison
- Historical data analysis
- Provincial-specific presets

## Notes

- All values reflect Canadian context
- Conservative assumptions preferred
- Regional variations documented
- Periodic review recommended
- User education emphasized
- Not financial advice
- Configuration is flexible
- Defaults are starting points
