# pages

Top-level page components for main application routes.

## Purpose

This directory contains the main page components that serve as route endpoints in the application, including the landing page, main app container, and questionnaire page.

## Files Structure

```
src/pages/
├── LandingPage.tsx
├── MainAppPage.tsx
├── QuestionnairePage.tsx
└── index.ts
```

## Page Components

### LandingPage

**Route**: `/`

**Purpose**: The entry point and home page of the application.

**Features**:
- Hero section introducing the app
- Value proposition
- Call-to-action to start questionnaire
- Navigation to app features
- Responsive design
- Theme-aware styling

**Layout**:
- Header with navigation
- Hero section
- Feature highlights
- Footer

**User Flow**: Landing → Questionnaire (via CTA button)

**Styling**: Full-page layout with branded design

### QuestionnairePage

**Route**: `/questionnaire`

**Purpose**: Container page for the multi-step questionnaire flow.

**Features**:
- Loads appropriate situation flow
- Renders question pages based on route
- Progress tracking
- Step indicators
- Navigation controls

**Contains**:
- Progress bar
- Current question page
- Navigation buttons (Back/Next)
- Step counter

**User Flow**: Questionnaire → Specific question pages

**Related Routes**:
- `/situation/1/question/rent`
- `/situation/1/question/purchase`
- `/situation/1/question/investment`

### MainAppPage

**Route**: Multiple (flexible container)

**Purpose**: Main application container/layout wrapper.

**Features**:
- Application shell
- Common layout structure
- Navigation integration
- Theme toggle access
- Responsive layout

**Contains**:
- FlexibleNavbar
- Main content area
- Footer (optional)

**Usage**: Wraps other pages that need standard app layout

## Page Patterns

### Layout Structure

All pages follow a consistent structure:

```typescript
export const PageComponent = () => {
  return (
    <div className="page-container">
      <header>
        {/* Navigation */}
      </header>
      
      <main>
        {/* Page content */}
      </main>
      
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
};
```

### Responsive Design

Pages are mobile-first:
- Single column on mobile
- Multi-column on tablet/desktop
- Touch-friendly controls
- Optimized images and assets

### Theme Integration

All pages support theme system:
- Use theme-aware CSS classes
- Proper contrast in all themes
- Smooth theme transitions

## Routing Configuration

Pages are configured in `AppRouter`:

```typescript
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/questionnaire" element={<QuestionnairePage />} />
  {/* Additional routes */}
</Routes>
```

## Navigation Flow

### Primary User Journey

```
LandingPage (/)
  ↓
QuestionnairePage (/questionnaire)
  ↓
RentQuestions (/situation/1/question/rent)
  ↓
PurchaseQuestions (/situation/1/question/purchase)
  ↓
InvestmentQuestions (/situation/1/question/investment)
  ↓
Results (/situation/1/panel)
```

### Alternative Flows

Users can:
- Navigate back to previous questions
- Return to landing page
- Skip to specific sections (if permitted)

## State Management

Pages interact with:
- **ConfigProvider**: Global configuration state
- **ThemeContext**: Theme preferences
- **globalStep**: Current step tracking
- **progress**: Completion status

## Component Composition

Pages compose smaller components:
- **LandingPage**: Hero, Features, CTA sections
- **QuestionnairePage**: Progress bar, Question containers, Navigation
- **MainAppPage**: Navbar, Content area, Footer

## Usage

Pages are used via routing:

```typescript
import { LandingPage, QuestionnairePage, MainAppPage } from '@/pages';

// In AppRouter
<Route path="/" element={<LandingPage />} />
<Route path="/questionnaire" element={<QuestionnairePage />} />
```

## SEO Considerations

Pages should include:
- Descriptive `<title>` tags
- Meta descriptions
- Semantic HTML structure
- Proper heading hierarchy

## Accessibility

Pages ensure:
- Proper heading levels (h1, h2, h3)
- Skip navigation links
- Keyboard navigation
- ARIA landmarks
- Focus management

## Performance

Pages are optimized for:
- Fast initial load
- Code splitting (lazy loading)
- Efficient re-renders
- Minimal bundle size

## Testing

Page testing focuses on:
- Rendering without errors
- Correct layout structure
- Navigation functionality
- Responsive behavior
- Theme integration

## Related Components

- [`src/components/navbar/`](../components/navbar/README.md) - Navigation components
- [`src/components/situations/1/inputs/`](../components/situations/1/inputs/README.md) - Question pages
- [`src/contexts/`](../contexts/README.md) - Context providers

## Related Files

- [`src/contexts/AppRouter.tsx`](../contexts/AppRouter.tsx) - Route definitions
- [`src/main.tsx`](../main.tsx) - App entry point
- [`src/App.tsx`](../App.tsx) - Root component

## Design System

Pages use:
- Consistent spacing (Tailwind utilities)
- Typography scale
- Color palette from theme
- Component library (shadcn/ui)
- Responsive breakpoints

## Mobile Optimization

- Touch-friendly buttons (min 44x44px)
- Readable font sizes (16px+ base)
- Simplified navigation on mobile
- Progressive disclosure of content
- Fast load times

## Future Enhancements

Potential improvements:
- Additional situation pages
- User dashboard
- Settings page
- Help/FAQ page
- About page
- Contact page
- Terms/Privacy pages

## Notes

- Pages are top-level route components
- Should be lightweight and compose smaller components
- Follow mobile-first design
- Support all theme modes
- Use semantic HTML
- Ensure accessibility
- Optimize for performance
- Test on multiple screen sizes
- Consider SEO for public pages
