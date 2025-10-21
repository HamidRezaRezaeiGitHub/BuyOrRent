# utils

Utility functions and helper modules used throughout the application.

## Purpose

This directory contains general-purpose utility functions that are shared across the application, including class name manipulation and other common helpers.

## Files Structure

```
src/utils/
└── utils.ts
```

## Utility Functions

### cn (className utility)

**Purpose**: Intelligently merge and deduplicate Tailwind CSS class names.

**Function**:
```typescript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Features**:
- Combines multiple class name sources
- Handles conditional classes
- Deduplicates conflicting Tailwind classes
- Resolves class precedence correctly

**Usage Examples**:

```typescript
import { cn } from '@/utils/utils';

// Basic usage
cn('text-red-500', 'font-bold')
// → 'text-red-500 font-bold'

// Conditional classes
cn('base-class', condition && 'conditional-class')
// → 'base-class conditional-class' (if condition is true)
// → 'base-class' (if condition is false)

// Conflicting classes (Tailwind-aware)
cn('text-red-500', 'text-blue-500')
// → 'text-blue-500' (last class wins)

// Array syntax
cn(['text-sm', 'font-medium'], 'text-blue-600')
// → 'text-sm font-medium text-blue-600'

// Object syntax
cn({ 'text-red-500': isError, 'text-green-500': isSuccess })
// → 'text-red-500' (if isError is true)
// → 'text-green-500' (if isSuccess is true)
```

### Real-World Component Usage

```typescript
// Button with conditional styling
const Button = ({ variant, size, className, ...props }) => {
  return (
    <button
      className={cn(
        // Base styles
        'rounded font-medium',
        // Variant styles
        {
          'bg-primary text-white': variant === 'primary',
          'bg-secondary text-gray-700': variant === 'secondary',
          'border border-gray-300': variant === 'outline',
        },
        // Size styles
        {
          'px-3 py-1 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        // Custom classes from props
        className
      )}
      {...props}
    />
  );
};

// Input with error state
const Input = ({ hasError, className, ...props }) => {
  return (
    <input
      className={cn(
        'border rounded px-3 py-2',
        hasError && 'border-red-500 focus:border-red-500',
        !hasError && 'border-gray-300 focus:border-blue-500',
        className
      )}
      {...props}
    />
  );
};
```

## Why Use cn()?

### Problem Without cn()

```typescript
// ❌ Manual concatenation (error-prone)
className={`base-class ${condition ? 'conditional' : ''} ${customClass}`}

// ❌ Conflicting Tailwind classes not resolved
className="text-red-500 text-blue-500"  // Both applied, unpredictable result
```

### Solution With cn()

```typescript
// ✅ Clean, reliable class merging
className={cn('base-class', condition && 'conditional', customClass)}

// ✅ Tailwind conflicts resolved correctly
className={cn('text-red-500', 'text-blue-500')}  // → 'text-blue-500'
```

## Dependencies

The `cn` utility relies on two packages:

### clsx

**Purpose**: Conditional class name builder

**Features**:
- Handles strings, arrays, objects
- Filters falsy values
- Lightweight and fast

**Example**:
```typescript
clsx('foo', true && 'bar', 'baz')
// → 'foo bar baz'
```

### tailwind-merge

**Purpose**: Intelligently merges Tailwind CSS classes

**Features**:
- Resolves conflicting utility classes
- Understands Tailwind's specificity rules
- Handles responsive and state variants

**Example**:
```typescript
twMerge('px-2 py-1', 'px-4')
// → 'py-1 px-4' (later px-4 overrides px-2)
```

## Integration with shadcn/ui

The `cn` utility is essential for shadcn/ui components:

```typescript
// shadcn/ui Button component uses cn
import { cn } from '@/utils/utils';

const Button = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
});
```

## Best Practices

### Use cn() for Component Styling

```typescript
// ✅ Good: Uses cn() for flexibility
const Card = ({ className, ...props }) => (
  <div className={cn('rounded-lg border bg-card', className)} {...props} />
);

// ❌ Avoid: Hard-coded classes without cn()
const Card = ({ className, ...props }) => (
  <div className={`rounded-lg border bg-card ${className}`} {...props} />
);
```

### Organize Classes by Purpose

```typescript
// ✅ Good: Organized and readable
cn(
  // Layout
  'flex items-center gap-2',
  // Styling
  'rounded-md border bg-white',
  // Typography
  'text-sm font-medium',
  // Conditional
  isActive && 'bg-blue-50 border-blue-500',
  // Custom
  className
)
```

### Handle Variants Consistently

```typescript
// ✅ Good: Use object syntax for variants
cn({
  'bg-primary text-white': variant === 'primary',
  'bg-secondary text-gray-700': variant === 'secondary',
  'bg-destructive text-white': variant === 'destructive',
})

// ✅ Alternative: Use CVA (Class Variance Authority)
import { cva } from 'class-variance-authority';

const buttonVariants = cva('base-styles', {
  variants: {
    variant: {
      primary: 'bg-primary text-white',
      secondary: 'bg-secondary text-gray-700',
    },
  },
});
```

## Performance

The `cn` utility is:
- **Fast**: Minimal overhead
- **Efficient**: Only processes classes when called
- **Cacheable**: Results can be memoized if needed

## TypeScript Support

Full TypeScript support via `ClassValue` type:

```typescript
import { type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

## Adding More Utilities

To add new utility functions:

1. Add function to `utils.ts`
2. Export the function
3. Document usage
4. Add tests if complex
5. Update this README

Example:
```typescript
// utils.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-CA');
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str;
}
```

## Related Files

- [`src/components/ui/`](../components/ui/) - shadcn/ui components using cn()
- [`tailwind.config.js`](../../tailwind.config.js) - Tailwind configuration
- [`src/index.css`](../index.css) - Global styles and CSS variables

## Testing

While `cn()` is a thin wrapper, consider testing:
- Complex conditional logic using cn()
- Custom utility functions
- Integration with components

## Future Utilities

Potential additions:
- Date formatting utilities
- String manipulation helpers
- Number formatting (beyond FormattingService)
- Array/object helpers
- Validation helpers
- URL/path utilities

## Notes

- `cn()` is the most used utility in the app
- Essential for component styling flexibility
- Integrates seamlessly with Tailwind CSS
- Required by shadcn/ui components
- Lightweight and performant
- TypeScript-friendly
- Easy to extend with new utilities
