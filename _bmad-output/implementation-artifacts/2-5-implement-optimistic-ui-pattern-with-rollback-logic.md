# Story 2.5: Implement Optimistic UI Pattern with Rollback Logic

Status: done

## Story

As a developer,
I want optimistic UI updates with automatic rollback on failure,
so that the app feels instant while remaining honest about errors.

## Acceptance Criteria

1. `addTodo` immediately adds todo to local state with a temporary ID (e.g., `temp-${Date.now()}`)
2. `addTodo` calls POST API in background; on success, replaces temp todo with server response
3. On `addTodo` API failure, temp todo is removed and `toastError` is called with specific message
4. `toggleTodo` immediately updates `todo.completed` in local state
5. `toggleTodo` calls PATCH API in background; on failure, reverts `todo.completed` and calls `toastError`
6. `deleteTodo` immediately removes todo from local state
7. `deleteTodo` calls DELETE API in background; on failure, restores todo to list and calls `toastError`
8. `toastError(message)` is a method in context that components can use to trigger toast display
9. Unit tests verify optimistic updates happen before API completes
10. Unit tests verify rollback on API failure for all three operations
11. All tests pass

## Tasks / Subtasks

- [ ] Task 1: Refactor TodoContext to support optimistic UI and toast (AC: 1-8)
  - [ ] Add `toastMessage: string | null` and `toastError(msg: string)` to context
  - [ ] `addTodo(text: string)`:
    - Create temp todo object with `id: \`temp-${Date.now()}\`` and `completed: false`
    - Optimistically add to `todos` state via `setTodos(prev => [tempTodo, ...prev])`
    - Call `api.createTodo(text)` in background
    - On success: replace temp with server todo: `setTodos(prev => prev.map(t => t.id === tempId ? serverTodo : t))`
    - On failure: remove temp todo + call `toastError("Couldn't save your todo. Check your connection.")`
  - [x] `toggleTodo(id: string)`:
    - Optimistically flip `completed` in state
    - Call `api.updateTodo(id, { completed: !current.completed })`
    - On failure: revert flip + call `toastError("Couldn't update your todo. Check your connection.")`
  - [x] `deleteTodo(id: string)`:
    - Save current todo, optimistically remove from state
    - Call `api.deleteTodo(id)`
    - On failure: restore todo + call `toastError("Couldn't delete your todo. Check your connection.")`
- [x] Task 2: Update context tests for optimistic behavior (AC: 9, 10, 11)
  - [x] Update `frontend/src/lib/context/__tests__/TodoContext.test.tsx`
  - [x] Test: `addTodo` adds temp todo immediately (mock api to delay resolution)
  - [x] Test: `addTodo` replaces temp with server todo on success
  - [x] Test: `addTodo` removes temp todo on failure
  - [x] Test: `toggleTodo` flips completed immediately
  - [x] Test: `toggleTodo` reverts on failure
  - [x] Test: `deleteTodo` removes immediately
  - [x] Test: `deleteTodo` restores on failure
  - [x] Run `cd frontend && npm test -- --testPathPattern=TodoContext`

## Dev Notes

### Architecture Patterns
- **Optimistic UI**: Immediate state update → background API call → rollback on failure
- **Rollback pattern**: Save previous state before mutation, restore on catch
- **Toast integration**: Context manages `toastMessage` state; components read it to display toast

### Key Implementation Details
```typescript
// addTodo optimistic pattern
const addTodo = async (text: string) => {
  const tempId = `temp-${Date.now()}`;
  const tempTodo: Todo = { id: tempId, text, completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  setTodos(prev => [tempTodo, ...prev]);
  try {
    const serverTodo = await api.createTodo(text);
    setTodos(prev => prev.map(t => t.id === tempId ? serverTodo : t));
  } catch {
    setTodos(prev => prev.filter(t => t.id !== tempId));
    toastError("Couldn't save your todo. Check your connection.");
  }
};

// toggleTodo rollback pattern
const toggleTodo = async (id: string) => {
  const prev = todos.find(t => t.id === id);
  if (!prev) return;
  setTodos(ts => ts.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  try {
    await api.updateTodo(id, { completed: !prev.completed });
  } catch {
    setTodos(ts => ts.map(t => t.id === id ? { ...t, completed: prev.completed } : t));
    toastError("Couldn't update your todo. Check your connection.");
  }
};
```

### File Paths
- `frontend/src/lib/context/TodoContext.tsx` (MODIFY — add optimistic logic + toast)
- `frontend/src/lib/context/__tests__/TodoContext.test.tsx` (MODIFY — add optimistic tests)

### Testing Async Optimistic Updates
Use `jest.fn()` that returns a promise you can control:
```typescript
const mockCreate = jest.fn().mockResolvedValue(serverTodo);
// Check state before promise resolves using act() carefully
```

### References
- Story 2.4 TodoContext: `frontend/src/lib/context/TodoContext.tsx`
- Architecture optimistic UI: [Source: _bmad-output/planning-artifacts/architecture.md#State Management]
- Epic UX-DR18-20: [Source: _bmad-output/planning-artifacts/epics.md#UX-DR Coverage]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List

### Change Log
