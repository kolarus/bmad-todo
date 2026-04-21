# BMAD Process Documentation — trainingnf

**Project:** trainingnf Todo Application  
**Author:** Nearformer  
**Date:** April 21, 2026  
**BMAD Version:** 6.3.0  

---

## Overview

This document shows how the BMAD (Breakthrough Method for Agile Development) methodology guided every stage of building the trainingnf todo application — from initial concept through a fully deployed, tested, production-ready full-stack application.

The defining insight of this project: **trainingnf wasn't a Todo app project. It was a BMAD training project that happened to produce a Todo app.** The deliberately minimal product scope kept complexity low enough to focus entirely on the process: how each artifact feeds the next, and how AI-assisted development flows when anchored to structured specifications.

---

## BMAD Workflow Overview

```
┌─────────────────┐
│  Product Brief  │  Phase 1-Analysis
│  (product-brief)│
└────────┬────────┘
         │ Vision + scope + value proposition
         ▼
┌─────────────────┐
│      PRD        │  Phase 2-Planning
│    (prd.md)     │  + PRD Validation
└────────┬────────┘
         │ 21 FRs + NFRs + success criteria
         ▼
┌─────────────────┐
│   UX Design     │  Phase 2-Planning (continued)
│ (ux-design-     │
│ specification)  │
└────────┬────────┘
         │ User journeys + visual spec + a11y requirements
         ▼
┌─────────────────┐
│  Architecture   │  Phase 3-Solutioning
│ (architecture)  │
└────────┬────────┘
         │ Technology decisions + patterns + testing strategy
         ▼
┌─────────────────┐
│  Epics/Stories  │  Phase 3-Solutioning (continued)
│  (epics.md)     │  + Implementation Readiness Check
└────────┬────────┘
         │ 41 stories with ACs, tasks, dev notes
         ▼
┌─────────────────┐
│ Sprint Planning │  Phase 4-Implementation
│ (sprint-status) │
└────────┬────────┘
         │ Story creation → Dev → Code Review cycle × 41
         ▼
┌─────────────────┐
│  Working App    │  Phase 4-Implementation
│  + Tests + Docs │
└─────────────────┘
```

**BMAD Skills used in this project:**

| Phase | Skill Invoked | Output Artifact |
|-------|--------------|-----------------|
| 1-Analysis | (product brief provided directly) | product-brief.md |
| 2-Planning | `bmad-create-prd` | prd.md |
| 2-Planning | `bmad-validate-prd` | prd-validation-report.md |
| 2-Planning | `bmad-create-ux-design` | ux-design-specification.md |
| 3-Solutioning | `bmad-create-architecture` | architecture.md |
| 3-Solutioning | `bmad-create-epics-and-stories` | epics.md |
| 3-Solutioning | `bmad-check-implementation-readiness` | implementation-readiness-report |
| 4-Implementation | `bmad-sprint-planning` | sprint-status.yaml |
| 4-Implementation | `bmad-create-story` × 41 | story .md files |
| 4-Implementation | `bmad-dev-story` × 41 | implemented code |
| 4-Implementation | `bmad-code-review` (selected) | review in story files |

---

## Phase 1: Product Brief → PRD

### What the Product Brief Established

The Product Brief (`_bmad-output/planning-artifacts/product-brief.md`) defined:

- **Vision:** Clean, reliable core task-management — feel complete despite minimal scope
- **Target user:** Individual developers; single-user, no auth required
- **Core value prop:** Clarity, Simplicity, Reliability, Responsiveness
- **Explicit out-of-scope:** Authentication, multi-user, prioritization, due dates, categories, search/filter

### How the PRD Expanded and Formalized It

The `bmad-create-prd` skill facilitated a structured discovery process that transformed the brief into a formal specification:

**Project Classification emerged:**
- Type: Web application (SPA + backend API)  
- Complexity: Low — enabling full BMAD process focus without architectural risk  
- Context: Greenfield  
- Purpose: BMAD Method learning exercise — *this framing changed everything*

**21 Functional Requirements were formalized**, including:
- FR1-FR5: Core CRUD (create, view, toggle, delete, data persistence)
- FR6-FR8: Backend storage, full-stack persistence, session survival
- FR9-FR11: Input validation, long-text handling, concurrent operations
- FR12-FR15: Empty/loading/error/completion visual states
- FR16: Optimistic UI pattern (immediate feedback + rollback)
- FR17-FR21: REST API shape (POST/GET/PATCH/DELETE + error structure)

