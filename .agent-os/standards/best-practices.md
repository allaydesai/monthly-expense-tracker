# Development Best Practices

## Context

Global development guidelines for Agent OS projects.

<conditional-block context-check="core-principles">
IF this Core Principles section already read in current context:
  SKIP: Re-reading this section
  NOTE: "Using Core Principles already in context"
ELSE:
  READ: The following principles

## Core Principles

### Keep It Simple (KISS)
- Implement code in the fewest lines possible
- Avoid over-engineering solutions
- Choose straightforward approaches over clever ones
- Simple solutions are easier to understand, maintain, and debug

### You Aren't Gonna Need It (YAGNI)
- Avoid building functionality on speculation
- Implement features only when they are needed
- Don't anticipate future needs - build for current requirements

### Optimize for Readability
- Prioritize code clarity over micro-optimizations
- Write self-documenting code with clear variable names
- Add comments for "why" not "what"
- Complex logic should have inline comments with `# Reason:` prefix

### DRY (Don't Repeat Yourself)
- Extract repeated business logic to private methods
- Extract repeated UI markup to reusable components
- Create utility functions for common operations
- Use decorators for cross-cutting concerns

### File Structure
- **Never create a file longer than 500 lines of code**
- Keep files focused on a single responsibility
- Group related functionality together
- Use consistent naming conventions
- Organize code into clearly separated modules
</conditional-block>

<conditional-block context-check="design-principles">
IF this Design Principles section already read in current context:
  SKIP: Re-reading this section
  NOTE: "Using Design Principles already in context"
ELSE:
  READ: The following principles

## Design Principles

### Single Responsibility
- Each function, class, and module should have one clear purpose
- Functions should be under 50 lines
- Classes should be under 100 lines

### Dependency Inversion
- High-level modules should not depend on low-level modules
- Both should depend on abstractions
- Use interfaces and abstract base classes

### Open/Closed Principle
- Software entities should be open for extension
- But closed for modification
- Use inheritance and polymorphism wisely

### Fail Fast
- Check for potential errors early
- Raise exceptions immediately when issues occur
- Validate inputs at system boundaries
</conditional-block>

<conditional-block context-check="dependencies" task-condition="choosing-external-library">
IF current task involves choosing an external library:
  IF Dependencies section already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using Dependencies guidelines already in context"
  ELSE:
    READ: The following guidelines
ELSE:
  SKIP: Dependencies section not relevant to current task

## Dependencies

### Choose Libraries Wisely
When adding third-party dependencies:
- Select the most popular and actively maintained option
- Check the library's GitHub repository for:
  - Recent commits (within last 6 months)
  - Active issue resolution
  - Number of stars/downloads
  - Clear documentation
- Keep dependencies updated with package manager
- Review security advisories regularly

### Package Management (UV)
- **NEVER update dependencies directly in pyproject.toml**
- Always use UV commands for package management:
  - `uv add package` for adding dependencies
  - `uv add --dev package` for development dependencies
  - `uv remove package` for removing dependencies
- Use `uv sync` to synchronize environment
</conditional-block>

<conditional-block context-check="testing" task-condition="writing-tests">
IF current task involves writing tests:
  IF Testing section already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using Testing guidelines already in context"
  ELSE:
    READ: The following guidelines
ELSE:
  SKIP: Testing section not relevant to current task

## Testing Strategy

### Test-Driven Development (TDD)
1. **Write the test first** - Define expected behavior before implementation
2. **Watch it fail** - Ensure the test actually tests something
3. **Write minimal code** - Just enough to make the test pass
4. **Refactor** - Improve code while keeping tests green
5. **Repeat** - One test at a time

### Testing Best Practices
- Use descriptive test names that explain what is being tested
- Test edge cases and error conditions
- Keep test files next to the code they test
- Use fixtures for shared setup
- Aim for 80%+ code coverage on critical paths
- Test one thing per test function

### Test Organization
- Unit tests: Test individual functions/methods in isolation
- Integration tests: Test component interactions
- End-to-end tests: Test complete user workflows
</conditional-block>

