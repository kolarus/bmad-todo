# Story 2.6: Build TodoInput Component with Validation + Component Tests

Status: done

## Story

As a developer,
I want a TodoInput component that handles todo creation with proper validation,
so that users can quickly add todos with a clean, accessible input experience.

## Acceptance Criteria

1. Component renders as a card (white bg, border, shadow, rounded) with a text input field
2. Input has placeholder "What needs to be done?"
3. Input auto-focuses on page load and after successful submission
4. Pressing Enter key submits the form
5. Empty or whitespace-only input silently does nothing (no error message shown)
6. Valid input (1–500 chars) calls `addTodo` from context
7. Input clears and refocuses after successful submission
8. Component limits input to 500 characters via `maxLength` attribute
9. Component tests verify auto-focus behavior
10. Component tests verify Enter key submission
11. Component tests verify empty input does nothing
12. Component tests verify valid input calls addTodo
13. Component tests verify input clears after submission
14. All component tests pass

## Tasks / Subtasks

- [x] Task 1: Implement TodoInput component (AC: 1-8)
  - [x] Create `frontend/src/components/TodoInput.tsx` with `'use client'`
  - [x] Use `useRef<HTMLInputElement>` for focus management
  - [x] `useEffect` to auto-focus on mount
  - [x] Form with `onSubmit` handler: prevent default, trim value, validate (non-empty), call `addTodo`, clear + refocus
  - [x] Input: `placeholder="What needs to be done?"`, `maxLength={500}`
  - [x] Styling: white bg card, `rounded-lg border border-slate-200 shadow-sm p-4`
  - [x] Input styling: `w-full outline-none text-slate-900 bg-transparent`
- [x] Task 2: Write component tests (AC: 9-14)
  - [x] Create `frontend/src/components/__tests__/TodoInput.test.tsx`
  - [x] Mock `useTodos` hook: `jest.mock('../../lib/context/TodoContext')`
  - [x] Test: input is focused on render (`document.activeElement` or `focus` mock)
  - [x] Test: pressing Enter with valid text calls `addTodo` with trimmed value
  - [x] Test: pressing Enter with empty text does NOT call `addTodo`
  - [x] Test: pressing Enter with whitespace-only text does NOT call `addTodo`
  - [x] Test: input clears after successful submission
  - [x] Run `cd frontend && npm test -- --testPathPattern=TodoInput`

## Dev Notes

### Architecture Patterns
- **'use client'**: Required (event handlers, refs, hooks)
- **Styling**: Minimal Epic 2 styling (full design system comes in Epic 3). Use basic card structure now
- **Auto-focus**: Use `useRef` + `useEffect(() => { inputRef.current?.focus() }, [])`
- **Validation**: Use `todoCreateSchema.safeParse({ text: value.trim() })` from `../lib/validation/todo`
- **Form submission**: `onKeyDown` checking `e.key === 'Enter'` or `<form onSubmit>` pattern

### Key Component Structure
```tsx
'use client';
import { useRef, useEffect } from 'react';
import { useTodos } from '../lib/context/TodoContext';

export function TodoInput() {
  const { addTodo } = useTodos();
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => { inputRef.current?.focus(); }, []);
  
  const handleSubmit = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    await addTodo(trimmed);
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };
  
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
      <input
        ref={inputRef}
        type="text"
        placeholder="What needs to be done?"
        maxLength={500}
        className="w-full outline-none text-slate-900 bg-transparent"
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e.currentTarget.value); }}
        aria-label="New todo text"
      />
    </div>
  );
}
```

### Testing Pattern
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoInput } from '../TodoInput';
const mockAddTodo = jest.fn().mockResolvedValue(undefined);
jest.mock('../../lib/context/TodoContext', () => ({
  useTodos: () => ({ addTodo: mockAddTodo }),
}));
```

### File Paths
- `frontend/src/components/TodoInput.tsx` (NEW)
- `frontend/src/components/__tests__/TodoInput.test.tsx` (NEW)

### References
- Story 2.4/2.5 TodoContext: `frontend/src/lib/context/TodoContext.tsx`
- Story 2.1 validation: `frontend/src/lib/validation/todo.ts`
- Epic UX-DR3: [Source: _bmad-output/planning-artifacts/epics.md]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List

### Change Log
