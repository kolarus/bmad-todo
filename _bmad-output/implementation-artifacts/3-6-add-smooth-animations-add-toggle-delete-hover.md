# Story 3.6: Add Smooth Animations (Add, Toggle, Delete, Hover)

Status: done

## Story

As a user,
I want subtle, smooth animations when interacting with todos,
So that the app feels polished and my actions feel tactile and confirmed.

## Acceptance Criteria

1. New todos fade in with 200ms duration and slight slide-down effect (ease-in-out)
2. Todo toggle has 150ms checkbox color transition (bg-color and border-color)
3. Delete action has 200ms fade-out with height collapse (ease-out)
4. Card hover increases shadow (shadow-sm → shadow-md) with 300ms transition
5. Delete button color changes (slate-400 → red-600) on hover with smooth transition
6. All animations respect `prefers-reduced-motion` media query
7. Animation timing matches UX spec (add: 200ms, toggle: 150ms, delete: 200ms, hover: 300ms)

## Tasks / Subtasks

- [ ] Task 1: Add fade-in animation for new todos (AC: 1, 6)
  - [ ] Define `@keyframes fadeInDown` in globals.css
  - [ ] Apply animation via `animate-fade-in-down` custom utility class
  - [ ] Add `@media (prefers-reduced-motion: reduce)` override to disable
- [ ] Task 2: Add checkbox color transition (AC: 2, 6)
  - [ ] `transition-colors duration-150` on the Checkbox's visual span
- [ ] Task 3: Add delete fade-out + height collapse (AC: 3, 6)
  - [ ] Use state-driven class toggling: when todo is being deleted, apply `animate-fade-out`
  - [ ] Or: use CSS transition with opacity + max-height + overflow-hidden
  - [ ] Implement in TodoCard with `isDeleting` state
- [ ] Task 4: Add hover shadow transition on TodoCard (AC: 4, 5, 6)
  - [ ] `transition-shadow duration-300 hover:shadow-md` on card wrapper
  - [ ] Delete button already has hover:text-red-600, add `transition-colors`
- [ ] Task 5: Add prefers-reduced-motion support (AC: 6)
  - [ ] In globals.css: `@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`

## Dev Notes

### Animation Approach
For Tailwind v4, custom animations are defined in globals.css under `@theme` or as `@keyframes`:

```css
/* In globals.css */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@theme inline {
  --animate-fade-in-down: fadeInDown 200ms ease-in-out;
  --animate-fade-out: fadeOut 200ms ease-out forwards;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Delete Animation with Height Collapse
Approach: use a `isDeleting` state in TodoCard. When delete is clicked:
1. Set `isDeleting = true` → applies fade-out class
2. After 200ms timeout → calls `deleteTodo()`

```tsx
const [isDeleting, setIsDeleting] = useState(false);

const handleDelete = () => {
  setIsDeleting(true);
  setTimeout(() => deleteTodo(todo.id), 200);
};
```

```tsx
<div className={`... transition-all duration-200 ${isDeleting ? 'opacity-0 scale-95' : ''}`}>
```

### Hover Shadow Transition
```
className="... transition-shadow duration-300 hover:shadow-md"
```
This is purely CSS and needs no JS state.

### Checkbox Transition
In `Checkbox.tsx`, the visual span already has `transition-colors duration-150`.

## File List

- `frontend/src/app/globals.css` (update: add keyframes + prefers-reduced-motion)
- `frontend/src/components/TodoCard.tsx` (update: hover shadow, delete animation, isDeleting state)
- `frontend/src/components/Checkbox.tsx` (update: verify transition-colors duration-150)

## QA Gate

> **Definition of Done requires accessibility verification.** Animations must respect `prefers-reduced-motion`, which must be confirmed by audit. This story is not considered fully **done** until Story 3-9 reaches `done` status.

### Accessibility Scenario: Animations Respect `prefers-reduced-motion`

**Linked Implementation:** Story 3-9 — Run Accessibility Audit and Create Compliance Report

**Scenario:**
- **GIVEN** a user has `prefers-reduced-motion: reduce` enabled in their OS settings
- **WHEN** an accessibility audit is run against the app
- **THEN** no animation-related WCAG violations are reported
- **AND** the audit confirms motion-sensitive animations are disabled or reduced
- **AND** all interactive elements remain fully functional without animations

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-21 | Story created | Dev Agent |
