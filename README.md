# BuyOrRent

A modern web application built with React 19, Vite 7, and Tailwind CSS 4. This single-page application demonstrates the latest web development technologies with automated deployment to GitHub Pages.

## 🚀 Live Demo

**Published App URL:** [https://hamidrezarezaeigithub.github.io/BuyOrRent/](https://hamidrezarezaeigithub.github.io/BuyOrRent/)

## 🛠️ Tech Stack

### Core Technologies
- **React 19.1.1** - Modern UI framework with latest features
- **TypeScript 5.8.3** - Type safety and enhanced developer experience
- **Vite 7.1.7** - Fast build tool and development server
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **ESLint 9.36.0** - Code linting and quality assurance

### UI & Design System
- **shadcn/ui** - Modern component library with beautiful default styling
- **Radix UI** - Headless, accessible UI primitives
- **Lucide React** - Beautiful & consistent icon library
- **Class Variance Authority** - Building type-safe component APIs
- **Tailwind Merge** - Utility for merging Tailwind CSS classes

### Forms & Validation
- **React Hook Form** - Performant, flexible forms with easy validation
- **@hookform/resolvers** - Validation resolvers for React Hook Form
- **Zod** - TypeScript-first schema declaration and validation

### Routing & Navigation
- **React Router DOM** - Declarative routing for React applications

### Data Visualization
- **Recharts** - Composable charting library built on React components

### Code Quality & Formatting
- **Prettier** - Opinionated code formatter with Tailwind CSS class sorting
- **ESLint** - Code linting and quality assurance

## ✨ Features

### 🎨 Design System
- **Dark/Light Mode Toggle** - Seamless theme switching with system preference detection
- **shadcn/ui Components** - Beautiful, accessible, and customizable components
- **CSS Variables** - Dynamic theming with HSL color space for better color manipulation
- **Brand Colors & Chart Palette** - Consistent color system across the application
- **Responsive Design** - Mobile-first approach with container system

### 🛠️ Developer Experience
- **Absolute Imports** - Clean import paths using `@/` alias
- **TypeScript** - Full type safety across the application
- **Path Mapping** - Organized project structure with clear import paths
- **Component Architecture** - Modular, reusable components with proper separation of concerns

### 🎯 Theme Management
- **React Context** - Centralized theme state management
- **Custom Hooks** - `useTheme()` hook for easy theme access
- **AppProvider** - Aggregated provider pattern for clean component tree
- **Local Storage** - Theme preference persistence across sessions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher (recommended: 20.x)
- **npm** 8.0.0 or higher

## 🔧 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HamidRezaRezaeiGitHub/BuyOrRent.git
   cd BuyOrRent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This will install all necessary packages (~215 packages, takes ~10 seconds).

3. **Verify installation:**
   ```bash
   npm run lint
   npm run build
   ```
   Both commands should complete without errors.

## 🚀 Development

### Start Development Server

```bash
npm run dev
```

This will:
- Start the Vite development server
- Open the application at `http://localhost:5173/`
- Enable hot module replacement for instant updates
- Ready in approximately 200ms

### Available Scripts

| Script | Description | Usage |
|--------|-------------|-------|
| `npm run dev` | Start development server | Local development |
| `npm run build` | Build for production | Creates optimized `dist/` folder |
| `npm run lint` | Run ESLint code analysis | Code quality checks |
| `npm run format` | Format code with Prettier | Auto-format and sort Tailwind classes |
| `npm run preview` | Preview production build | Test built application locally |

### Local Development Workflow

1. **Start development:**
   ```bash
   npm run dev
   ```

2. **Make your changes** in the `src/` directory

3. **Test your changes** in the browser at `http://localhost:5173/`

4. **Lint your code:**
   ```bash
   npm run lint
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview production build:**
   ```bash
   npm run preview
   ```
   Access at `http://localhost:4173/`

## 📁 Project Structure

```
.
├── docs/
│   ├── CONFIG_IMPLEMENTATION.md
│   ├── GLOBAL_STEP_CURSOR.md
│   └── README.md
├── public/
│   ├── README.md
│   └── vite.svg
├── src/
│   ├── assets/
│   │   ├── brand/
│   │   │   ├── README.md
│   │   │   └── [brand logo files]
│   │   └── README.md
│   ├── common/
│   │   ├── ConfigProvider.test.ts
│   │   ├── ConfigProvider.ts
│   │   ├── README.md
│   │   ├── globalStep.test.ts
│   │   ├── globalStep.ts
│   │   ├── progress.test.ts
│   │   ├── progress.ts
│   │   └── useConfig.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── FlexibleInputField.test.tsx
│   │   │   ├── FlexibleInputField.tsx
│   │   │   ├── README.md
│   │   │   ├── Years.test.tsx
│   │   │   ├── Years.tsx
│   │   │   └── index.ts
│   │   ├── inputs/
│   │   │   ├── buy/
│   │   │   │   ├── AssetAppreciationRate.test.tsx
│   │   │   │   ├── AssetAppreciationRate.tsx
│   │   │   │   ├── ClosingCosts*.tsx
│   │   │   │   ├── DownPayment*.tsx
│   │   │   │   ├── Maintenance*.tsx
│   │   │   │   ├── MortgageLength.tsx
│   │   │   │   ├── MortgageRate.tsx
│   │   │   │   ├── PropertyTax*.tsx
│   │   │   │   ├── PurchasePrice.tsx
│   │   │   │   └── README.md
│   │   │   ├── invest/
│   │   │   │   ├── InvestmentReturn.test.tsx
│   │   │   │   ├── InvestmentReturn.tsx
│   │   │   │   ├── InvestmentReturnHelperDrawer.tsx
│   │   │   │   └── README.md
│   │   │   ├── rent/
│   │   │   │   ├── MonthlyRent.test.tsx
│   │   │   │   ├── MonthlyRent.tsx
│   │   │   │   ├── README.md
│   │   │   │   ├── RentIncrease.test.tsx
│   │   │   │   └── RentIncrease.tsx
│   │   │   ├── PercentageAmountSwitch.test.tsx
│   │   │   ├── PercentageAmountSwitch.tsx
│   │   │   └── README.md
│   │   ├── navbar/
│   │   │   ├── Avatar.tsx
│   │   │   ├── FlexibleNavbar.test.tsx
│   │   │   ├── FlexibleNavbar.tsx
│   │   │   ├── LoginButton.tsx
│   │   │   ├── Logo.tsx
│   │   │   ├── README.md
│   │   │   ├── SignUpButton.tsx
│   │   │   ├── dependencies.ts
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   ├── outputs/
│   │   │   ├── rent/
│   │   │   │   ├── CompactMonthlyRentGraph.tsx
│   │   │   │   ├── CompactMonthlyRentTable.test.tsx
│   │   │   │   ├── CompactMonthlyRentTable.tsx
│   │   │   │   ├── MonthlyRentGraph.test.tsx
│   │   │   │   ├── MonthlyRentGraph.tsx
│   │   │   │   ├── MonthlyRentTable.test.tsx
│   │   │   │   ├── MonthlyRentTable.tsx
│   │   │   │   └── README.md
│   │   │   └── README.md
│   │   ├── situations/
│   │   │   ├── 1/
│   │   │   │   ├── inputs/
│   │   │   │   │   ├── InvestmentInformation.tsx
│   │   │   │   │   ├── InvestmentQuestions.test.tsx
│   │   │   │   │   ├── InvestmentQuestions.tsx
│   │   │   │   │   ├── PurchaseInformation.tsx
│   │   │   │   │   ├── PurchaseQuestions.test.tsx
│   │   │   │   │   ├── PurchaseQuestions.tsx
│   │   │   │   │   ├── README.md
│   │   │   │   │   ├── RentQuestions.test.tsx
│   │   │   │   │   ├── RentQuestions.tsx
│   │   │   │   │   ├── RentalInformation.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── outputs/
│   │   │   │   │   ├── BuyAnalysis.tsx
│   │   │   │   │   ├── ComparisonAnalysis.tsx
│   │   │   │   │   ├── README.md
│   │   │   │   │   ├── RentAnalysis.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── README.md
│   │   │   │   └── index.ts
│   │   │   ├── README.md
│   │   │   ├── Situation1.tsx
│   │   │   └── index.ts
│   │   ├── theme/
│   │   │   ├── README.md
│   │   │   ├── ThemeShowcase.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── index.ts
│   │   ├── ui/
│   │   │   ├── accordion.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── field.tsx
│   │   │   ├── input-group.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── resizable.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toggle.tsx
│   │   │   └── tooltip.tsx
│   │   └── README.md
│   ├── config/
│   │   ├── journey/
│   │   │   ├── README.md
│   │   │   └── situation1.manifest.json
│   │   ├── README.md
│   │   └── config-canada.ts
│   ├── contexts/
│   │   ├── AppProviders.tsx
│   │   ├── AppRouter.tsx
│   │   ├── README.md
│   │   ├── RouterProvider.tsx
│   │   ├── ThemeContext.README.md
│   │   ├── ThemeContext.test.tsx
│   │   ├── ThemeContext.tsx
│   │   └── index.ts
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── MainAppPage.tsx
│   │   ├── QuestionnairePage.tsx
│   │   ├── README.md
│   │   └── index.ts
│   ├── services/
│   │   ├── formatting/
│   │   │   ├── FormattingService.test.ts
│   │   │   ├── FormattingService.ts
│   │   │   ├── README.md
│   │   │   └── index.ts
│   │   ├── validation/
│   │   │   ├── README.md
│   │   │   ├── ValidationService.test.ts
│   │   │   ├── ValidationService.ts
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   ├── useSmartFieldValidation.test.ts
│   │   │   └── useSmartFieldValidation.ts
│   │   ├── MonthlyRentCalculator.test.ts
│   │   ├── MonthlyRentCalculator.ts
│   │   ├── MortgageAmortizationCalculator.test.ts
│   │   ├── MortgageAmortizationCalculator.ts
│   │   └── README.md
│   ├── test/
│   │   ├── __mocks__/
│   │   │   ├── README.md
│   │   │   └── fileMock.js
│   │   ├── README.md
│   │   ├── assets.d.ts
│   │   └── setupTests.ts
│   ├── utils/
│   │   ├── README.md
│   │   └── utils.ts
│   ├── App.tsx
│   ├── README.md
│   ├── index.css
│   ├── jest-dom.d.ts
│   ├── main.tsx
│   ├── setupTests.ts
│   └── vite-env.d.ts
├── .github/
│   ├── copilot-instructions.md
│   └── workflows/
│       └── deploy.yml
├── README.md                   # This file
├── components.json
├── eslint.config.js
├── index.html
├── jest.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### Key Architecture Decisions

- **Absolute Imports**: Using `@/` alias for clean import paths
- **Component Organization**: UI components separated by type (ui/, navigation/, etc.)
- **Provider Pattern**: Centralized state management with AppProvider
- **Design Tokens**: CSS variables for consistent theming
- **Type Safety**: Full TypeScript coverage with proper type definitions

## 🎨 Theme System

### Dark/Light Mode Toggle

The application includes a comprehensive theme system with support for:

- **Light Mode**: Clean, bright interface with high contrast
- **Dark Mode**: Dark background with light text for reduced eye strain  
- **System Mode**: Automatically follows user's OS preference

### Usage

The theme toggle button in the navigation cycles through:
1. **Light** → **Dark** → **System** → **Light** (repeat)

### Theme Persistence

Theme preferences are automatically saved to localStorage and restored on page reload.

### CSS Variables

The theme system uses CSS custom properties for dynamic color switching:

```css
/* Light mode colors */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... additional color tokens */
}

