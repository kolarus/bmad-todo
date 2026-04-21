# Story 3.3: Create Custom Checkbox Component with Indigo Styling

Status: done

## Story

As a user,
I want checkboxes that are visually clear and satisfying to interact with,
So that marking todos complete feels polished and intentional.

## Acceptance Criteria

1. Checkbox is 20px × 20px square
2. Unchecked state has border-2 border-slate-300, white background, rounded corners
3. Checked state has bg-indigo-600 background with white checkmark SVG icon
4. Hover on unchecked checkbox darkens border to border-slate-400
5. Focus shows visible ring-2 ring-indigo-500 ring-offset-2
6. Checkbox uses native `<input type="checkbox">` (visually hidden) for accessibility
7. Custom styled element overlays/wraps the native input
8. Checkbox state is announced by screen readers
9. Space bar toggles checkbox when focused
10. Component tests verify checked/unchecked visual states and keyboard interaction

## Tasks / Subtasks

- [ ] Task 1: Create Checkbox component (AC: 1-9)
  - [ ] Create `frontend/src/components/Checkbox.tsx`
  - [ ] Hidden native input + custom visual overlay using relative positioning
  - [ ] SVG checkmark for checked state
  - [ ] Tailwind classes for states: unchecked, checked, hover, focus
- [ ] Task 2: Integrate Checkbox into TodoCard (AC: 1-9)
  - [ ] Replace `<input type="checkbox" ... accent-indigo-600>` with `<Checkbox>`
  - [ ] Pass `checked`, `onChange`, `aria-label` as props
- [ ] Task 3: Write component tests (AC: 10)
  - [ ] Create `frontend/src/components/__tests__/Checkbox.test.tsx`
  - [ ] Test: renders unchecked state with correct ARIA
  - [ ] Test: renders checked state when checked prop is true
  - [ ] Test: calls onChange on click
  - [ ] Test: Space key toggles when focused

## Dev Notes

### Custom Checkbox Pattern
Replace `accent-indigo-600` approach with fully custom component:

```tsx
// frontend/src/components/Checkbox.tsx
'use client';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  'aria-label': string;
}

export function Checkbox({ checked, onChange, 'aria-label': ariaLabel }: CheckboxProps) {
  return (
    <label className="relative flex items-center justify-center w-5 h-5 flex-shrink-0 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`
          w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-150
          focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2
          ${checked
            ? 'bg-indigo-600 border-indigo-600'
            : 'bg-white border-slate-300 hover:border-slate-400'
          }
        `}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
          </svg>
        )}
      </span>
    </label>
  );
}
```

### Focus Ring on Hidden Input
Use `peer` + `peer-focus-visible:ring-2` pattern or use `focus-within` on the label wrapper so focus ring appears on the visual span when native input is focused.

### Testing with sr-only Input
In tests, query by role="checkbox" (the native input is still accessible even when sr-only). RTL finds it via getByRole('checkbox').

### Previous Work Context
- TodoCard uses `<input type="checkbox" className="h-5 w-5 ... accent-indigo-600">`
- This will be replaced with `<Checkbox>` component

## File List

- `frontend/src/components/Checkbox.tsx` (new)
- `frontend/src/components/TodoCard.tsx` (update: replace checkbox)
- `frontend/src/components/__tests__/Checkbox.test.tsx` (new)

## QA Gate

> **Definition of Done requires both E2E and accessibility verification.** The checkbox must be exercisable via keyboard and screen reader and must correctly reflect toggle state in a real browser. This story is not considered fully **done** until Stories **4-2** and **3-9** both reach `done` status.

### E2E Scenario: Checkbox Toggles Todo Completion in the Browser

**Linked Implementation:** Story 4-2 — E2E Test: Happy Path Full CRUD Cycle

**Scenario:**
- **GIVEN** an active todo exists in the list
- **WHEN** the user clicks the custom checkbox
- **THEN** the checkbox transitions to indigo-600 background with a white checkmark
- **AND** the todo text shows a strikethrough
- **WHEN** the user clicks the checkbox again
- **THEN** the checkbox returns to its unchecked state (white background, slate-300 border)

### Accessibility Scenario: Checkbox Is Keyboard and Screen Reader Accessible

**Linked Implementation:** Story 3-9 — Run Accessibility Audit and Create Compliance Report

**Scenario:**
- **GIVEN** the checkbox is focused via Tab key
- **WHEN** the user presses Space
- **THEN** the checkbox toggles state
- **AND** screen reader announces the new checked/unchecked state
- **AND** focus indicator (ring-2 ring-indigo-500) is visually present

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-21 | Story created | Dev Agent |
