# BuyOrRent

A modern web application built with React 19, Vite 7, and Tailwind CSS 4. This single-page application demonstrates the latest web development technologies with automated deployment to GitHub Pages.

## 🚀 Live Demo

**Published App URL:** [https://hamidrezarezaeigithub.github.io/BuyOrRent/](https://hamidrezarezaeigithub.github.io/BuyOrRent/)

## 🛠️ Tech Stack

- **React 19.1.1** - Modern UI framework with latest features
- **TypeScript 5.8.3** - Type safety and enhanced developer experience
- **Vite 7.1.7** - Fast build tool and development server
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **ESLint 9.36.0** - Code linting and quality assurance

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
├── src/                    # Source code
│   ├── App.tsx            # Main application component
│   ├── App.css            # Component-specific styles
│   ├── main.tsx           # React application entry point
│   ├── index.css          # Global styles & Tailwind imports
│   └── assets/            # Static assets
├── public/                # Public static files
├── dist/                  # Production build output
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions deployment
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

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
5. **Deploy:** Uploads `dist/` folder to GitHub Pages

**Build Time:** ~1-2 minutes total

### GitHub Pages Configuration

To set up GitHub Pages for this repository:

1. **Repository Settings:**
   - Go to your repository → Settings → Pages
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages` (created automatically by the workflow)
   - **Folder:** `/ (root)`

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