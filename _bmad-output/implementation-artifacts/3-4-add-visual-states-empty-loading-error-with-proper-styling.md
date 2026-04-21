# Story 3.4: Add Visual States (Empty, Loading, Error) with Proper Styling

Status: done

## Story

As a user,
I want clear, friendly visual feedback for empty, loading, and error states,
So that I always understand what's happening and never feel lost.

## Acceptance Criteria

1. EmptyState shows centered "No todos yet" / "Ready when you are!" with welcoming text-slate-600, py-12
2. LoadingState shows "Loading your todos..." with a spinner, centered, py-12, text-slate-600
3. LoadingState has role="status" and aria-live="polite"
4. ErrorState shows "Couldn't load your todos" and "Check your connection" in red-600
5. ErrorState has bg-indigo-600 text-white "Retry" button
6. ErrorState has role="alert"
7. ErrorToast uses bg-red-50 border-l-4 border-red-600 with shadow-lg
8. ErrorToast auto-dismisses after 5 seconds
9. All states match the UX specification

## Tasks / Subtasks

- [ ] Task 1: Enhance EmptyState in TodoList (AC: 1)
  - [ ] Update empty state markup in `TodoList.tsx`: add py-12, text-lg, text-slate-500
- [ ] Task 2: Add spinner to LoadingState in TodoList (AC: 2, 3)
  - [ ] Add SVG spinner animation to the loading state
  - [ ] Keep role="status" aria-live="polite"
- [ ] Task 3: Enhance ErrorState in TodoList (AC: 4-6)
  - [ ] Two-line message: "Couldn't load your todos" + "Check your connection"
  - [ ] Keep role="alert" and Retry button with indigo styling
- [ ] Task 4: Enhance ErrorToast styling (AC: 7, 8)
  - [ ] Update `ErrorToast.tsx`: use bg-red-50 border-l-4 border-red-600 text-red-800
  - [ ] Add shadow-lg, keep role="alert" and auto-dismiss

## Dev Notes

### Loading Spinner (CSS-only, no library)
```tsx
<div role="status" aria-live="polite" className="flex flex-col items-center py-12 gap-3">
  <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
  <p className="text-slate-500">Loading your todos...</p>
</div>
```

### ErrorToast New Styling
```tsx
<div
  role="alert"
  aria-live="assertive"
  className="fixed bottom-4 right-4 z-50 max-w-sm bg-red-50 border-l-4 border-red-600 text-red-800 px-4 py-3 rounded-lg shadow-lg"
>
  <p className="text-sm font-medium">{toastMessage}</p>
</div>
```

### Current State (TodoList.tsx)
- Loading: `<p role="status" aria-live="polite">Loading your todos...</p>` (no spinner)
- Error: basic red text + Retry button (already good structure)
- Empty: `<p className="text-center text-slate-500 py-8">No todos yet...</p>` (needs py-12, text-lg)

### Current State (ErrorToast.tsx)
- Uses `bg-red-600 text-white` — needs to change to `bg-red-50 border-l-4 border-red-600 text-red-800`

## File List

- `frontend/src/components/TodoList.tsx` (update: enhanced states)
- `frontend/src/components/ErrorToast.tsx` (update: new styling)

## QA Gate

> **Definition of Done requires both E2E and accessibility verification.** The error state and toast must be exercisable in a real browser under failure conditions, and all ARIA roles must be verified by audit. This story is not considered fully **done** until Stories **4-5** and **3-9** both reach `done` status.

### E2E Scenario: Error State and Toast Are Visible on Backend Failure

**Linked Implementation:** Story 4-5 — E2E Test: Error Recovery Flow

**Scenario:**
- **GIVEN** the backend is unavailable
- **WHEN** the user performs an operation that triggers a failure
- **THEN** the ErrorToast appears with red accent styling in the bottom-right corner
- **AND** the toast displays a specific actionable error message
- **AND** the toast auto-dismisses after approximately 5 seconds
- **WHEN** the initial page load fails
- **THEN** the ErrorState component is shown with a visible "Retry" button

### Accessibility Scenario: State Components Have Correct ARIA Roles

**Linked Implementation:** Story 3-9 — Run Accessibility Audit and Create Compliance Report

**Scenario:**
- **GIVEN** the app renders an error or loading state
- **WHEN** an accessibility audit is run
- **THEN** LoadingState reports `role="status"` with `aria-live="polite"`
- **AND** ErrorState and ErrorToast report `role="alert"` for immediate screen reader announcement
- **AND** no critical ARIA violations are detected

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-21 | Story created | Dev Agent |
