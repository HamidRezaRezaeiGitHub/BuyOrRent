# BuyOrRent - React + Vite + Tailwind CSS Application

BuyOrRent is a modern web application built with React 19, Vite 7, and Tailwind CSS 4. The application is a single-page application that can be developed, built, and deployed as a static website.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Prerequisites
- Node.js 20.19.5+ (confirmed working)
- npm 10.8.2+ (confirmed working)

### Bootstrap, Build, and Test the Repository
Run these commands in sequence for a fresh setup:

1. **Install dependencies:**
   ```bash
   npm install
   ```
   - Takes approximately 10 seconds
   - Installs 215 packages
   - No vulnerabilities found in current dependency tree

2. **Build the application:**
   ```bash
   npm run build
   ```
   - Takes approximately 3 seconds
   - NEVER CANCEL: Set timeout to 60+ seconds for safety
   - Runs TypeScript compilation (`tsc -b`) followed by Vite build
   - Outputs to `dist/` directory with optimized assets

3. **Run linting:**
   ```bash
   npm run lint
   ```
   - Takes approximately 1 second
   - Uses ESLint with TypeScript support
   - Includes React hooks and React refresh plugins
   - Must pass before committing changes

### Development Workflow

**Start development server:**
```bash
npm run dev
```
- Starts Vite development server on http://localhost:5173/
- Hot module replacement enabled
- Ready in approximately 200ms
- NEVER CANCEL: Server runs indefinitely until stopped

**Preview production build:**
```bash
npm run preview
```
- Serves the built application from `dist/` directory
- Runs on http://localhost:4173/
- Must run `npm run build` first

## Validation

### Manual Testing Scenarios
After making changes, ALWAYS perform these validation steps:

1. **Basic functionality test:**
   - Start development server with `npm run dev`
   - Navigate to http://localhost:5173/
   - Verify the page displays "Hello, world!" heading
   - Verify the welcome message: "Welcome to BuyOrRent - A React + Vite + Tailwind CSS application"
   - Confirm Tailwind CSS styling is applied correctly (centered content, gray background)

2. **Build validation:**
   - Run full build process: `npm run build`
   - Verify no TypeScript errors
   - Verify Vite build completes successfully
   - Check `dist/` directory contains optimized assets

3. **Code quality validation:**
   - Run `npm run lint` and ensure no errors
   - All linting rules must pass before committing

### Required Pre-commit Checks
ALWAYS run before committing changes:
```bash
npm run lint && npm run build
```
- Linting takes ~1 second
- Build takes ~3 seconds
- Both must succeed for CI compatibility

## Project Structure

### Key Directories and Files
```
/
├── src/                    # Source code
│   ├── App.tsx            # Main application component
│   ├── App.css            # Component-specific styles
│   ├── main.tsx           # React application entry point
│   ├── index.css          # Global styles (Tailwind imports)
│   ├── vite-env.d.ts      # Vite type definitions
│   └── assets/            # Static assets (images, etc.)
├── public/                # Public static files
│   └── vite.svg           # Vite logo
├── dist/                  # Build output (generated)
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── eslint.config.js       # ESLint configuration
├── tsconfig.json          # TypeScript configuration (references)
├── tsconfig.app.json      # TypeScript app configuration
└── tsconfig.node.json     # TypeScript Node.js configuration
```

### Important Files to Monitor
When making changes, always check these files for consistency:
- **src/App.tsx** - Main component logic
- **src/index.css** - Contains Tailwind CSS imports
- **package.json** - For script definitions and dependencies
- **vite.config.ts** - Build and development server configuration

## Technology Stack

### Core Technologies
- **React 19.1.1** - UI framework
- **TypeScript 5.8.3** - Type safety
- **Vite 7.1.7** - Build tool and development server
- **Tailwind CSS 4.1.13** - Utility-first CSS framework

### Development Tools
- **ESLint 9.36.0** - Code linting with React and TypeScript rules
- **PostCSS 8.5.6** - CSS processing for Tailwind
- **Autoprefixer 10.4.21** - CSS vendor prefixing

### Available npm Scripts
```json
{
  "dev": "vite",                    // Development server
  "build": "tsc -b && vite build", // Production build
  "lint": "eslint .",               // Code linting
  "preview": "vite preview"         // Preview production build
}
```

## Common Tasks

### Typical Development Workflow
1. `npm install` (first time setup)
2. `npm run dev` (start development)
3. Make code changes
4. Verify in browser at http://localhost:5173/
5. `npm run lint` (check code quality)
6. `npm run build` (verify production build)
7. Commit changes

### Troubleshooting
- **Build failures:** Check TypeScript errors first, then Vite configuration
- **Styling issues:** Verify Tailwind classes and check `src/index.css` imports
- **Linting errors:** Fix ESLint issues before committing
- **Port conflicts:** Default dev server port is 5173, preview port is 4173