**4 Non-Functional Requirement categories were specified:**
- Performance: < 2s load, < 100ms perceived interaction, < 500ms API, < 200KB bundle
- Security: XSS prevention, CORS restriction, JSON validation, no sensitive data
- Accessibility: WCAG 2.1 AA, keyboard navigation, 4.5:1 contrast, ARIA, semantic HTML
- Reliability: Graceful degradation, no state corruption, clean error recovery

**Key PRD insight:** The executive summary explicitly noted this is a *BMAD training project that happens to produce a Todo app* — success was defined as process mastery, not product sophistication. This framing made every subsequent artifact decision clearer.

---

## Phase 2: PRD → UX Design

### How PRD Functional Requirements Shaped UX

The `bmad-create-ux-design` skill used the PRD to produce `ux-design-specification.md`:

**User journey extraction from FRs:**
- FR1 (create todo) → Input field with submit button, keyboard-first flow
- FR3-FR4 (toggle complete) → Custom checkbox with clear active/inactive state
- FR5 (delete) → Trash icon with hover reveal, confirmation implicit in action
- FR12 (visual distinction) → Strikethrough + 50% opacity for completed todos
- FR13-FR15 → Distinct empty, loading, and error state components

**Visual design decisions tied to PRD goals:**
- *Clarity* goal → Card-based layout with clear visual hierarchy
- *Simplicity* goal → Single-column layout, no sidebars or navigation
- *Reliability* goal → Persistent toast notifications for error feedback
- *Responsiveness* goal → Optimistic UI animations (150-200ms Tailwind transitions)

**NFR accessibility requirements → UX spec:**
- WCAG 2.1 AA → Focus rings on all interactive elements, minimum 4.5:1 contrast ratios
- Keyboard navigation → Tab order specified, Enter to submit, Escape to cancel
- ARIA → `aria-label` on all icon buttons, `role="list"` on todo container
- Semantic HTML → `<button>` for actions, `<input>` with `<label>`, `<ul><li>` for list

**Design token system** — NFR Performance (< 200KB bundle) → no web fonts, system font stack, Tailwind CSS with purge instead of a component library

**UX Design Requirements (UX-DRs) created:** 20 traceable requirements (UX-DR-1 through UX-DR-20) covering layout, color tokens, component behavior, animation, responsive breakpoints, and accessibility — each traceable back to a PRD requirement.

---

## Phase 3: PRD + UX → Architecture

### Technology Selection Driven by Requirements

The `bmad-create-architecture` skill used all three upstream artifacts:

**Technology decisions justified by requirements:**

| Decision | Requirement Driver |
|----------|-------------------|
| Next.js 16 + App Router | FR needs React; Next.js provides SSR foundation without overhead |
| React 19 with Client Components opt-in | Optimistic UI (FR16) requires client-side state; Server Components default reduces bundle size |
| TypeScript strict mode (both layers) | Reliability NFR — compile-time safety prevents runtime errors |
| Express 5 over Next.js API routes | Separate scalable API layer; architecture allows future auth/multi-user |
| Prisma ORM | Type-safe queries prevent SQL injection (Security NFR); migration system for schema evolution |
| PostgreSQL 16 | Reliability NFR — ACID guarantees for data integrity; FR6-FR8 persistence requirements |
| Zod validation (shared schemas) | Security NFR (malformed input → 400), FR9 (empty validation), shared client/server schemas |
| Docker + Docker Compose | Deployment consistency; PostgreSQL service isolation; health check support |

**Implementation patterns derived from UX spec:**

| UX Requirement | Architecture Pattern |
|---------------|---------------------|
| Optimistic UI (FR16, UX-DR) | React Context + useReducer; temp IDs; rollback on API failure |
| Toast notifications | Error Boundary at app root; toast context separate from todo context |
| Loading/empty/error states | Centralized state: `{ todos, loading, error }` in context |
| Tailwind animations | CSS transition classes; no JS animation library needed |

**Testing strategy aligned with NFRs:**

| NFR / Requirement | Testing Approach |
|------------------|-----------------|
| Reliability — no state corruption | Unit tests for service layer with mock Prisma |
| Security — CORS, validation | Integration tests with Supertest for all endpoints |
| Accessibility — WCAG 2.1 AA | RTL accessibility queries; audit tool (Story 3.9) |
| Performance — < 2s load | Playwright performance metrics; Chrome DevTools profiling |

**Service layer pattern** (routes → controllers → services) was explicitly documented in architecture to prevent AI agents from collapsing layers or inventing different patterns.

---

