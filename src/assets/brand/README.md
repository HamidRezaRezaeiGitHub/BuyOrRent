# assets/brand

Brand identity assets for the BuyOrRent application.

## Purpose

This directory contains all logo variations and brand assets used throughout the application, including light/dark theme variants and different format versions (PNG, SVG).

## Files Structure

```
src/assets/brand/
├── logo-1-light&dark.png              # Primary logo (works in both themes)
├── logo-2-dark-no-text-no-bg.png      # Logo mark only (dark variant)
├── logo-2-dark-no-text-no-bg.svg      # Logo mark only (dark variant, vector)
├── logo-2-dark-with-text-no-bg.png    # Logo with text (dark variant)
├── logo-2-dark-with-text-no-bg.svg    # Logo with text (dark variant, vector)
├── logo-2-dark-with-text.png          # Logo with text and background (dark)
├── logo-2-light&dark.png              # Secondary logo (works in both themes)
├── logo-2-light-no-text-no-bg.png     # Logo mark only (light variant)
├── logo-2-light-no-text-no-bg.svg     # Logo mark only (light variant, vector)
├── logo-2-light-with-text-no-bg.png   # Logo with text (light variant)
├── logo-2-light-with-text-no-bg.svg   # Logo with text (light variant, vector)
├── logo-2-light-with-text.png         # Logo with text and background (light)
├── logo-3-light&dark.png              # Tertiary logo variant
└── logo-4-light&dark.png              # Quaternary logo variant
```

## Logo Variants

### Theme Variants
- **Light variants**: Optimized for light backgrounds
- **Dark variants**: Optimized for dark backgrounds
- **Light & Dark**: Universal logos that work in both themes

### Format Options
- **PNG**: Raster images for web use
- **SVG**: Vector graphics for scalability

### Configuration Options
- **With text**: Includes brand name
- **No text**: Logo mark only
- **With background**: Includes background color
- **No background**: Transparent background

## Usage

These assets are typically imported and used in:
- Navigation bar (Logo component)
- Landing pages
- Loading screens
- Favicons

Example:
```typescript
import logo from '@/assets/brand/logo-2-light-no-text-no-bg.svg';
```

## Notes

- Use SVG format when scalability is important
- Use PNG format for fixed-size implementations
- Choose light/dark variants based on theme context
- "Light & Dark" variants are safe for dynamic theming
