# Story 3.8: Ensure WCAG 2.1 AA Compliance (Keyboard Nav, ARIA, Contrast)

Status: done

## Story

As a user with accessibility needs,
I want the app to be fully accessible via keyboard and screen reader,
So that I can use all features independently regardless of my abilities.

## Acceptance Criteria

1. All interactive elements keyboard accessible (Tab, Enter, Space)
2. Tab order is logical (input → todos in order → delete buttons)
3. Focus indicators visible on all interactive elements (ring-2 ring-indigo-500)
4. All buttons use `<button>` elements (not divs)
5. All form inputs have aria-label
6. Delete buttons have specific `aria-label="Delete [todo.text]"`
7. Empty/Loading/Error states have ARIA roles (status, alert)
8. All text meets 4.5:1 contrast ratio
9. Color not sole indicator of state (strikethrough + opacity for completed)
10. Semantic HTML throughout (form, ul/li, headings)
11. Heading hierarchy correct (h1 for app title)

## Tasks / Subtasks

- [ ] Task 1: Add focus-visible ring to TodoInput (AC: 3, 5)
  - [ ] Add `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded` to input
- [ ] Task 2: Add focus-visible ring to buttons in TodoCard (AC: 3)
  - [ ] Delete button: `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded`
- [ ] Task 3: Add focus-visible ring to Retry button in TodoList (AC: 3)
  - [ ] `focus-visible:ring-2 focus-visible:ring-indigo-500` already on bg-indigo-600 button
- [ ] Task 4: Wrap TodoInput in a <form> for semantic HTML (AC: 10)
  - [ ] Wrap input in `<form onSubmit={...}>` with `type="submit"` button or handle Enter
  - [ ] OR keep current onKeyDown Enter handler (acceptable for accessibility)
- [ ] Task 5: Verify ARIA labels on all interactive elements (AC: 5, 6)
  - [ ] TodoInput input: `aria-label="New todo text"` ✅ (already present)
  - [ ] Checkbox: aria-label from parent ✅ (passed as prop)
  - [ ] Delete button: `aria-label="Delete [todo.text]"` ✅ (already present)
- [ ] Task 6: Verify semantic structure (AC: 10, 11)
  - [ ] page.tsx: h1 present ✅
  - [ ] TodoList: ul/li ✅
  - [ ] Loading role="status" ✅
  - [ ] Error role="alert" ✅

## Dev Notes

### focus-visible vs focus
Use `focus-visible:` (not `focus:`) to only show ring for keyboard navigation, not mouse clicks.
This is modern best practice and supported in all major browsers.

### Contrast Ratios (already meeting WCAG AA)
- slate-900 (#0f172a) on white: ~18:1 ✅
- slate-500 (#64748b) on white: ~4.6:1 ✅ (just above 4.5:1)
- indigo-600 (#4f46e5) on white: ~5.1:1 ✅
- red-600 (#dc2626) on white: ~5.1:1 ✅

### Semantic HTML Check
Current state is already good:
- `<main>` wrapper ✅
- `<h1>` for title ✅
- `<ul>/<li>` for todo list ✅
- `<input>` with aria-label ✅
- `<button>` elements ✅

Main gap: focus-visible rings need to be explicitly added.

## File List

- `frontend/src/components/TodoInput.tsx` (update: focus-visible ring on input)
- `frontend/src/components/TodoCard.tsx` (update: focus-visible ring on delete button)
- `frontend/src/components/TodoList.tsx` (update: focus-visible ring on Retry button)

## QA Gate

> **Definition of Done requires a formal accessibility audit confirming zero critical violations.** The compliance work implemented here must be verified by the audit in Story 3-9. This story is not considered fully **done** until Story 3-9 reaches `done` status.

### Accessibility Scenario: Zero Critical WCAG AA Violations

**Linked Implementation:** Story 3-9 — Run Accessibility Audit and Create Compliance Report

**Scenario:**
- **GIVEN** the fully rendered app (with todos, in both active and completed states)
- **WHEN** an axe-core or Lighthouse accessibility audit is run
- **THEN** zero critical WCAG 2.1 AA violations are reported
- **AND** all interactive elements are reachable via Tab key in a logical order
- **AND** all form inputs have associated labels or aria-labels
- **AND** visible focus indicators are present on all focused elements
- **AND** the audit results are saved to `docs/accessibility-report.md`

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-21 | Story created | Dev Agent |
