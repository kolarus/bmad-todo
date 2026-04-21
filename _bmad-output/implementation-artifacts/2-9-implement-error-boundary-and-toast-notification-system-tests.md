# Story 2.9: Implement Error Boundary and Toast Notification System + Tests

Status: done

## Story

As a developer,
I want an Error Boundary and toast notification system for graceful error handling,
so that errors never crash the app and users always receive clear feedback.

## Acceptance Criteria

1. `ErrorBoundary` component catches React render errors and displays fallback UI (not stack trace)
2. `ErrorBoundary` logs errors to console for debugging
3. `ErrorBoundary` provides "Retry" button that resets the boundary state (re-mounts children)
4. `ErrorToast` component displays temporary notifications with auto-dismiss after 5 seconds
5. Toast shows specific error messages passed to it
6. Toast has `role="alert"` for screen reader announcement
7. Toast is positioned bottom-right with red accent styling
8. `TodoContext` uses `toastError` (from Story 2.5) and `ErrorToast` reads `toastMessage` from context
9. Multiple calls to `toastError` replace the current toast (simple single-toast implementation)
10. Component tests verify ErrorBoundary catches errors and shows fallback UI
11. Component tests verify ErrorBoundary retry resets state
12. Component tests verify ErrorToast renders with correct message and role
13. Component tests verify ErrorToast auto-dismisses after 5 seconds
14. All tests pass
15. Main page (`frontend/src/app/page.tsx`) integrates all components (TodoProvider, TodoInput, TodoList, ErrorToast, ErrorBoundary)

## Tasks / Subtasks

- [x] Task 1: Implement ErrorBoundary (AC: 1-3)
  - [x] Create `frontend/src/components/ErrorBoundary.tsx`
  - [x] Class component extending `React.Component<Props, State>` (required for error boundaries)
  - [x] `getDerivedStateFromError`: sets `hasError: true`
  - [x] `componentDidCatch`: logs error to console
  - [x] Fallback UI: message + "Try again" button that calls `setState({ hasError: false })`
  - [x] Props: `children: React.ReactNode`, `fallback?: React.ReactNode` (optional custom fallback)
- [x] Task 2: Implement ErrorToast (AC: 4-9)
  - [x] Create `frontend/src/components/ErrorToast.tsx` with `'use client'`
  - [x] Reads `toastMessage` from `useTodos()` context
  - [x] Uses `useEffect` to auto-dismiss: set a 5-second timer that calls `clearToast()`
  - [x] Rendered only when `toastMessage` is not null
  - [x] Styling: fixed bottom-right, red accent, `role="alert"`, z-index above content
  - [x] Add `clearToast()` method to context (sets `toastMessage` to null)
- [x] Task 3: Integrate everything on main page (AC: 15)
  - [x] Update `frontend/src/app/page.tsx`:
    - Wrap entire app in `TodoProvider`
    - Include `ErrorBoundary` around `TodoList`
    - Render `TodoInput`, `TodoList`, `ErrorToast`
    - Remove old health check code
  - [x] Update `frontend/src/app/layout.tsx` metadata: title "Todo App", description "Simple todo app"
- [x] Task 4: Write ErrorBoundary tests (AC: 10, 11)
  - [x] Create `frontend/src/components/__tests__/ErrorBoundary.test.tsx`
  - [x] Test: renders children when no error
  - [x] Test: shows fallback when child throws (use a component that throws)
  - [x] Test: retry button resets error state (children render again after click)
- [x] Task 5: Write ErrorToast tests (AC: 12, 13)
  - [x] Create `frontend/src/components/__tests__/ErrorToast.test.tsx`
  - [x] Mock `useTodos` to provide a `toastMessage` value
  - [x] Test: renders message with `role="alert"` when `toastMessage` is set
  - [x] Test: does not render when `toastMessage` is null
  - [x] Test: calls `clearToast` after 5 seconds (use `jest.useFakeTimers()`)
  - [x] Run all frontend tests: `cd frontend && npm test`

## Dev Notes

### ErrorBoundary Pattern (Class Component)
```typescript
'use client'; // Note: Error boundaries can be client components
interface State { hasError: boolean; error?: Error; }
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state = { hasError: false };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error('ErrorBoundary caught:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert">
          <p>Something went wrong. Please try again.</p>
          <button onClick={() => this.setState({ hasError: false })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### ErrorToast Auto-dismiss Pattern
```typescript
useEffect(() => {
  if (!toastMessage) return;
  const timer = setTimeout(() => clearToast(), 5000);
  return () => clearTimeout(timer);
}, [toastMessage]);
```

### Context Changes Needed
Add to `TodoContextType` (from Story 2.5):
- `toastMessage: string | null`
- `clearToast: () => void`
These are additions to what was already added in Story 2.5 (`toastError`).

### Page Integration Pattern
```tsx
// frontend/src/app/page.tsx
'use client';
export default function Home() {
  return (
    <TodoProvider>
      <main className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-md mx-auto space-y-3">
          <h1 className="text-2xl font-bold text-slate-900">My Todos</h1>
          <TodoInput />
          <ErrorBoundary>
            <TodoList />
          </ErrorBoundary>
        </div>
        <ErrorToast />
      </main>
    </TodoProvider>
  );
}
```

### File Paths
- `frontend/src/components/ErrorBoundary.tsx` (NEW)
- `frontend/src/components/ErrorToast.tsx` (NEW)
- `frontend/src/components/__tests__/ErrorBoundary.test.tsx` (NEW)
- `frontend/src/components/__tests__/ErrorToast.test.tsx` (NEW)
- `frontend/src/app/page.tsx` (MODIFY — full integration)
- `frontend/src/app/layout.tsx` (MODIFY — update metadata)
- `frontend/src/lib/context/TodoContext.tsx` (MODIFY — add clearToast)

### References
- Story 2.5 context: `frontend/src/lib/context/TodoContext.tsx`
- Architecture error handling: [Source: _bmad-output/planning-artifacts/architecture.md#Error Handling]
- Epic AC 2.9: [Source: _bmad-output/planning-artifacts/epics.md#Story 2.9]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List

### Change Log
