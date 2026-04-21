# Story 4.7: Generate Test Coverage Report (Target 70%+)

Status: ready-for-dev

## Story

As a developer,
I want comprehensive test coverage analysis across all test types,
So that I identify untested code and ensure production readiness.

## Acceptance Criteria

1. Coverage collection is configured for backend (Vitest with `--coverage`)
2. Coverage collection is configured for frontend (Jest with `--coverage`)
3. Coverage report includes line, branch, function, and statement coverage
4. Backend service layer has > 80% coverage
5. Frontend components have meaningful coverage (> 70%)
6. API integration tests cover 100% of endpoints
7. Coverage report identifies untested code paths
8. Coverage report is generated in HTML and text/JSON format
9. Test coverage report document saved to `docs/test-coverage-report.md`
10. Report explains any coverage below 70%
11. Training requirement met: Minimum 70% meaningful coverage documented

## Tasks / Subtasks

- [ ] Task 1: Run backend coverage (AC: 1, 3, 4, 6)
  - [ ] Run `cd backend && npm run test:coverage`
  - [ ] Capture output showing coverage percentages
  - [ ] Note: `vitest run --coverage` requires `@vitest/coverage-v8` or `@vitest/coverage-istanbul`
  - [ ] Install coverage provider if missing: `npm install -D @vitest/coverage-v8`
  - [ ] Ensure `vitest.config.ts` has coverage config with `include`, `exclude`, thresholds

- [ ] Task 2: Run frontend coverage (AC: 2, 3, 5)
  - [ ] Run `cd frontend && npm run test:coverage`
  - [ ] Capture output showing coverage percentages
  - [ ] Ensure `jest.config.ts` has `collectCoverage` or use `--coverage` flag
  - [ ] Coverage should cover `src/components/` and `src/lib/`

- [ ] Task 3: Create coverage report document (AC: 7-11)
  - [ ] Create `docs/test-coverage-report.md`
  - [ ] Document overall coverage summary
  - [ ] Document backend coverage by module (services, controllers, routes, validation)
  - [ ] Document frontend coverage by component
  - [ ] List test types and counts (unit, integration, component, E2E)
  - [ ] Explain any gaps below 70%
  - [ ] List untested paths

## Dev Notes

### Backend Coverage Setup
Check `backend/vitest.config.ts`. If no coverage config, add:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: ['src/**/*.ts'],
      exclude: ['src/server.ts', 'src/**/*.d.ts'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      }
    }
  }
});
```

Install if needed:
```bash
cd backend && npm install -D @vitest/coverage-v8
```

### Frontend Coverage Setup
Check `frontend/jest.config.ts`. Add or update:
```typescript
const config: Config = {
  // ... existing config
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx',
    '!src/app/globals.css',
  ],
};
```

Run: `cd frontend && npm test -- --coverage`

### Coverage Report Document Structure
```markdown
# Test Coverage Report

## Summary
- Date: [date]
- Overall Coverage: [X]%

## Backend Coverage
| Module | Statements | Branches | Functions | Lines |
|--------|-----------|----------|-----------|-------|
| services/ | X% | X% | X% | X% |
| controllers/ | X% | X% | X% | X% |
| routes/ | X% | X% | X% | X% |
| validation/ | X% | X% | X% | X% |

## Frontend Coverage
| Component | Statements | Branches | Functions | Lines |
|-----------|-----------|----------|-----------|-------|
| ...

## Test Inventory
- Unit tests (backend): X
- Integration tests (backend): X
- Component tests (frontend): X
- E2E tests (Playwright): 5

## Coverage Analysis
[Discussion of coverage gaps and rationale]
```

### Existing Test Files to Count
Check:
- `backend/src/**/*.test.ts` or `backend/tests/**/*.test.ts`
- `frontend/src/**/__tests__/*.test.tsx`
- `e2e/tests/*.spec.ts`

### Vitest Config Location
Look at `backend/vitest.config.ts` — this already exists per the backend setup.

## File List

**New files:**
- `docs/test-coverage-report.md`

**Modified files (if coverage config missing):**
- `backend/vitest.config.ts`
- `frontend/jest.config.ts`

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-21 | Story created | Dev Agent |
