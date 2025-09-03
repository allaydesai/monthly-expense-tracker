# Claude Code Configuration

## Project Standards

### Code Quality
- Follow TypeScript strict mode conventions
- Use React 18+ patterns with hooks
- Prefer functional components over class components
- Implement proper error boundaries
- Use semantic HTML and ARIA attributes for accessibility

### File Organization
- Components in `src/components/`
- Utilities in `src/utils/`
- Types in `src/types/`
- Tests co-located with components (`*.test.tsx`)
- Stores in `src/stores/`

### Testing Requirements
- Write tests for all new components
- Test both happy path and error cases
- Use Vitest with React Testing Library
- Mock external dependencies appropriately
- Aim for meaningful test coverage, not just numbers

### Security Guidelines
- Never commit API keys or secrets
- Validate all file uploads (type, size, content)
- Sanitize user inputs
- Use secure file handling practices
- Implement proper error handling without exposing internals

### Excel Processing Standards
- Support common Excel formats (.xlsx, .xls)
- Handle various date formats gracefully
- Provide clear error messages for parsing issues
- Process multi-sheet workbooks efficiently
- Maintain data integrity throughout parsing

### Code Review Focus
When reviewing PRs, pay special attention to:
1. **Security**: File upload vulnerabilities, XSS, data validation
2. **Performance**: Large file handling, memory usage, async operations
3. **User Experience**: Error messages, loading states, accessibility
4. **Type Safety**: Proper TypeScript usage, interface definitions
5. **Testing**: Adequate test coverage for new functionality

### React/TypeScript Patterns
- Use `React.FC` for component types
- Implement proper prop interfaces
- Use `useCallback` and `useMemo` appropriately
- Handle async operations with proper error states
- Implement loading and error UI states

### Commands to Run
- Tests: `npm test`
- Build: `npm run build`
- Linting: `npm run lint`
- Type checking: `npm run type-check`

## Review Criteria

### Must Have
- All tests passing
- No TypeScript errors
- Proper error handling
- Security best practices
- Accessibility compliance

### Should Have
- Performance optimization
- Clear documentation
- Meaningful test coverage
- Consistent code style
- User-friendly error messages

### Nice to Have
- Progressive enhancement
- Offline capabilities consideration
- Performance monitoring hooks
- Advanced error recovery