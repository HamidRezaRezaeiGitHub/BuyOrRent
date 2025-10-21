# public

Public static files served directly without processing.

## Purpose

This directory contains static assets that are served directly by the web server without processing by the build tool (Vite). Files here are copied as-is to the root of the `dist/` directory during build.

## Files Structure

```
public/
└── vite.svg        # Vite logo (default template file)
```

## Current Files

### vite.svg

**Purpose**: Vite framework logo (default template file).

**Usage**: Can be replaced with custom favicon or removed.

**Note**: This is a placeholder from the Vite React template.

## Public Directory Usage

### What Goes in Public

Files that should be in `public/`:

✅ **Favicons and App Icons**:
- `favicon.ico`
- `apple-touch-icon.png`
- `favicon-16x16.png`, `favicon-32x32.png`
- `site.webmanifest`
- PWA icons

✅ **Static Assets Referenced by Absolute Path**:
- Files referenced in `index.html`
- Files accessed via `/filename.ext`
- Third-party assets

✅ **Special Files**:
- `robots.txt`
- `sitemap.xml`
- `_redirects` (for platforms like Netlify)
- `.nojekyll` (for GitHub Pages - already handled by deploy workflow)

✅ **Large Media Files**:
- Videos that shouldn't be processed
- Large images not imported in code

### What Should NOT Go in Public

❌ **Assets Imported in Code**:
- Images imported in components
- Icons used in React components
- Assets that benefit from processing

❌ **Build Artifacts**:
- Compiled JavaScript
- Processed CSS
- Generated files

These should go in `src/assets/` instead, where they can be:
- Optimized by the build tool
- Imported with TypeScript
- Bundled efficiently
- Cache-busted with hashed filenames

## File Access

### In HTML

Files in `public/` are accessible from the root path:

```html
<!-- index.html -->
<link rel="icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

### In Code

Reference public files by absolute path:

```typescript
// Not recommended - bypasses build optimizations
<img src="/logo.png" alt="Logo" />

// Better - use src/assets/ and imports
import logo from '@/assets/brand/logo.png';
<img src={logo} alt="Logo" />
```

### After Build

Public files are copied to `dist/`:

```
public/favicon.ico  →  dist/favicon.ico
public/robots.txt   →  dist/robots.txt
```

## Recommended Structure

For a production app, consider this structure:

```
public/
├── favicon.ico                 # Main favicon
├── favicon-16x16.png          # Small favicon
├── favicon-32x32.png          # Medium favicon
├── apple-touch-icon.png       # iOS home screen icon
├── android-chrome-192x192.png # Android icon
├── android-chrome-512x512.png # Android icon (large)
├── site.webmanifest           # PWA manifest
├── robots.txt                 # Search engine instructions
├── sitemap.xml                # Site map for SEO
└── _redirects                 # SPA routing redirects
```

## PWA Configuration

### site.webmanifest

For Progressive Web App support:

```json
{
  "name": "BuyOrRent",
  "short_name": "BuyOrRent",
  "description": "Rent vs Buy comparison tool for Canadian real estate",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/"
}
```

### Reference in HTML

```html
<link rel="manifest" href="/site.webmanifest">
```

## SEO Files

### robots.txt

Control search engine crawlers:

```txt
User-agent: *
Allow: /
Sitemap: https://hamidrezarezaeigithub.github.io/BuyOrRent/sitemap.xml
```

### sitemap.xml

Help search engines index pages:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://hamidrezarezaeigithub.github.io/BuyOrRent/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

## SPA Routing

### For GitHub Pages

The deploy workflow creates `404.html` for client-side routing.

### For Other Platforms

#### Netlify: `_redirects`

```
/*    /index.html   200
```

#### Vercel: `vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## Favicon Best Practices

### Sizes Needed

- **16×16**: Browser tab (retina)
- **32×32**: Browser tab
- **180×180**: Apple touch icon
- **192×192**: Android chrome
- **512×512**: Android chrome (splash)

### Generation

Use a favicon generator:
- https://realfavicongenerator.net/
- https://favicon.io/
- Generate from logo in `src/assets/brand/`

### HTML References

```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
```

## Build Process

### Vite Handling

During `npm run build`:
1. Vite processes `src/` files
2. Vite copies `public/` files to `dist/`
3. No processing applied to public files
4. Files maintain original names (no hashing)

### GitHub Pages Deployment

The deployment workflow:
1. Builds the app (`npm run build`)
2. Creates `dist/404.html` for SPA routing
3. Uploads `dist/` to GitHub Pages
4. Public files accessible at root URL

## Development

### Development Server

During `npm run dev`:
- Public files accessible at `http://localhost:5173/filename`
- Changes require server restart
- No hot reload for public files

## Performance

### Caching

Public files without hashes don't benefit from cache busting:
- Use versioned filenames if content changes
- Or keep files truly static
- For frequently updated assets, use `src/assets/`

### Loading

Public files:
- Loaded on demand (not bundled)
- Separate HTTP requests
- Can be cached by CDN
- No tree-shaking

## Security

### robots.txt

Be careful with sensitive routes:

```txt
User-agent: *
Disallow: /admin
Disallow: /temp
Allow: /
```

### No Sensitive Data

Never put sensitive information in public:
- API keys
- Credentials
- Private data
- Configuration secrets

## Future Additions

Consider adding:
- [ ] Favicons (all sizes)
- [ ] PWA manifest (`site.webmanifest`)
- [ ] PWA icons
- [ ] robots.txt
- [ ] sitemap.xml
- [ ] Open Graph images
- [ ] Social media preview images

## Notes

- Files in `public/` are not processed by Vite
- Copied as-is to `dist/` root
- Accessible via absolute paths (`/filename`)
- No import/TypeScript support
- No hash-based cache busting
- Good for static, unchanging files
- Prefer `src/assets/` for assets used in code
