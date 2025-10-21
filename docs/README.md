# docs

Project documentation files.

## Purpose

This directory contains detailed documentation about the project's architecture, implementation details, and technical decisions.

## Files Structure

```
docs/
├── CONFIG_IMPLEMENTATION.md    # Configuration system documentation
└── GLOBAL_STEP_CURSOR.md       # Global step tracking documentation
```

## Documentation Files

### CONFIG_IMPLEMENTATION.md

**Purpose**: Comprehensive documentation of the configuration management system.

**Topics Covered**:
- ConfigProvider architecture
- Configuration state management
- Manifest file structure
- Configuration loading and initialization
- useConfig hook usage
- Best practices
- Examples and patterns

**Audience**: Developers working with configuration system

**When to Read**:
- Implementing new situations
- Adding new configuration fields
- Understanding data flow
- Debugging configuration issues

---

### GLOBAL_STEP_CURSOR.md

**Purpose**: Documentation of the global step tracking system.

**Topics Covered**:
- Global step management
- Step navigation logic
- Progress tracking
- Step validation
- Integration with routing
- Multi-step flow patterns

**Audience**: Developers implementing multi-step flows

**When to Read**:
- Building questionnaire flows
- Implementing step navigation
- Understanding progress tracking
- Debugging navigation issues

## Documentation Standards

### Markdown Format

All documentation uses Markdown:
- Clear headings hierarchy
- Code examples with syntax highlighting
- Tables for structured data
- Links to relevant files
- Visual diagrams (future)

### Structure

Documentation should include:
1. **Overview**: What it is and why
2. **Architecture**: How it works
3. **Usage**: How to use it
4. **Examples**: Practical examples
5. **Best Practices**: Recommendations
6. **Troubleshooting**: Common issues
7. **API Reference**: Detailed API docs

### Code Examples

Include working code examples:

```typescript
// ✅ Good: Complete, runnable example
import { ConfigProvider } from '@/common';

const config = ConfigProvider.getConfig();
console.log(config.monthlyRent);

// ❌ Avoid: Incomplete or pseudo-code
config.get('rent') // Missing context
```

## Related Documentation

### README Files

Component-level documentation in README.md files throughout:
- `src/components/README.md` - Component overview
- `src/services/README.md` - Services documentation
- `src/config/README.md` - Configuration overview
- And many more...

### Code Comments

In-code documentation:
- JSDoc comments on functions
- Interface documentation
- Complex logic explanations
- Implementation notes

### GitHub

- Repository README.md - Project overview
- GitHub Wiki (future)
- GitHub Issues - Discussions
- Pull Request descriptions

## Documentation Workflow

### Creating New Documentation

1. **Identify need**: What needs documentation?
2. **Choose location**: 
   - `docs/` for architectural docs
   - `README.md` for component docs
   - JSDoc for API docs
3. **Write content**: Follow standards
4. **Add examples**: Include code samples
5. **Link references**: Cross-link related docs
6. **Review**: Check accuracy
7. **Maintain**: Update as code changes

### Updating Documentation

Documentation should be updated when:
- Architecture changes
- APIs change
- New features added
- Bugs fixed (if affects usage)
- Best practices evolve

### Documentation Review

Before releasing features:
- [ ] User-facing changes documented
- [ ] API changes documented
- [ ] Examples updated
- [ ] Cross-references checked
- [ ] README files updated

## Documentation Types

### Architectural Documentation

High-level system design:
- System architecture
- Design patterns used
- Technology choices
- Data flow diagrams
- Component relationships

**Location**: `docs/` directory

**Examples**: CONFIG_IMPLEMENTATION.md, GLOBAL_STEP_CURSOR.md

---

### API Documentation

Detailed API reference:
- Function signatures
- Parameters and types
- Return values
- Error conditions
- Usage examples

**Location**: JSDoc comments in code

**Tools**: Can generate with TypeDoc (future)

---

### Component Documentation

Individual component docs:
- Purpose and features
- Props interface
- Usage examples
- Integration points
- Related components

**Location**: README.md in component directories

**Example**: `src/components/navbar/README.md`

---

### Tutorial Documentation

Step-by-step guides:
- Getting started
- Building features
- Common workflows
- Best practices

**Location**: Repository README, Wiki (future)

---

### Reference Documentation

Quick reference materials:
- Configuration options
- Available services
- Utility functions
- Conventions and patterns

**Location**: Various README files

## Future Documentation

Planned additions:

### Architecture Diagrams

- System architecture diagram
- Data flow diagrams
- Component hierarchy
- Service relationships

**Tool**: Mermaid.js or similar

### API Reference Site

Generated API documentation:
- TypeDoc generated
- Searchable
- Interactive
- Always up-to-date

### User Guide

End-user documentation:
- How to use the app
- Interpreting results
- Understanding assumptions
- FAQs

### Developer Guide

Comprehensive developer docs:
- Setup instructions
- Development workflow
- Testing guide
- Deployment process
- Contributing guidelines

### Changelog

Version history:
- Features added
- Bugs fixed
- Breaking changes
- Migration guides

## Contributing to Documentation

### Documentation Style

- **Clear**: Use simple language
- **Concise**: Be brief but complete
- **Accurate**: Keep up-to-date
- **Practical**: Include examples
- **Linked**: Cross-reference related docs

### Before Submitting

- Spell check
- Link check
- Example verification
- Formatting consistency
- Technical accuracy

## Tools

### Markdown Editors

- VS Code (with extensions)
- Typora
- Mark Text
- Online editors

### Diagram Tools

- Mermaid.js (in Markdown)
- Draw.io
- Lucidchart
- PlantUML

### Documentation Generators

- TypeDoc (TypeScript)
- JSDoc (JavaScript)
- Docusaurus (site generator)
- MkDocs (site generator)

## Best Practices

### Write for Your Audience

- **Developers**: Technical, detailed
- **Users**: Simple, practical
- **Contributors**: Process-oriented
- **Maintainers**: Comprehensive

### Keep It Current

- Update with code changes
- Review periodically
- Deprecate outdated docs
- Archive obsolete docs

### Use Examples

- Show don't tell
- Real-world scenarios
- Complete, runnable code
- Explain the example

### Link Generously

- Link to related docs
- Link to source code
- Link to external resources
- Use relative links

## Maintenance

### Regular Reviews

Schedule documentation reviews:
- Quarterly: Check for outdated info
- With releases: Update for changes
- On feedback: Address issues

### Documentation Debt

Track documentation needs:
- Missing documentation
- Outdated documentation
- Unclear documentation
- Incomplete documentation

## Notes

- Documentation is as important as code
- Keep docs in sync with code
- Write docs for future you
- Examples are invaluable
- Regular maintenance needed
- Clear writing is essential