/* Dark mode colors */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  /* ... additional color tokens */
}
```

### Chart Color Palette

Dedicated color variables for data visualization:
- `--chart-1` through `--chart-5`: Consistent colors for charts and graphs
- Optimized for both light and dark themes
- Accessible color contrast ratios

## 🚀 Deployment

### GitHub Actions Workflow

The application uses GitHub Actions for automated deployment to GitHub Pages:

**Workflow Location:** `.github/workflows/deploy.yml`

**Trigger Events:**
- Push to `main` or `master` branch
- Manual workflow dispatch

**Deployment Process:**
1. **Setup:** Ubuntu latest environment with Node.js 18
2. **Install:** Dependencies via `npm install`
3. **Build:** Production build via `npm run build`
4. **SPA Support:** Creates `404.html` for client-side routing
5. **Deploy:** Uploads `dist/` folder to GitHub Pages via GitHub Actions artifact deployment

**Build Time:** ~1-2 minutes total

### GitHub Pages Configuration

To set up GitHub Pages for this repository:

1. **Repository Settings:**
   - Go to your repository → Settings → Pages
   - **Source:** GitHub Actions
   - The workflow automatically deploys to GitHub Pages using the modern artifact-based method

2. **Required Permissions:**
   - The workflow has proper permissions configured:
     ```yaml
     permissions:
       contents: read
       pages: write
       id-token: write
     ```

3. **Base Path Configuration:**
   - The `vite.config.ts` is configured with `base: '/BuyOrRent/'`
   - This matches the repository name for proper GitHub Pages routing

### Manual Deployment

If needed, you can deploy manually:

```bash
# Build the project
npm run build

