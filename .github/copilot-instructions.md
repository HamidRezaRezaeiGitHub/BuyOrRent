# BuyOrRent - GitHub Copilot Instructions

## Project Summary

BuyOrRent is a React + Vite + Tailwind + shadcn/ui deployed to GitHub Pages. It helps Canadian users compare Rent + Invest vs Buy through a story-first questionnaire (Rent → Purchase → Investment), then shows results (tables/graphs). The default flow is Situation 1: currently renting, considering buying.

---

## Audience, UX Principles, and Story Flow

**Audience:** General public first; power users can fine-tune inputs later.

**UX:** One clear question per slide; defaults available; plain-language copy; mobile-first.

**Story order:** Rent → Purchase → Investment → Results.

**Required vs optional:** Current monthly rent & purchase price are required; others allow "Use default."

**Canadian defaults:** sensible, conservative placeholders (e.g., rent increase ~2.5%, amortization 25y, etc.).

---

## Technical Stack & Conventions

- **Framework:** React 19 + TypeScript 5 + Vite 7
- **Styling:** Tailwind CSS 4 + shadcn/ui (`src/components/ui/`)
- **Testing:** Jest + React Testing Library (co-located with components)
- **Forms:** React Hook Form + Zod validation
- **Routing:** React Router 7
- **Code Quality:** ESLint + Prettier (with Tailwind class sorting)
- **Deployment:** GitHub Pages (base: `/BuyOrRent/`)

### Key Configurations
- **TypeScript:** Strict mode, path mapping `@/*` → `./src/*`
- **Node version:** 20.x+ recommended for development

---

## Code Patterns

- **Imports:** Use `@/` alias for absolute imports
- **Styling:** Mobile-first Tailwind classes, shadcn/ui components
- **State:** React Context for shared state, local state for component-specific
- **Testing:** Co-locate tests with components (`.test.tsx`)
- **Validation:** Zod schemas with React Hook Form

---

## Step-by-Step Development Workflow

### Step 1: Review Project Context
**ALWAYS START HERE** before making any changes:

1. **Read root README.md** - Single source of truth for structure and build instructions
2. **Identify change scope**
3. **Check relevant package READMEs** - Domain-specific documentation in each folder

### Step 2: Implement Changes

**A. Research Phase**
- Review existing patterns for similar functionality

**B. Mobile-First Implementation Standards**
- Design for mobile devices first + touch-friendly interactions
- Use Tailwind CSS with responsive breakpoints
- Use shadcn/ui components for consistency

**C. Component Guidelines**
- Build reusable, context-independent components
- Use React Context for shared state
- Apply proper prop typing with TypeScript
- Follow existing component structure patterns

**D. Testing Requirements** (MANDATORY)
- Co-locate test files with components (e.g., `Component.test.tsx`)
- Test user interactions, not implementation details
- Follow existing test patterns and matchers
- All tests must pass before committing

**E. Documentation Requirements**
- Update component README when adding/modifying components following existing style
- Include component description. Not much code details.

### Step 3: Build Process

```bash
npm install           # Install dependencies
npm run lint          # Check code quality
npm run build         # Create production build
npm test              # Run test suite
```

### Step 4: Validation

1. **Lint Check:** `npm run lint` (must pass)
2. **Test Locally:** `npm run dev` - **TERMINATE when done**
3. **Build Check:** `npm run build` (must succeed)
4. **Screenshots:** Include mobile-width screenshots in PR description (if applicable)

### Step 5: Documentation Updates

After implementing changes:

1. **Update root README.md** if new files/folders created
2. **Update/create folder README.md** for new folders with multiple files
3. **Keep formatting consistent** with existing README style
4. **Document business context**, not code details