## Phase 3: All Artifacts → Epics/Stories

### FR Traceability Map

`bmad-create-epics-and-stories` produced `epics.md` with 41 stories. Every Functional Requirement was explicitly assigned to stories:

| Requirement | Epic | Story(ies) |
|------------|------|-----------|
| FR1: Create todo | Epic 2 | 2.6 (TodoInput component) |
| FR2: View all todos | Epic 2 | 2.8 (TodoList component) |
| FR3-FR4: Toggle complete | Epic 2 | 2.7 (TodoCard component) |
| FR5: Delete todo | Epic 2 | 2.7 (TodoCard component) |
| FR6-FR8: Persistence + sessions | Epic 1 | 1.3 (Prisma + PostgreSQL) |
| FR9: Empty validation | Epic 2 | 2.1 (Zod schemas) + 2.6 (client) |
| FR10: Long text handling | Epic 2 | 2.6 (input constraints) |
| FR11: Concurrent operations | Epic 2 | 2.5 (optimistic UI rollback) |
| FR12: Visual distinction | Epic 3 | 3.5 (completed styling) |
| FR13: Empty state | Epic 2 | 2.8 (TodoList states) |
| FR14: Loading state | Epic 2 | 2.8 (TodoList states) |
| FR15: Error state | Epic 2 | 2.9 (error boundary + toast) |
| FR16: Optimistic UI | Epic 2 | 2.5 (optimistic + rollback) |
| FR17-FR21: REST API | Epic 1 | 1.2 (server), 2.3 (endpoints) |

**NFR coverage:**
- Performance → Story 3.10 (performance testing report)
- Security → Story 4.8 (security review report)
- Accessibility → Stories 3.8 + 3.9 (WCAG implementation + audit)
- Reliability → Stories 2.5 + 2.9 (optimistic UI + error boundary)

**UX-DRs in story tasks:**
Every implementation story in Epics 2 and 3 had UX-DR references in Dev Notes, ensuring the AI agent received the visual specification alongside functional requirements. For example, Story 3.2 (card-based design) explicitly referenced UX-DR-4 (card component specification) with color tokens and shadow values.

**Story format as AI context:**
Stories were structured as:
1. As a [role], I want [action], so that [benefit] — anchors AI to user value
2. Acceptance Criteria in BDD format — AI treats each as a test case to satisfy
3. Tasks/Subtasks with file paths — prevents AI from guessing file locations
4. Dev Notes with architecture references — anchors to established patterns
5. Dev Agent Record — tracks completions and learnings for future stories

---

## Phase 4: Stories → Implementation

### Sprint Structure

`bmad-sprint-planning` initialized `sprint-status.yaml` with 41 stories across 5 categories. Stories were implemented in sequence, with each `bmad-dev-story` invocation loading:
- Full story file (ACs, tasks, dev notes)
- Project context from `_bmad-output/` artifacts
- Learnings from previous story completion notes

**Per-story cycle:**
```
bmad-create-story (story file with full context)
        ↓
bmad-dev-story (AI agent implements all tasks)
        ↓
[bmad-code-review] (selected stories)
        ↓
sprint-status.yaml updated (story → done)
        ↓
next story
```

### Epic Results

| Epic | Stories | Deliverable |
|------|---------|-------------|
| Epic 1: Foundation | 7 stories | Full-stack dev environment, Docker, health checks |
| Epic 2: Core Todo | 9 stories | Complete CRUD app with optimistic UI |
| Epic 3: UX/Design | 10 stories | Design system, animations, responsive, WCAG 2.1 AA |
| Epic 4: Testing/QA | 9 stories | Playwright E2E suite, coverage/security/accessibility/QA reports |
| Continuous: Docs | 3 stories | README, AI integration log, this document |
| **Total** | **41 stories** | **Production-ready full-stack application** |

---

## Benefits of BMAD Observed

### 1. Specifications Eliminated Implementation Ambiguity

Without the PRD + Architecture, an AI agent asked to "build a todo app" would make dozens of arbitrary decisions (which state management? what folder structure? how to handle errors?). With full BMAD artifacts, the AI had answers to these questions before writing a single line of code.

**Concrete example:** The optimistic UI rollback logic (FR16) could have been implemented dozens of ways. Architecture specified React Context + useReducer + temp IDs. Every story that touched state management referenced this pattern consistently across 9 stories in Epic 2.

### 2. Traceability from Requirement to Code

