# components/theme

Theme-related components for theme toggle and theme showcase.

## Purpose

This directory contains components for managing and displaying theme options, including theme toggle controls and a showcase/demo page for theme testing.

## Files Structure

```
src/components/theme/
├── README.md
├── ThemeShowcase.tsx
├── ThemeToggle.tsx
└── index.ts
```

## Components

### ThemeToggle

**Purpose**: UI control for switching between light/dark/system themes.

**Features**:
- Toggle between light, dark, and system modes
- Displays current theme state
- Smooth theme transitions
- Icon-based UI
- Accessible button
- Theme persistence

**Variants** (typically):
Multiple theme toggle variants may exist:
- **Compact**: Icon only, minimal space
- **Dropdown**: Full menu with all options
- **Switch**: Toggle switch style
- **Button**: Text button style

**Basic Usage**:
```typescript
import { ThemeToggle } from '@/components/theme';

const Header = () => {
  return (
    <header>
      <nav>
        {/* Other nav items */}
        <ThemeToggle />
      </nav>
    </header>
  );
};
```

**Integration with ThemeContext**:
```typescript
import { useTheme } from '@/contexts';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    const modes = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % modes.length;
    setTheme(modes[nextIndex]);
  };
  
  return (
    <button onClick={toggleTheme}>
      {/* Icon based on current theme */}
    </button>
  );
};
```

**Accessibility**:
- Proper ARIA labels
- Keyboard accessible
- Focus visible
- Screen reader friendly

### ThemeShowcase

**Route**: `/temp/theme` (development/testing route)

**Purpose**: Demonstration and testing page for theme system.

**Features**:
- Displays all theme modes
- Shows component examples in each theme
- Tests theme transitions
- Validates color contrast
- Demonstrates theme-aware components

**Sections**:
1. **Theme Controls**: Toggle between themes
2. **Color Palette**: All theme colors displayed
3. **Component Showcase**: Buttons, inputs, cards in current theme
4. **Typography**: Text styles in current theme
5. **Charts**: Chart colors in current theme

**Usage**:
```typescript
// Accessed via development route
// Navigate to: /temp/theme
```

**Content Examples**:
- Primary, secondary, accent colors
- Background and foreground colors
- Border colors
- Destructive/error colors
- Muted colors
- Chart color palette
- Component states (hover, active, disabled)

**Purpose in Development**:
- Validate theme implementation
- Test color contrast ratios
- Ensure component compatibility
- Debug theme issues
- Demonstrate theme capabilities

## Theme System Integration

These components integrate with the ThemeContext:

```
ThemeContext (contexts/)
  ↓ provides
useTheme() hook
  ↓ consumed by
ThemeToggle, ThemeShowcase
  ↓ updates
CSS Variables (index.css)
  ↓ applied to
All Components
```

## Theme Modes

### Light Mode
- Bright backgrounds
- Dark text
- High contrast
- Professional appearance

### Dark Mode
- Dark backgrounds
- Light text
- Reduced eye strain
- Modern aesthetic

### System Mode
- Follows OS preference
- Automatic switching
- Best of both worlds
- User convenience

## CSS Variable System

Theme components work with CSS variables defined in `src/index.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  /* ... more variables */
}
```

## Usage in Components

### Using Theme Toggle

```typescript
import { ThemeToggle } from '@/components/theme';

// In a navbar
<FlexibleNavbar
  showThemeToggle={true}
  ThemeToggleComponent={ThemeToggle}
/>

// Standalone
<div className="header-actions">
  <ThemeToggle />
</div>
```

### Accessing Theme in Components

```typescript
import { useTheme } from '@/contexts';

const MyComponent = () => {
  const { theme, effectiveTheme } = useTheme();
  
  return (
    <div>
      Current Setting: {theme}
      Currently Displaying: {effectiveTheme}
    </div>
  );
};
```

## Styling Considerations

### Theme-Aware Classes

Components should use theme-aware Tailwind classes:

```typescript
// ✅ Good: Uses theme-aware classes
<div className="bg-background text-foreground border-border">
  Content adapts to theme
</div>

// ❌ Avoid: Hard-coded colors
<div className="bg-white text-black border-gray-200">
  Doesn't adapt to theme
</div>
```

### Common Theme Classes

- `bg-background` / `bg-foreground`
- `text-foreground` / `text-muted-foreground`
- `border-border`
- `bg-card` / `bg-popover`
- `bg-primary` / `text-primary`
- `bg-secondary` / `text-secondary`
- `bg-accent` / `text-accent`
- `bg-destructive` / `text-destructive`

## Testing Theme Components

### Manual Testing

1. Visit `/temp/theme`
2. Toggle between themes
3. Verify all colors update
4. Check component states
5. Validate contrast ratios

### Automated Testing

Theme components should test:
- Theme switching functionality
- localStorage persistence
- System preference detection
- Component re-rendering
- CSS variable application

## Accessibility

### Color Contrast

All themes must maintain WCAG AA compliance:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- UI components: 3:1 contrast ratio

### High Contrast Mode

Support for high contrast mode:
- Enhanced borders
- Increased contrast
- Clear focus indicators

### User Preferences

Respect user preferences:
- System theme preference
- Reduced motion
- High contrast settings

## Performance

Theme system is optimized:
- CSS variables for instant switching
- No component re-mounting
- Minimal JavaScript execution
- Smooth transitions

## Related Components

- [`../navbar/`](../navbar/README.md) - Navigation with theme toggle
- [`../../contexts/ThemeContext.tsx`](../../contexts/ThemeContext.tsx) - Theme state management
- [`../../index.css`](../../index.css) - Theme CSS variables

## Configuration Files

- [`tailwind.config.js`](../../../tailwind.config.js) - Tailwind theme configuration
- [`src/index.css`](../../index.css) - CSS variables and theme definitions

## Browser Support

Theme system works in all modern browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers

Uses:
- CSS Custom Properties (CSS Variables)
- localStorage API
- matchMedia API (system preference)

## Future Enhancements

Potential improvements:
- Additional theme variants (sepia, high contrast)
- Custom theme builder
- Theme export/import
- Per-page theme override
- Animated theme transitions
- Theme preview before applying

## Notes

- Theme preference persists in localStorage
- System mode auto-updates on OS change
- All components must support both themes
- Use theme-aware CSS classes
- Test in both light and dark modes
- ThemeShowcase is development-only
- Theme toggle can have multiple implementations
- CSS variables enable instant theme switching
- Focus on accessibility and contrast
