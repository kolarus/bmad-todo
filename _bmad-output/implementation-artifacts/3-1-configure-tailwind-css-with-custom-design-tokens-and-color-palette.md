# Story 3.1: Configure Tailwind CSS with Custom Design Tokens and Color Palette

Status: done

## Story

As a developer,
I want Tailwind configured with custom design tokens matching the UX spec,
So that all components use consistent colors, spacing, and typography from a single source of truth.

## Acceptance Criteria

1. Color palette uses Slate neutral scale (slate-50, 200, 400, 500, 600, 900)
2. Accent color is Indigo (indigo-500, 600, 700)
3. Semantic colors include red-600 for errors
4. System font stack configured (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)
5. Single breakpoint at 768px (md:)
6. Custom border radius --radius: 8px
7. Base font size 16px (prevents iOS zoom)
8. All slate text on white background meets 4.5:1 contrast ratio
9. Configuration uses Tailwind v4 `@theme` syntax in globals.css

## Tasks / Subtasks

- [x] Task 1: Configure design tokens in globals.css (AC: 1-9)
  - [x] Set up @theme block with slate and indigo color scales
  - [x] Configure system font stack via --font-sans
  - [x] Set --radius: 8px
  - [x] Add html { font-size: 16px } for iOS zoom prevention
  - [x] Set --breakpoint-md: 768px

## Dev Notes

### Tailwind v4 Configuration
Tailwind v4 uses CSS-based configuration via `@theme` in `globals.css` instead of `tailwind.config.ts`.
The project already uses `@import "tailwindcss"` and the `@theme inline` block.

### Current State
`frontend/src/app/globals.css` already has the full @theme configuration with:
- Slate scale: slate-50 through slate-900
- Indigo scale: indigo-50 through indigo-900
- --font-sans system stack
- --radius: 8px
- --breakpoint-md: 768px
- html { font-size: 16px }
- CSS variables --background and --foreground

This story is COMPLETE - configuration was done as part of Epic 2 infrastructure.

## Dev Agent Record

### Completion Notes
Story 3.1 was already completed as part of Epic 2 setup. `frontend/src/app/globals.css` contains the full Tailwind v4 @theme configuration with all required design tokens.

## File List

- `frontend/src/app/globals.css` (completed in Epic 2)

## QA Gate

> **Definition of Done requires accessibility verification.** The design tokens defined here (contrast ratios, color palette) must pass an automated accessibility audit. This story is not considered fully **done** until Story 3-9 reaches `done` status.

### Accessibility Scenario: Design Tokens Meet 4.5:1 Contrast Ratio

**Linked Implementation:** Story 3-9 — Run Accessibility Audit and Create Compliance Report

**Scenario:**
- **GIVEN** the app is running with the custom Tailwind design tokens applied
- **WHEN** an automated accessibility audit (axe-core / Lighthouse) is run
- **THEN** all text elements using slate-600, slate-900 on white/slate-50 backgrounds pass the 4.5:1 minimum contrast requirement
- **AND** the indigo-600 accent on white meets contrast requirements for interactive elements
- **AND** no critical WCAG AA color contrast violations are reported

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-21 | Story created and marked done (implemented in Epic 2) | Dev Agent |
