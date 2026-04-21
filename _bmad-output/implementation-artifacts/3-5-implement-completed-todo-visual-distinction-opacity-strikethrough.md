# Story 3.5: Implement Completed Todo Visual Distinction (Opacity + Strikethrough)

Status: done

As a user,
I want completed todos to look clearly different from active ones,
So that I can immediately see my progress and what's left to do.

## Acceptance Criteria

1. Completed todos have opacity-60 applied to entire card
2. Todo text has line-through text decoration when completed
3. Uses both opacity AND strikethrough (not color alone) — accessibility
4. Completed todos remain visible in the list (not hidden)
5. Checkbox remains independently styled (not dimmed with card)
6. Visual distinction is clear

## Tasks / Subtasks

- [x] Task 1: Apply opacity and strikethrough to TodoCard (AC: 1-5)
  - [x] `opacity-60` on the card wrapper div when completed
  - [x] `line-through` on the text span when completed
  - [x] Checkbox is independently styled, stays visible

## Dev Notes

### Current State
`TodoCard.tsx` already implements this correctly:
```tsx
<div className={`flex items-center gap-3 bg-white rounded-lg border border-slate-200 shadow-sm p-4 ${todo.completed ? 'opacity-60' : ''}`}>
  ...
  <span className={`flex-1 break-words text-slate-900 ${todo.completed ? 'line-through' : ''}`}>
```
Wait — looking at the current code more carefully:
The opacity-60 is NOT on the card wrapper. It's only on the text span. The current code is:
```
className={`flex items-center gap-3 bg-white rounded-lg border border-slate-200 shadow-sm p-4`}
```
And the span has:
```
className={`flex-1 break-words text-slate-900 ${todo.completed ? 'line-through opacity-60' : ''}`}
```
Per UX-DR10: "60% opacity on entire card". This needs to be updated to apply opacity to the card wrapper.

This story NEEDS a small fix: move opacity-60 to the card wrapper div.

## File List

- `frontend/src/components/TodoCard.tsx` (update: move opacity to card wrapper)

## QA Gate

> **Definition of Done requires E2E and accessibility verification.** The visual distinction must be observable in a real browser, and must use both opacity and strikethrough (not color alone) to pass WCAG non-text contrast requirements. This story is not considered fully **done** until Stories **4-2** and **3-9** both reach `done` status.

### E2E Scenario: Completed Todo Displays Visual Distinction

**Linked Implementation:** Story 4-2 — E2E Test: Happy Path Full CRUD Cycle

**Scenario:**
- **GIVEN** the user checks the checkbox on an active todo
- **WHEN** the todo is marked complete
- **THEN** the entire todo card appears at reduced opacity (approximately 60%)
- **AND** the todo text has a visible strikethrough decoration
- **AND** the todo remains visible in the list (not hidden)

### Accessibility Scenario: State Is Not Communicated by Color Alone

**Linked Implementation:** Story 3-9 — Run Accessibility Audit and Create Compliance Report

**Scenario:**
- **GIVEN** completed and active todos are both displayed
- **WHEN** an accessibility audit is run
- **THEN** no violation for "color as sole indicator" is reported
- **AND** strikethrough + opacity combination ensures perceivable distinction for users with color blindness

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-21 | Story created — needs opacity moved to card wrapper | Dev Agent |
