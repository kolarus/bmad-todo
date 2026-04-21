# AI Integration Log — trainingnf

**Project:** trainingnf Todo Application  
**Period:** April 16–21, 2026  
**Methodology:** BMAD (Breakthrough Method for Agile Development)  
**Primary AI Tool:** GitHub Copilot (Claude Sonnet 4.6) via VS Code  

---

## Overview

This log documents how AI tools were used throughout the implementation of the trainingnf todo application. The project followed the full BMAD workflow: from product brief through PRD, UX design, architecture, epics/stories, and implementation. Every implementation story was executed using AI assistance through the `bmad-dev-story` skill.

---

## Agent Usage

### How AI Was Used

The primary AI integration was **GitHub Copilot with Claude Sonnet 4.6** inside VS Code, accessed through the BMAD skill system. Each implementation story was a discrete AI agent invocation with the full story context (acceptance criteria, dev notes, architecture references).

| Story | AI-Assisted Task | AI Performance |
|-------|-----------------|----------------|
| 1.1 – Next.js init | Scaffold App Router structure, Tailwind config | Excellent — boilerplate generation |
| 1.2 – Express backend | TypeScript Express setup, nodemon config | Excellent — standard patterns |
| 1.3 – Prisma + Docker | Prisma schema, docker-compose.yml | Good — needed env var guidance |
| 1.4 – CORS + env validation | Zod env schema, CORS middleware | Excellent — security patterns clear |
| 1.5 – Dockerfiles | Multi-stage Next.js + Express Dockerfiles | Good — needed port/CMD adjustments |
| 1.6 – docker-compose.prod.yml | Full production compose with health checks | Excellent — followed architecture spec |
| 1.7 – Health check endpoints | `/api/health`, `/api/health/db` routes | Excellent — straightforward implementation |
| 2.1 – Zod validation | CreateTodoSchema, UpdateTodoSchema | Excellent — type inference utilized well |
| 2.2 – Todo service layer | Prisma CRUD, unit tests with mock PrismaClient | Good — mock setup needed iteration |
| 2.3 – REST API endpoints | Express routes, Supertest integration tests | Excellent — 100% endpoint coverage |
| 2.4 – React Context | TodoContext, useReducer, useTodo hook | Excellent — clean separation of concerns |
| 2.5 – Optimistic UI | Rollback on API failure, temp IDs | Good — race condition edge cases flagged |
| 2.6 – TodoInput component | Form validation, keyboard handling, tests | Excellent — RTL tests comprehensive |
| 2.7 – TodoCard component | Toggle, delete, visual states, tests | Excellent |
| 2.8 – TodoList component | Empty/loading/error states, tests | Excellent — accessibility attributes included |
| 2.9 – Error boundary + toast | React ErrorBoundary, toast notifications | Good — timing for auto-dismiss needed tuning |
| 3.1–3.10 – UX/Design stories | Tailwind design tokens, animations, responsive, a11y | Excellent — UX spec fully implemented |
| 4.1–4.9 – E2E + QA stories | Playwright tests, reports | Excellent — BMAD story format with selectors |

### Effective Prompting Patterns

**What worked well:**

1. **BMAD story files as prompts** — providing a complete story file with acceptance criteria, dev notes, and architecture references gave the AI enough context to implement without guessing. Reduced hallucinated imports and wrong file paths significantly.

2. **Referencing architecture.md in dev notes** — explicitly citing the service layer pattern (`routes → controllers → services`) meant the AI consistently followed the convention.

3. **Including file paths in tasks** — e.g., `Check backend/src/services/todo.service.ts` gave the AI exact context rather than making it search.

4. **Acceptance criteria as checkboxes** — AI treated each AC as a test to satisfy, producing more complete implementations.

**Prompting improvements discovered mid-project:**

- Adding "do NOT rewrite from scratch" in dev notes when augmenting existing files prevented AI from deleting working code.
- Specifying `{communication_language}: English` and `{user_skill_level}: intermediate` via bmm/config.yaml tuned response verbosity.

### Tasks Where AI Excelled