<conditional-block context-check="error-handling" task-condition="error-handling">
IF current task involves error handling:
  IF Error Handling section already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using Error Handling guidelines already in context"
  ELSE:
    READ: The following guidelines
ELSE:
  SKIP: Error Handling section not relevant to current task

## Error Handling

### Exception Best Practices
- Create custom exceptions for your domain
- Use specific exception handling, not bare except
- Log errors with appropriate severity levels
- Provide meaningful error messages
- Use context managers for resource management
- Fail fast - raise exceptions immediately when issues occur

### Logging Strategy
- Use structured logging for better searchability
- Log function entry/exit for debugging (with decorators)
- Include relevant context in log messages
- Use appropriate log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL)
</conditional-block>

<conditional-block context-check="performance" task-condition="optimization">
IF current task involves performance optimization:
  IF Performance section already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using Performance guidelines already in context"
  ELSE:
    READ: The following guidelines
ELSE:
  SKIP: Performance section not relevant to current task

## Performance Considerations

### Optimization Guidelines
- Profile before optimizing - use profiling tools
- Use caching for expensive computations (lru_cache)
- Prefer generators for large datasets
- Use async/await for I/O-bound operations
- Consider multiprocessing for CPU-bound tasks
- Cache database queries appropriately
- Don't optimize prematurely - measure first
</conditional-block>

<conditional-block context-check="security" task-condition="security-implementation">
IF current task involves security implementation:
  IF Security section already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using Security guidelines already in context"
  ELSE:
    READ: The following guidelines
ELSE:
  SKIP: Security section not relevant to current task

## Security Best Practices

### Security Guidelines
- Never commit secrets - use environment variables
- Validate all user input
- Use parameterized queries for database operations
- Implement rate limiting for APIs
- Keep dependencies updated
- Use HTTPS for all external communications
- Implement proper authentication and authorization
- Hash passwords using bcrypt or similar
- Generate cryptographically secure tokens
</conditional-block>

<conditional-block context-check="documentation" task-condition="writing-documentation">
IF current task involves writing documentation:
  IF Documentation section already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using Documentation guidelines already in context"
  ELSE:
    READ: The following guidelines
ELSE:
  SKIP: Documentation section not relevant to current task

## Documentation Standards

### Code Documentation
- Every module should have a docstring explaining its purpose
- Public functions must have complete docstrings
- Use Google-style docstrings for consistency
- Document complex logic with inline comments
- Keep README.md updated with setup instructions
- Maintain CHANGELOG.md for version history
- Document your decisions for future developers
</conditional-block>

<conditional-block context-check="git-workflow" task-condition="version-control">
IF current task involves git operations:
  IF Git Workflow section already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using Git Workflow guidelines already in context"
  ELSE:
    READ: The following guidelines
ELSE:
  SKIP: Git Workflow section not relevant to current task

## Git Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring
- `test/*` - Test additions or fixes

### Commit Message Format
- Use conventional commit format: `<type>(<scope>): <subject>`
- Types: feat, fix, docs, style, refactor, test, chore
- Never include "claude code" or "written by claude" in messages
- Keep subject line under 50 characters
- Add detailed description in body if needed
</conditional-block>

<conditional-block context-check="search-commands" task-condition="file-searching">
IF current task involves searching for files or content:
  IF Search Commands section already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using Search Commands guidelines already in context"
  ELSE:
    READ: The following guidelines
ELSE:
  SKIP: Search Commands section not relevant to current task

## Search Command Requirements

### CRITICAL: Use ripgrep (rg) instead of grep/find
```bash
# ❌ Don't use grep
grep -r "pattern" .

# ✅ Use rg instead
rg "pattern"

# ❌ Don't use find with name
find . -name "*.py"

# ✅ Use rg with file filtering
rg --files -g "*.py"
```
</conditional-block>

## Important Notes

- **NEVER ASSUME OR GUESS** - When in doubt, ask for clarification
- **Always verify file paths and module names** before use
- **Test your code** - No feature is complete without tests
- **Document your decisions** - Future developers will thank you