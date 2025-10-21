# .github

GitHub-specific configuration and workflows.

## Purpose

This directory contains GitHub-specific files including GitHub Actions workflows, issue templates, pull request templates, and Copilot instructions.

## Files Structure

```
.github/
├── workflows/
│   └── deploy.yml              # GitHub Actions deployment workflow
└── copilot-instructions.md     # GitHub Copilot custom instructions
```

## GitHub Actions Workflows

### deploy.yml

**Purpose**: Automated deployment to GitHub Pages on push to main/master branch.

**Trigger Events**:
- Push to `main` branch
- Push to `master` branch
- Manual workflow dispatch

**Jobs**:

1. **Build and Deploy**:
   - Runs on: `ubuntu-latest`
   - Node version: 18
   - Steps:
     - Checkout code
     - Setup Node.js
     - Install dependencies (`npm install`)
     - Build project (`npm run build`)
     - Create SPA routing fallback (`404.html`)
     - Upload artifact
     - Deploy to GitHub Pages

**Permissions**:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

**Configuration**:
- Concurrency: Only one deployment at a time
- Cancel in-progress deployments
- Artifact retention: 1 day

**Deployment Time**: ~1-2 minutes total

**Usage**: Automatic on push to main; or trigger manually from Actions tab.

---

## Copilot Instructions

### copilot-instructions.md

**Purpose**: Custom instructions for GitHub Copilot to understand project context and conventions.

**Contents**:
1. **Project Summary**: Tech stack, purpose, architecture
2. **Audience & UX Principles**: Mobile-first, plain language
3. **Technical Stack**: Versions, dependencies, tools
4. **File & Folder Anatomy**: Complete project structure
5. **Routing & Situations**: Route definitions, flow
6. **Dev Workflow**: Commands, timings, best practices
7. **Quality Gates**: Pre-commit checks, testing standards
8. **Contribution Rules**: Code style, patterns, conventions
9. **Glossary**: Project-specific terminology

**When Updated**:
- Major architecture changes
- New situations added
- Dependency updates
- Convention changes
- Route modifications

**Usage**: GitHub Copilot automatically uses this file to provide context-aware suggestions.

---

## GitHub Pages Configuration

### Repository Settings

To enable GitHub Pages:

1. **Go to**: Repository → Settings → Pages
2. **Source**: GitHub Actions (recommended)
3. **Branch**: Automatically deployed from workflow
4. **Custom Domain**: Optional

### Base Path

Configured in `vite.config.ts`:
```typescript
base: '/BuyOrRent/'  // Matches repository name
```

### Published URL

https://hamidrezarezaeigithub.github.io/BuyOrRent/

---

## Future Additions

### Issue Templates

Create `.github/ISSUE_TEMPLATE/`:

```
.github/ISSUE_TEMPLATE/
├── bug_report.md       # Bug report template
├── feature_request.md  # Feature request template
└── config.yml          # Issue template configuration
```

**Bug Report Template**:
```markdown
---
name: Bug Report
about: Report a bug
labels: bug
---

**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- Browser: [e.g., Chrome 120]
- Device: [e.g., iPhone 14]
- OS: [e.g., iOS 17]
```

---

### Pull Request Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Code follows project style
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Build passes
- [ ] Lint passes
```

---

### Dependabot Configuration

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

**Purpose**: Automatically update dependencies.

---

### Code Owners

Create `.github/CODEOWNERS`:

```
# Default owners for everything
*       @HamidRezaRezaeiGitHub

# Specific path owners
/src/components/    @HamidRezaRezaeiGitHub
/docs/              @HamidRezaRezaeiGitHub
```

**Purpose**: Automatic review requests for PRs.

---

### Security Policy

Create `.github/SECURITY.md`:

```markdown
# Security Policy

## Reporting a Vulnerability

Please report security vulnerabilities to: security@example.com

**Do not** open public issues for security vulnerabilities.
```

---

## GitHub Actions Best Practices

### Workflow Organization

```
.github/workflows/
├── deploy.yml          # Production deployment
├── test.yml            # Run tests on PR
├── lint.yml            # Lint checks
└── preview.yml         # Deploy PR previews
```

### Caching

Speed up workflows with caching:

```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### Matrix Builds

Test on multiple versions:

```yaml
strategy:
  matrix:
    node-version: [18, 20]
    os: [ubuntu-latest, windows-latest, macos-latest]
```

## GitHub Repository Settings

### Branch Protection

Recommended rules for `main`:
- Require pull request reviews
- Require status checks to pass
- Require linear history
- Require signed commits (optional)
- Include administrators (optional)

### Merge Strategies

Choose merge strategy:
- **Squash and merge**: Clean history (recommended)
- **Merge commit**: Full history
- **Rebase and merge**: Linear history

### Secrets

Store sensitive data:
- Go to Settings → Secrets
- Add: API keys, tokens, credentials
- Use in workflows: `${{ secrets.SECRET_NAME }}`

## Copilot Integration

### Custom Instructions

The `copilot-instructions.md` file helps Copilot:
- Understand project structure
- Follow project conventions
- Use correct patterns
- Suggest appropriate solutions
- Maintain consistency

### Updating Instructions

Keep instructions current:
- Update after architectural changes
- Document new patterns
- Add new conventions
- Remove obsolete info

## Documentation

### GitHub Wiki

Consider adding:
- User documentation
- Developer guides
- Tutorials
- FAQs

### GitHub Discussions

Enable for:
- Community Q&A
- Feature discussions
- Show and tell
- General conversation

## Monitoring

### Actions Status

Monitor workflow runs:
- Check Actions tab
- Review logs
- Fix failures promptly
- Optimize performance

### Deployment Status

Check deployment status:
- Environments page
- Deployment history
- Active deployments

## Security

### Workflow Permissions

Use minimal permissions:
```yaml
permissions:
  contents: read  # Only what's needed
```

### Secrets Management

- Never commit secrets
- Use GitHub Secrets
- Rotate regularly
- Limit access

### Dependabot Alerts

- Enable Dependabot alerts
- Review regularly
- Update vulnerable dependencies
- Test updates

## Notes

- Workflows run on GitHub-hosted runners
- Free for public repositories
- Build time counts against quotas (private repos)
- Artifact storage has limits
- Keep workflows efficient
- Monitor usage
- Cache dependencies
- Use concurrency controls
