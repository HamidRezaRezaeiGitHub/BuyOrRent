# config/journey

Journey configuration manifests for different user situations.

## Purpose

This directory contains JSON manifest files that define the structure, flow, and configuration for each user journey/situation in the application.

## Files Structure

```
src/config/journey/
└── situation1.manifest.json    # Journey configuration for Situation 1
```

## Manifest Files

### situation1.manifest.json

Defines the configuration for Situation 1: Currently renting, considering buying.

The manifest includes:
- Step definitions and order
- Input field configurations
- Validation rules
- Navigation flow
- Default values for Canadian context

## Usage

Journey manifests are imported and used by:
- `ConfigProvider` to initialize application state
- Question pages to render appropriate inputs
- Navigation components to determine flow
- Validation services to apply rules

Example:
```typescript
import situation1Manifest from '@/config/journey/situation1.manifest.json';
```

## Related Files

- See [`src/common/ConfigProvider.ts`](../../common/ConfigProvider.ts) - Loads and manages configuration
- See [`docs/CONFIG_IMPLEMENTATION.md`](../../../docs/CONFIG_IMPLEMENTATION.md) - Configuration system documentation

## Adding New Situations

To add a new situation:

1. Create a new manifest file (e.g., `situation2.manifest.json`)
2. Define the journey structure following the established schema
3. Update `ConfigProvider` to recognize the new manifest
4. Create corresponding input/output components
5. Update routing in `AppRouter`

## Notes

- Manifests follow a specific JSON schema
- All situations should maintain consistent structure
- Canadian defaults are preferred for initial values
- Journey manifests are loaded at application startup