- **Boilerplate generation** — Dockerfile patterns, Express middleware chains, Prisma schema from requirements
- **Test scaffolding** — generating test suites from acceptance criteria, mocking Prisma client
- **Type inference** — leveraging Zod schemas for TypeScript types across frontend and backend
- **Accessibility implementation** — ARIA labels, keyboard event handlers, focus management from UX spec
- **Documentation** — structured reports (QA, security, accessibility, performance) from audit data

### Tasks Where AI Needed Guidance

- **Docker networking** — initial container DNS names were incorrect; required human correction of service names in docker-compose configs
- **Prisma v7 adapter pattern** — new `@prisma/adapter-pg` syntax required correction from deprecated patterns
- **Next.js 16 / React 19 specifics** — occasional use of deprecated patterns from earlier versions
- **E2E test selectors** — generic CSS selectors needed refinement to match actual rendered HTML

---

## MCP Server Usage

### Playwright MCP

**Used in:** Stories 4.2–4.6 (E2E test scenarios)

The Playwright MCP server was used to inspect the running application and generate test selectors grounded in actual DOM structure. This eliminated brittle CSS class selectors and produced stable `data-testid` and ARIA role selectors.

**Benefits observed:**
- Reduced E2E test maintenance by using semantic selectors
- Page Object Model was generated from live inspection
- Test assertion values (text content, ARIA labels) matched actual rendered output

**Specific example:** For the "optimistic UI" E2E test (Story 4.6), Playwright MCP helped identify the intermediate loading state CSS transition timing, enabling accurate `waitForSelector` assertions.

### Chrome DevTools MCP

**Used in:** Story 3.10 (Performance testing and report)

Chrome DevTools MCP was used to capture Lighthouse scores and analyze bundle composition.

**Benefits observed:**
- Accurate performance metrics without manual browser tooling
- Bundle size analysis identified unused Tailwind classes for purge optimization
- LCP, FID, CLS values fed directly into `docs/performance-report.md`

**Results:** Initial load < 2s on broadband; frontend bundle < 200KB gzipped — both targets met.

### Postman MCP

**Not used.** API endpoints were validated entirely through Supertest integration tests (Story 2.3), which provided programmatic, CI-friendly coverage without requiring a running server instance. Manual API testing was done via `curl` where needed.

---

## Test Generation

### Backend Unit Tests (Vitest)

**Stories:** 2.2 (service layer), 2.1 (validation schemas)

AI generated the full unit test suite for `TodoService` by:
1. Reading the service implementation and identifying all methods
2. Generating mock PrismaClient using `vi.mock`
3. Creating test cases for happy path and error scenarios

**What AI got right:** Full happy-path coverage, error propagation tests, TypeScript type assertions.

**What AI missed initially:**
- Edge case: concurrent delete + toggle on same todo (required manual addition)
- Prisma error code mapping (e.g., `P2025 - Record not found`) needed explicit handling examples

### Backend Integration Tests (Supertest)

**Story:** 2.3 (REST API endpoints)

AI generated 100% endpoint coverage (GET /todos, POST /todos, PATCH /todos/:id, DELETE /todos/:id) plus error cases (400, 404, 500).

**What AI got right:** Full CRUD coverage, correct HTTP status codes, JSON response shape validation.

**What AI missed:** The `Content-Type: application/json` header check on POST — added manually to match Zod middleware behavior.

### Frontend Component Tests (Jest + React Testing Library)

**Stories:** 2.6 (TodoInput), 2.7 (TodoCard), 2.8 (TodoList)

AI generated RTL tests using `render`, `fireEvent`, `userEvent`, and custom TodoContext wrappers.

**What AI got right:**
- Accessibility-first queries (`getByRole`, `getByLabelText`) used throughout
- Mock `useTodo` hook pattern for component isolation
- Loading and empty state rendering verified

**What AI missed:**
- Keyboard trap test for the delete confirmation pattern
- Animation class toggle verification (Tailwind transition classes)

### E2E Tests (Playwright)

**Stories:** 4.1–4.6

Five required scenarios implemented:
1. Happy path CRUD cycle
2. Data persistence across page refresh
3. Empty input validation
4. Error recovery flow (backend unavailable)
5. Optimistic UI behavior (immediate UI update before server response)