### Performance Notes
- **Development server:** Starts in ~200ms
- **Hot reload:** Near-instant for most changes
- **Production build:** Generates optimized bundles with tree-shaking
- **Asset optimization:** Vite automatically handles CSS/JS minification

## Timing Expectations

All timing measurements based on validated testing:

| Command | Expected Time | Timeout Setting |
|---------|---------------|-----------------|
| `npm install` | ~10 seconds | 300 seconds |
| `npm run build` | ~3 seconds | 60 seconds |
| `npm run lint` | ~1 second | 30 seconds |
| `npm run dev` | ~200ms to start | N/A (runs indefinitely) |
| `npm run preview` | ~immediate | N/A (runs indefinitely) |

**NEVER CANCEL** any build or long-running commands. Always wait for completion.

## Common Tasks Reference

The following are outputs from frequently run commands. Reference them instead of viewing, searching, or running bash commands to save time.

### Repository Root Directory Listing
```bash
ls -la
```
```
.git/
.gitignore
.github/
README.md
dist/                      # Build output (after npm run build)
eslint.config.js
index.html
node_modules/              # Dependencies (after npm install)
package-lock.json          # Dependency lock file (after npm install)
package.json
postcss.config.js
public/
src/
tailwind.config.js
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```

### Key Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### Build Output Structure (dist/)
After running `npm run build`:
```
dist/
├── assets/
│   ├── index-[hash].css    # Compiled and minified CSS
│   └── index-[hash].js     # Compiled and minified JavaScript
├── index.html              # Main HTML entry point
└── vite.svg               # Static assets
```

## Component Development Patterns

### Field Components with Validation
The application follows a consistent pattern for form field components with built-in validation and formatting:

1. **Base Structure**: All field components extend `BaseFieldProps` interface
2. **Smart Validation Integration**: Use `useSmartFieldValidation` hook for consistent validation behavior
3. **Shadcn UI Components**: Leverage `Input`, `Label`, `Tooltip` and other shadcn components
4. **Lucide React Icons**: Use appropriate icons (e.g., `DollarSign` for currency, `Info` for tooltips)
5. **Mobile-First Design**: Short labels with detailed tooltip content for comprehensive information

### Example: MonthlyRent Component
Located in `src/components/rent/MonthlyRent.tsx`:
- **Currency Formatting**: Canadian dollar formatting with `Intl.NumberFormat`
- **Dual Value Management**: Separate display value (formatted string) and actual value (number)
- **Focus/Blur Behavior**: Unformatted during editing, formatted when blurred
- **Validation Rules**: Required, positive number, max value checks
- **Tooltip**: Descriptive information accessible via info icon

### Testing Pattern
All field components should have comprehensive test coverage:
- Basic rendering and props
- User interaction (change, focus, blur)
- Validation behavior (required, optional, error display)
- Formatting (if applicable)
- Integration tests combining multiple features

**Test Configuration**:
- Jest with ts-jest preset
- React Testing Library
- Type checking diagnostic code 2339 ignored for jest-dom matchers
- Tests run with: `npm test -- <ComponentName>.test`

### Dependencies for Field Components
```bash
npm install @radix-ui/react-tooltip  # For tooltip functionality
```

## Circumstance-Specific Development

The application supports multiple circumstances (scenarios) that users can choose from, with each circumstance having its own unique UI and logic.

### Circumstance Structure
- **Location**: `src/components/circumstances/`
- **Naming Convention**: `Circumstance<Number>.tsx` (e.g., `Circumstance1.tsx`, `Circumstance2.tsx`)
- **Purpose**: Each circumstance file contains a complete page implementation for a specific user scenario

### Working with Circumstances

When a task mentions a circumstance by name or number (e.g., "Circumstance 1", "Circumstance1", or just "1"), apply changes to the corresponding file:
- **Circumstance 1** → `src/components/circumstances/Circumstance1.tsx`
- **Circumstance 2** → `src/components/circumstances/Circumstance2.tsx`
- And so on...

### Current Circumstances
- **Circumstance1**: The default scenario containing the full BuyOrRent analysis page with rental and purchase information, tables, and graphs

### Creating New Circumstances
1. Create a new file: `src/components/circumstances/Circumstance<N>.tsx`
2. Export the component in `src/components/circumstances/index.ts`
3. Import and use in `MainAppPage.tsx` or router as needed
4. Follow the same structure and patterns as existing circumstances

### Integration Point
The `MainAppPage` component (in `src/pages/MainAppPage.tsx`) serves as the entry point that imports and renders the appropriate circumstance component based on user selection or routing logic.