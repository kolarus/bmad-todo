# Story 3.7: Implement Responsive Design with Mobile-First Approach

Status: done

## Story

As a user,
I want the app to work perfectly on my phone, tablet, and desktop,
So that I can manage todos comfortably on any device.

## Acceptance Criteria

1. Mobile (< 768px): px-4 container padding (already in page.tsx)
2. Desktop (≥ 768px): md:px-8 container padding upgrade
3. All interactive elements have minimum 44px tap target height
4. Input field uses 16px font size (prevent iOS zoom)
5. Cards have max-w-md (448px) centered on desktop
6. Layout never scrolls horizontally at 320px to 2560px
7. Touch targets comfortable for thumb interaction
8. Hover states don't break on touch devices (already CSS-only hover)
9. All affordances visible on mobile (no hover-only controls)
10. h1 title is appropriately sized and visible on all breakpoints

## Tasks / Subtasks

- [ ] Task 1: Ensure 44px minimum tap targets on TodoCard (AC: 3, 7)
  - [ ] TodoCard: add `min-h-[44px]` to interactive area or ensure flex layout meets 44px
  - [ ] Delete button: ensure clickable area is at least 44px via p-2 or min-w/h
  - [ ] Checkbox: 20px visual but 44px touch target via -m-2 or p-3 on label
- [ ] Task 2: Responsive padding on page.tsx (AC: 1, 2)
  - [ ] Change `px-4` to `px-4 md:px-8` (or keep px-4 if sufficient)
- [ ] Task 3: Verify input font size (AC: 4)
  - [ ] TodoInput: ensure `text-base` (16px) on input to prevent iOS zoom
- [ ] Task 4: Verify max-w-md centering (AC: 5)
  - [ ] page.tsx already has `max-w-md mx-auto` — verify it works

## Dev Notes

### Mobile-First Tailwind Strategy
All base classes are mobile; `md:` prefix overrides for ≥768px.
```tsx
// page.tsx
<main className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
  <div className="max-w-md mx-auto">
```

### 44px Tap Target on Checkbox
The label wrapper in Checkbox.tsx needs padding or min dimensions for touch:
```tsx
<label className="relative flex items-center justify-center w-5 h-5 flex-shrink-0 cursor-pointer min-w-[44px] min-h-[44px] -m-[12px]">
```
This extends the touch target without affecting visual appearance.

Alternative: add `p-3` to the label and `flex items-center justify-center` so the touch area extends around the 20px visual.

### Delete Button 44px Target
```tsx
<button
  className="... min-w-[44px] min-h-[44px] flex items-center justify-center"
>
  ×
</button>
```

### Text Base on Input
The TodoInput already has text-slate-900 but not explicit text-base. Adding `text-base` (16px) ensures iOS won't zoom.

## File List

- `frontend/src/app/page.tsx` (update: responsive padding)
- `frontend/src/components/TodoCard.tsx` (update: 44px tap targets on delete button)
- `frontend/src/components/Checkbox.tsx` (update: 44px touch target on label)
- `frontend/src/components/TodoInput.tsx` (update: text-base on input)

## QA Gate

> **Definition of Done requires accessibility verification.** The 44px minimum tap targets and 16px input font (iOS zoom prevention) must be confirmed by audit. This story is not considered fully **done** until Story 3-9 reaches `done` status.

### Accessibility Scenario: Touch Targets and Input Font Size Meet Mobile Standards

**Linked Implementation:** Story 3-9 — Run Accessibility Audit and Create Compliance Report

**Scenario:**
- **GIVEN** the app is rendered at a 375px mobile viewport width
- **WHEN** an accessibility audit is run
- **THEN** all interactive elements (checkbox, delete button, input, retry button) have a minimum 44×44px touch target area
- **AND** the todo input field has a font size of at least 16px (preventing iOS auto-zoom)
- **AND** no horizontal scroll is present at the 320px minimum viewport width

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-21 | Story created | Dev Agent |
