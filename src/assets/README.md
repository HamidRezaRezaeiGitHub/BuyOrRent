# assets

Static assets including brand logos and images.

## Purpose

This directory contains static assets used throughout the application, primarily brand identity elements like logos and icons.

## Files Structure

```
src/assets/
└── brand/
    └── README.md               # Brand assets documentation
```

## Subdirectories

### brand/

Contains all logo variations and brand assets.

See: [brand/README.md](./brand/README.md)

**Contents**:
- Logo variations (light/dark themes)
- Different formats (PNG, SVG)
- Various sizes and configurations
- With/without text variants
- With/without background variants

**Total Files**: 14 logo variations

## Asset Organization

### By Type

Assets are organized by type:
- **Brand**: Logos, icons, brand elements (in `brand/`)
- **Images**: Photos, illustrations (future)
- **Icons**: App icons, favicons (future)

### By Format

Supported formats:
- **SVG**: Vector graphics (scalable, preferred)
- **PNG**: Raster images (fixed size, web-ready)
- **JPG**: Photos (future, if needed)

## Usage in Components

### Importing Assets

```typescript
// SVG imports (bundled with Vite)
import logoSvg from '@/assets/brand/logo-2-light-no-text-no-bg.svg';

// PNG imports
import logoPng from '@/assets/brand/logo-2-light&dark.png';

// In JSX
<img src={logoSvg} alt="BuyOrRent Logo" />
```

### Dynamic Imports

```typescript
// Based on theme
const logo = theme === 'dark' 
  ? await import('@/assets/brand/logo-2-dark-with-text-no-bg.svg')
  : await import('@/assets/brand/logo-2-light-with-text-no-bg.svg');
```

### CSS Background Images

```css
.hero {
  background-image: url('@/assets/brand/logo-3-light&dark.png');
}
```

## Asset Processing

### Vite Asset Handling

Vite processes assets automatically:
- **Small assets** (< 4kb): Inlined as base64
- **Large assets**: Emitted as separate files with hash
- **SVGs**: Can be imported as components or URLs

### Build Output

During build (`npm run build`):
- Assets copied to `dist/assets/`
- Filenames hashed for cache busting
- Optimized and minified

## Asset Guidelines

### File Naming

Follow consistent naming:
- `logo-[number]-[variant]-[options].ext`
- Examples:
  - `logo-2-dark-with-text-no-bg.svg`
  - `logo-3-light&dark.png`

### File Size

Keep assets optimized:
- SVGs should be compressed
- PNGs should be optimized
- Consider WebP format for photos

### Accessibility

Always provide:
- Alt text for images
- Descriptive names
- Consider decorative vs informative images

## Adding New Assets

### Steps to Add Assets

1. **Optimize the asset**:
   - Compress images
   - Minimize SVGs
   - Use appropriate format

2. **Place in correct directory**:
   - Brand assets → `brand/`
   - Icons → `icons/` (create if needed)
   - Images → `images/` (create if needed)

3. **Follow naming convention**:
   - Descriptive names
   - Lowercase with hyphens
   - Include variant/theme info

4. **Update documentation**:
   - Add to relevant README
   - Document usage
   - Note any special considerations

5. **Test in app**:
   - Verify loading
   - Check different themes
   - Test on mobile

## Asset Types

### Logos

Located in `brand/`:
- Primary logos
- Secondary logos
- Icon-only variants
- With/without text
- Light/dark themes

### Future Asset Types

Potential additions:
- **Icons**: UI icons, functional icons
- **Illustrations**: Hero images, empty states
- **Photos**: User photos, stock images
- **Animations**: Lottie files, animated SVGs

## Performance Considerations

### Optimization

- Use SVG for logos and icons (scalable, small file size)
- Compress PNGs (use tools like TinyPNG)
- Use appropriate dimensions (don't serve oversized images)
- Consider lazy loading for non-critical assets

### Caching

- Hashed filenames enable long-term caching
- Update hash on content change
- Browser caches assets efficiently

### Loading Strategy

- Critical assets: Preload
- Above-fold assets: Load normally
- Below-fold assets: Lazy load
- Decorative assets: Defer

## Testing Assets

### Verify Asset Loading

```typescript
// In tests
import logo from '@/assets/brand/logo-2-light-no-text-no-bg.svg';

expect(logo).toBeDefined();
expect(typeof logo).toBe('string');
```

### Visual Testing

- Test in both light and dark themes
- Verify correct variants load
- Check mobile rendering
- Validate accessibility

## Integration Points

Assets are used by:
- **Logo Component**: Uses brand logos
- **Navigation**: Brand assets in navbar
- **Landing Page**: Hero images and branding
- **Loading States**: Branded loading indicators

## Related Files

- [`/public/`](../../public/README.md) - Public static assets
- [`/vite.config.ts`](../../vite.config.ts) - Asset handling configuration
- Component files - Import and use assets

## Related Components

- [`src/components/navbar/Logo.tsx`](../components/navbar/Logo.tsx) - Logo component
- Page components - Use brand assets

## TypeScript Support

Asset imports have TypeScript support via declarations:

```typescript
// vite-env.d.ts
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}
```

## Future Enhancements

Potential improvements:
- Asset management system
- Image optimization pipeline
- Responsive images (srcset)
- WebP format support
- CDN integration
- Asset versioning
- Asset analytics

## Notes

- All brand assets support both themes where applicable
- SVG is preferred for logos and icons
- Assets are processed by Vite during build
- Hashed filenames prevent cache issues
- Keep assets optimized for performance
- Follow naming conventions consistently
- Document usage in component READMEs
- Test assets in all themes