Every implemented feature can be traced back to its origin:
```
docs/accessibility-report.md 
  → Story 3.9 (a11y audit) 
    → Epic 3 (Professional UX) 
      → WCAG 2.1 AA requirement 
        → PRD NFR Accessibility section 
          → Product Brief (responsive design, multiple browsers)
```

This traceability meant that when a test failed or a review caught an issue, root cause analysis was straightforward.

### 3. AI Implementation Quality Significantly Higher

Stories with detailed dev notes (file paths, architecture references, pattern examples) produced correct first-pass implementations ~80% of the time. Stories without this context required 2-3 iterations.

**The BMAD story format essentially pre-answered all the questions an AI agent would otherwise ask or guess at.**

### 4. Testing Requirements Were Clear from Sprint Start

Because the PRD defined testing requirements (unit + integration + E2E, minimum 70% coverage, 5 required E2E scenarios), stories in Epic 4 had clear, unambiguous acceptance criteria. There was no debate about "how much testing is enough?"

### 5. Consistent Patterns Across 41 Stories

Because the architecture document established patterns (service layer, Zod validation, error response structure), AI agents implementing story 2.3 (API endpoints) and story 4.8 (security review) both operated from the same mental model of how the codebase was structured.

---

## Lessons Learned

### What Worked Well

**Story file quality is the multiplier.** The `bmad-create-story` skill — when given thorough upstream artifacts — produced story files that made `bmad-dev-story` implementations straightforward. The time investment in creating detailed dev notes paid off 10× in implementation quality.

**BDD acceptance criteria are directly executable.** Writing ACs as "Given/When/Then" statements meant AI agents could verify their own implementations against clear, testable conditions. When an AC wasn't satisfied, it was obvious.

**BMAD's sequential artifact chain prevented context drift.** Each artifact explicitly referencing the previous one (PRD references product brief, architecture references PRD + UX, stories reference all three) created a consistent thread through 6+ weeks of development.

**Continuous documentation stories (D1-D3) belong in the sprint from the start.** These three stories should be created alongside the sprint plan, not as an afterthought — especially D2 (AI integration log), which is most valuable when maintained throughout implementation rather than reconstructed at the end.

### Challenges Encountered

**Version-specific AI knowledge degraded for newer library versions.** Prisma v7, Next.js 16, and Express 5 all had API changes from versions in the AI's training data. Including exact version numbers in dev notes (sourced from package.json) was essential.

**Docker/infrastructure config required more human oversight.** Container networking, health check timing, and multi-stage build optimization were areas where AI needed more explicit guidance than application-layer code.

**The optimistic UI rollback edge case (rapid successive operations) wasn't in any spec.** FR11 mentioned "rapid successive operations without duplication or data loss" but the implementation detail required human reasoning about React state batching behavior.

**Sprint status management was manual.** Updating sprint-status.yaml after each story completion was a manual step. An automated hook would reduce friction in the cycle.

### Recommendations for Future BMAD Projects

1. **Create D-series documentation stories at sprint planning time** — add them to the epic before implementation begins so the AI integration log can be maintained incrementally.

2. **Include exact package versions in architecture.md** — this single change would eliminate ~70% of version-specific AI code generation errors.

3. **Add a "code patterns" section to architecture.md** — concrete code examples of key patterns (service layer, Zod schema, test mocking) rather than just descriptions give AI agents better anchors.

4. **Use `bmad-code-review` for all stories in critical paths** — for this project, full review was run on selected stories. Running it on all Epic 2 and Epic 3 stories would have caught the rapid succession edge case earlier.

5. **Consider `bmad-sprint-status` after each epic** — brief status checks at epic boundaries catch drift before it compounds.

---

## Artifact Reference

All BMAD planning artifacts are in `_bmad-output/planning-artifacts/`:

| Artifact | Path | Purpose |
|---------|------|---------|
| Product Brief | `planning-artifacts/product-brief.md` | Initial vision and scope |
| PRD | `planning-artifacts/prd.md` | 21 FRs + NFRs + success criteria |
| PRD Validation | `planning-artifacts/prd-validation-report.md` | Quality gate before architecture |
| UX Design | `planning-artifacts/ux-design-specification.md` | 20 UX-DRs + visual spec |
| Architecture | `planning-artifacts/architecture.md` | Technology + patterns + testing strategy |
| Epics | `planning-artifacts/epics.md` | 41 stories with ACs + BDD format |
| Readiness Report | `planning-artifacts/implementation-readiness-report-*.md` | Pre-implementation gate |
| Sprint Status | `implementation-artifacts/sprint-status.yaml` | Story tracking (all 41 done) |
