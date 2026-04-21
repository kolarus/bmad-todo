# Story 2.7: Build TodoCard Component with Toggle and Delete + Component Tests

Status: done

## Story

As a developer,
I want a TodoCard component that displays a todo with toggle and delete actions,
so that users can manage individual todos with clear visual feedback.

## Acceptance Criteria

1. Component renders todo text, checkbox, and delete button in flex layout
2. Checkbox is checked when `todo.completed` is true
3. Clicking checkbox calls `toggleTodo` from context
4. Completed todos show visual distinction (opacity reduction + text strikethrough)
5. Delete button (×) is visible, clicking it calls `deleteTodo` from context
6. Delete button has `aria-label="Delete [todo.text]"` for accessibility
7. Long todo text (up to 500 chars) wraps properly without breaking layout
8. Component tests verify checkbox toggles on click
9. Component tests verify delete button calls deleteTodo
10. Component tests verify completed state visual feedback (class presence)
11. Component tests verify accessibility (ARIA labels)
12. All component tests pass

## Tasks / Subtasks

- [x] Task 1: Implement TodoCard component (AC: 1-7)
  - [x] Create `frontend/src/components/TodoCard.tsx` with `'use client'`
  - [x] Props: `todo: Todo`
  - [x] Layout: `flex items-center gap-3 bg-white rounded-lg border border-slate-200 shadow-sm p-4`
  - [x] Checkbox: `<input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)}`
  - [x] Todo text: `<span className={todo.completed ? 'line-through opacity-60 flex-1' : 'flex-1'}>{todo.text}</span>`
  - [x] Delete button: `<button onClick={() => deleteTodo(todo.id)} aria-label={`Delete ${todo.text}`}>×</button>`
  - [x] Text wrapping: use `break-words` or `break-all` for very long strings
- [x] Task 2: Write component tests (AC: 8-12)
  - [x] Create `frontend/src/components/__tests__/TodoCard.test.tsx`
  - [x] Mock `useTodos` hook
  - [x] Test: checkbox renders checked when `todo.completed = true`
  - [x] Test: clicking checkbox calls `toggleTodo` with correct id
  - [x] Test: clicking delete calls `deleteTodo` with correct id
  - [x] Test: completed todo has `line-through` class on text
  - [x] Test: delete button has correct `aria-label`
  - [x] Run `cd frontend && npm test -- --testPathPattern=TodoCard`

## Dev Notes

### Component Props
```typescript
import { Todo } from '../lib/types/todo';
interface TodoCardProps { todo: Todo; }
```

### Styling Notes
- Basic card styling for Epic 2; full design system (animations, hover states) comes in Epic 3
- Completed: `line-through opacity-60` on the text span
- Delete button: minimal styling with `ml-auto text-slate-400 hover:text-red-600`
- Checkbox: browser default for Epic 2; custom checkbox in Epic 3

### File Paths
- `frontend/src/components/TodoCard.tsx` (NEW)
- `frontend/src/components/__tests__/TodoCard.test.tsx` (NEW)

### References
- `frontend/src/lib/types/todo.ts` — Todo type
- Epic UX-DR4-5: [Source: _bmad-output/planning-artifacts/epics.md]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List

### Change Log