# The dist/ folder contains all files needed for deployment
# Upload contents of dist/ to your hosting provider
```

## 🔗 URLs & Links

- **Development Server:** http://localhost:5173/
- **Preview Server:** http://localhost:4173/
- **Production URL:** https://hamidrezarezaeigithub.github.io/BuyOrRent/
- **Repository:** https://github.com/HamidRezaRezaeiGitHub/BuyOrRent

## 🐛 Troubleshooting

### Common Issues

**Build Failures:**
- Ensure all TypeScript errors are resolved
- Check that all dependencies are installed: `npm install`
- Verify Node.js version: `node --version`

**Development Server Issues:**
- Port 5173 might be in use - Vite will automatically try the next available port
- Clear browser cache if changes aren't reflecting

**Deployment Issues:**
- Verify GitHub Pages is enabled in repository settings
- Check that the workflow has proper permissions
- Ensure the `base` path in `vite.config.ts` matches your repository name

### Build Performance

- **Development:** Hot reload in ~200ms
- **Production Build:** ~3 seconds
- **Full CI/CD Pipeline:** ~1-2 minutes

## 📄 License

This project is private and intended for demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Run linting: `npm run lint`
5. Build successfully: `npm run build`
6. Commit your changes: `git commit -m 'Add feature'`
7. Push to the branch: `git push origin feature-name`
8. Submit a pull request