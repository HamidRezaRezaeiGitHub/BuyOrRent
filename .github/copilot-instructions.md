# BuyOrRent - GitHub Copilot Instructions

## 1) Project Summary

BuyOrRent is a React + Vite + Tailwind + shadcn/ui deployed to GitHub Pages. It helps Canadian users compare Rent + Invest vs Buy through a story-first questionnaire (Rent → Purchase → Investment), then shows results (tables/graphs). The default flow is Situation 1: currently renting, considering buying.

---

## 2) Audience, UX Principles, and Story Flow

**Audience:** General public first; power users can fine-tune inputs later.

**UX:** One clear question per slide; defaults available; plain-language copy; mobile-first.

**Story order:** Rent → Purchase → Investment → Results.

**Required vs optional:** Current monthly rent & purchase price are required; others allow "Use default."

**Canadian defaults:** sensible, conservative placeholders (e.g., rent increase ~2.5%, amortization 25y, etc.).

---

## 3) Technical Stack & Conventions

- **Node & npm versions:** 20.x+ recommended (npm 8.0.0+)
- **React ecosystem:** 
  - React 19.1.1
  - React DOM 19.1.1
  - React Router 7.9.1
- **Vite version:** 7.1.7
- **Tailwind version:** 4.1.13
- **shadcn/ui usage:** Present under `src/components/ui/` (accordion, avatar, badge, button, card, carousel, chart, dialog, drawer, dropdown-menu, field, input-group, input, label, navigation-menu, popover, progress, radio-group, separator, slider, switch, table, tabs, textarea, toggle, tooltip, etc.)
- **ESLint config:** `eslint.config.js` using `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- **TypeScript config:** 
  - Main: `tsconfig.json` (references `tsconfig.app.json` and `tsconfig.node.json`)
  - App: `tsconfig.app.json` (target: ES2022, jsx: react-jsx, strict mode, path mapping `@/*` → `./src/*`)
  - Node: `tsconfig.node.json` (for config files)
- **Testing stack:** Jest 30.1.3 + React Testing Library 16.3.0 + ts-jest 29.4.4, jsdom environment
- **Deployment target:** GitHub Pages (workflow: `.github/workflows/deploy.yml`, Node 18, base path: `/BuyOrRent/`)

---

## 4) File & Folder Anatomy

```
.
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── common/
│   │   │   ├── FlexibleInputField.tsx
│   │   │   ├── Years.tsx
│   │   │   └── index.ts
│   │   ├── inputs/
│   │   │   ├── buy/
│   │   │   ├── invest/
│   │   │   ├── rent/
│   │   │   └── PercentageAmountSwitch.tsx
│   │   ├── navbar/
│   │   │   ├── FlexibleNavbar.tsx
│   │   │   ├── Logo.tsx, Avatar.tsx, LoginButton.tsx, SignUpButton.tsx
│   │   │   └── README.md
│   │   ├── outputs/
│   │   │   └── rent/
│   │   ├── situations/
│   │   │   ├── 1/
│   │   │   │   ├── inputs/
│   │   │   │   └── outputs/
│   │   │   ├── Situation1.tsx
│   │   │   └── index.ts
│   │   ├── theme/
│   │   │   ├── ThemeShowcase.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── index.ts
│   │   └── ui/                    # shadcn/ui base components
│   │       ├── accordion.tsx, avatar.tsx, badge.tsx, button.tsx, card.tsx
│   │       ├── carousel.tsx, chart.tsx, dialog.tsx, drawer.tsx
│   │       ├── dropdown-menu.tsx, field.tsx, input-group.tsx, input.tsx
│   │       ├── label.tsx, navigation-menu.tsx, popover.tsx, progress.tsx
│   │       ├── radio-group.tsx, separator.tsx, slider.tsx, switch.tsx
│   │       ├── table.tsx, tabs.tsx, textarea.tsx, toggle.tsx, tooltip.tsx
│   │       └── ... (more shadcn components)
│   ├── contexts/
│   │   ├── AppProviders.tsx
│   │   ├── AppRouter.tsx
│   │   ├── RouterProvider.tsx
│   │   ├── ThemeContext.tsx
│   │   └── index.ts
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── MainAppPage.tsx
│   │   ├── QuestionnairePage.tsx
│   │   └── index.ts
│   ├── services/
│   │   ├── formatting/
│   │   │   ├── FormattingService.ts
│   │   │   └── index.ts
│   │   ├── validation/
│   │   │   ├── ValidationService.ts
│   │   │   ├── useSmartFieldValidation.ts
│   │   │   ├── types.ts
│   │   │   └── README.md
│   │   └── MonthlyRentCalculator.ts
│   ├── test/
│   │   └── setupTests.ts
│   ├── utils/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── index.css                 # Tailwind imports + CSS variables
│   ├── main.tsx                  # React app entry
│   └── vite-env.d.ts
├── .github/
│   ├── copilot-instructions.md   # This file
│   └── workflows/
│       └── deploy.yml
├── components.json               # shadcn/ui configuration
├── eslint.config.js
├── index.html
├── jest.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 5) Routing & Situations Overview

**Current router file:** `src/contexts/AppRouter.tsx`

**Routes:**
- `/` → `LandingPage`
- `/questionnaire` → `QuestionnairePage`
- `/situation/1/question/rent` → `RentQuestions` (previousUrl: `/`, nextUrl: `/situation/1/question/purchase`)
- `/situation/1/question/purchase` → `PurchaseQuestions` (previousUrl: `/situation/1/question/rent`, nextUrl: `/situation/1/question/investment`)
- `/situation/1/question/investment` → `InvestmentQuestions` (previousUrl: `/situation/1/question/purchase`, nextUrl: `/situation/1/panel`)
- `/situation/1/panel` → `Situation1`
- `/situation/1` → `Situation1`
- `/temp/theme` → `ThemeShowcase` (temporary component showcase)
- `*` → `Navigate to="/" replace` (catch-all redirect)

**Situation 1 flow:** Rent → Purchase → Investment → Results panel.

---

## 6) Inputs & Outputs Patterns

**Inputs** live under `src/components/inputs/{rent|buy|invest}` and are used by question pages; display modes: input | slider | combined.

**Outputs** live under `src/components/outputs/**` and render tables/graphs for results.

Each field has validation, CAD formatting as needed, and tests colocated (`*.test.tsx`).

Mobile-first; short label + tooltip for depth.

---

## 7) Dev Workflow & Commands

- **`npm run dev`** → Starts Vite dev server on port 5173; HMR enabled; ~200ms to start.
- **`npm run build`** → `tsc -b && vite build`; outputs to `dist/`; ~3-6s; never cancel (set timeout 120s+).
- **`npm run preview`** → Serves `dist/` on port 4173; must run `build` first.
- **`npm run lint`** → ESLint with TypeScript support; ~1s; must pass before commit.
- **`npm run test`** → Jest with React Testing Library; run specific tests with `npm test -- <ComponentName>.test`.
- **`npm install`** → ~10s; installs ~661 packages.

---

## 8) Quality Gates

**Pre-commit:** `npm run lint && npm run build` must pass.

**Field components:** unit tests (render, interactions, formatting); fix discovered bugs before PR.

**Accessibility:** labels, focus states, aria for toggles, keyboard nav.

---

## 9) Contribution Rules for Agents

- Prefer shadcn/ui; keep Tailwind classes consistent with existing patterns.
- Do not introduce new state managers without approval; keep step logic local.
- When touching routes, update the **Routing & Situations Overview** section above.
- Keep copy tone consistent (conversational, Canadian context, non-advice).
- For any new input field: separate display value from actual value if formatting is needed (e.g., `"1,500.00"` display vs `1500` stored).
- Write comprehensive tests for all new field components; colocate as `*.test.tsx`.
- Mobile-first design: short labels + tooltips for detailed info.

---

## 10) Project Tree Refresh Procedure

To regenerate the tree in section 4, run:

```bash
cd /path/to/BuyOrRent
tree -L 4 -I 'node_modules|dist|coverage|.git' --dirsfirst
```

Or use the find-based alternative:

```bash
find . -type d -o -type f | grep -v node_modules | grep -v dist | grep -v coverage | grep -v ".git/" | sort
```

Then manually format the output to match section 4's structure. No automation script is currently present; consider adding one at `docs/scripts/update-tree.mjs` if frequent updates are needed.

---

## 11) Post-Session Instruction Refresh Protocol

After each session, the agent must evaluate whether this instructions file is still accurate. If any section is invalidated (e.g., routes changed, step counts updated, defaults adjusted), it should:

1. Notify the user in its PR/summary, and
2. Propose a patch to this file (or auto-update if authorized).

---

## 12) Glossary

- **Situation 1:** Renting now, considering buying.
- **Inputs (upper):** Questionnaire; **Outputs (lower):** results.
- **Assumed/default:** Value auto-applied when user accepts defaults.
- **All-in rent:** Out-of-pocket monthly cost incl. anything the tenant pays separately.
- **Rent tab:** Rent-related inputs or outputs.
- **Buy/purchase/mortgage tab:** Purchase-related inputs or outputs.
- **Investment tab:** Investment-related inputs or outputs.
- **Comparison tab:** Comparison outputs (results panel).
- **Upper section / questionnaire:** Input forms collecting user data.
- **Lower section / results / reports / outputs:** Display of calculation results.