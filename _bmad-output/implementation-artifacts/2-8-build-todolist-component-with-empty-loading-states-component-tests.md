# Story 2.8: Build TodoList Component with Empty/Loading States + Component Tests

Status: done

## Story

As a developer,
I want a TodoList component that displays all todos with proper loading and empty states,
so that users always see appropriate feedback regardless of data state.

## Acceptance Criteria

1. Component consumes `todos`, `isLoading`, `error` from `useTodos()` hook
2. When `isLoading` is true, shows "Loading your todos..." message
3. When `error` is not null, shows error message with "Retry" button that calls `refetchTodos()`
4. When todos array is empty (and not loading), shows "No todos yet" or "Ready when you are!"
5. When todos exist, renders a list of `TodoCard` components
6. TodoCards are rendered in the order provided (newest first from API)
7. List uses semantic `<ul>` with `<li>` wrappers for each TodoCard
8. Component tests verify loading state displayed when `isLoading` is true
9. Component tests verify empty state displayed when todos is empty array
10. Component tests verify error state displayed when error is set
11. Component tests verify TodoCards rendered for each todo
12. All component tests pass

## Tasks / Subtasks

- [x] Task 1: Implement TodoList component (AC: 1-7)
  - [x] Create `frontend/src/components/TodoList.tsx` with `'use client'`
  - [x] Import `useTodos` from context, `TodoCard` from `./TodoCard`
  - [x] Conditional rendering:
    - `isLoading` → loading message
    - `error` → error message + Retry button
    - `todos.length === 0` → empty state message
    - else → `<ul>` with `{todos.map(todo => <li key={todo.id}><TodoCard todo={todo} /></li>)}`
  - [x] Loading: `<p role="status">Loading your todos...</p>`
  - [x] Error: `<div role="alert"><p>{error}</p><button onClick={refetchTodos}>Retry</button></div>`
  - [x] Empty: `<p>No todos yet. Ready when you are!</p>`
- [x] Task 2: Write component tests (AC: 8-12)
  - [x] Create `frontend/src/components/__tests__/TodoList.test.tsx`
  - [x] Mock `useTodos` hook for different states
  - [x] Mock `TodoCard` component: `jest.mock('../TodoCard', () => ({ TodoCard: ({ todo }) => <div data-testid="todo-card">{todo.text}</div> }))`
  - [x] Test: loading state renders "Loading your todos..."
  - [x] Test: error state renders error message + retry button
  - [x] Test: retry button calls `refetchTodos`
  - [x] Test: empty state renders empty message
  - [x] Test: todos array renders correct number of TodoCard components
  - [x] Run `cd frontend && npm test -- --testPathPattern=TodoList`

## Dev Notes

### Architecture Patterns
- **Semantic HTML**: `<ul>`/`<li>` for list, `role="status"` for loading, `role="alert"` for errors
- **State priority**: isLoading takes precedence over error; error takes precedence over empty state

### File Paths
- `frontend/src/components/TodoList.tsx` (NEW)
- `frontend/src/components/__tests__/TodoList.test.tsx` (NEW)

### References
- Story 2.7 TodoCard: `frontend/src/components/TodoCard.tsx`
- Story 2.4 context: `frontend/src/lib/context/TodoContext.tsx`
- Epic AC: [Source: _bmad-output/planning-artifacts/epics.md#Story 2.8]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List

### Change Log