**What AI got right:** Page Object Model structure, proper `await` patterns, viewport configuration for mobile testing.

**What AI needed help with:**
- Selector specificity for the todo text input (multiple inputs on page)
- Network interception timing for the error recovery test
- Flakiness in the optimistic UI test due to fast CI environments (added explicit waits)

---

## Debugging with AI

### CORS Configuration Issue (Story 1.4)

**Problem:** Frontend requests were being blocked despite CORS being configured.  
**AI contribution:** Identified that `credentials: true` requires explicit `origin` (not `*`) and that the Express CORS middleware needed to be mounted before all other middleware.  
**Resolution:** AI provided the corrected middleware order and options object.

### Prisma Migration Conflict (Story 1.3)

**Problem:** `prisma migrate dev` failed with "drift detected" after Docker volume was recreated.  
**AI contribution:** Explained the difference between `migrate dev` (development) and `migrate reset` (clean slate), and when each should be used.  
**Resolution:** `npx prisma migrate reset` followed by `npx prisma migrate dev`.

### TypeScript Strict Mode Errors (Story 2.2)

**Problem:** `Partial<Todo>` type in service layer caused type errors with Prisma's `update` input type.  
**AI contribution:** Identified that Prisma's generated types require `data: { completed: boolean }` structure rather than a generic partial, and refactored accordingly.

### Next.js Hydration Mismatch (Story 2.4)

**Problem:** React hydration mismatch when TodoContext provided initial state from server and client differed.  
**AI contribution:** Identified the `useEffect` pattern for client-side-only state initialization and suggested marking the context provider as a Client Component.

### Docker Health Check Failures (Story 1.7)

**Problem:** Backend health check in docker-compose.prod.yml was timing out.  
**AI contribution:** Identified that the `HEALTHCHECK` interval was too short for Node.js startup time. Suggested `--start-period=10s` and proper curl command format.

---

## Limitations Encountered

### Outdated Library Knowledge

**Observation:** AI occasionally generated code using APIs from older versions:
- Prisma v4/v5 syntax vs. the v7 `@prisma/adapter-pg` pattern used in this project
- Next.js 13 `pages/` router patterns when App Router was specified
- Express 4 `req.params` patterns that still worked but weren't idiomatic for Express 5

**Mitigation:** Including `package.json` version numbers in dev notes and architecture references reduced this significantly.

### Environment-Specific Configuration

**Observation:** AI struggled with Docker networking (container-to-container DNS names, host vs. container ports) without explicit examples in the story context.

**Mitigation:** Architecture.md included Docker networking details; referencing it in story dev notes resolved most issues.

### Test Isolation Complexity

**Observation:** For integration tests requiring a real database, AI initially suggested in-memory SQLite but the project spec required PostgreSQL. Adapting to test database setup with `beforeAll`/`afterAll` cleanup required several iterations.

**Mitigation:** Adding explicit database setup patterns to story dev notes.

### Race Condition Detection

**Observation:** AI-generated optimistic UI implementation didn't initially account for rapid successive operations (e.g., toggle twice before first response). The rollback logic needed manual refinement for this edge case.

**Human expertise required:** Understanding async state mutation patterns and React's batched state update behavior.

### Context Window Limitations

**Observation:** For longer stories (e.g., 2.3 with full API + tests), the full implementation sometimes lost context of earlier decisions by the end of the session.

**Mitigation:** BMAD's story format keeps all context in the story file, and re-loading the file at session start (via `bmad-dev-story`) restored context reliably.

---

## Summary

| Category | Assessment |
|----------|-----------|
| Overall AI effectiveness | High — ~80% of code generated by AI without modification |
| Best use case | Boilerplate, test scaffolding, documentation, type-safe patterns |
| Worst use case | Docker/infra config, version-specific APIs, race condition logic |
| BMAD contribution | Story files as AI context dramatically improved output quality |
| Time saved (estimated) | ~60% reduction vs. manual implementation |
| Human review required | Architecture decisions, security configurations, edge case coverage |
