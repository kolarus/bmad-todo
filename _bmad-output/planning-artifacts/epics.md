---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

# trainingnf - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for trainingnf, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**FR1:** User can create a new todo by entering text and submitting  
**FR2:** User can view all todos in a single list  
**FR3:** User can mark a todo as complete  
**FR4:** User can mark a completed todo as incomplete (toggle)  
**FR5:** User can delete a todo from the list  
**FR6:** System persists all todos to backend storage  
**FR7:** System retrieves and displays all stored todos on page load  
**FR8:** System preserves todo state (text, completion status) across browser sessions  
**FR9:** System prevents creation of empty or whitespace-only todos  
**FR10:** System handles todo text up to 500 characters without breaking layout  
**FR11:** System handles rapid successive todo operations without duplication or data loss  
**FR12:** System visually distinguishes completed todos from active todos  
**FR13:** System displays an empty state when no todos exist  
**FR14:** System displays a loading state while fetching data from the backend  
**FR15:** System displays an error state when the backend is unavailable or a request fails  
**FR16:** System reflects user actions (create, complete, delete) immediately in the UI before server confirmation  
**FR17:** API supports creating a new todo (POST)  
**FR18:** API supports retrieving all todos (GET)  
**FR19:** API supports updating a todo's completion status (PATCH)  
**FR20:** API supports deleting a todo (DELETE)  
**FR21:** API returns consistent error response structure on failure  

### Non-Functional Requirements

**Performance:**
- Page initial load completes in < 2 seconds on broadband connection
- User interactions (create, toggle, delete) reflect in UI within 100ms (optimistic updates)
- API response time < 500ms for all CRUD operations under normal conditions
- Frontend bundle size kept minimal — target < 200KB gzipped

**Security:**
- API accepts only well-formed JSON requests; malformed input returns 400 error
- Todo text is sanitized to prevent XSS when rendered in the browser
- CORS restricts API access to the frontend origin only
- No sensitive data stored — no encryption-at-rest requirements for MVP

**Accessibility:**
- All interactive elements reachable via keyboard (Tab, Enter, Escape)
- Visible focus indicators on all focusable elements (WCAG 2.1 Level AA)
- Semantic HTML: proper heading hierarchy, button elements for actions, labels on inputs
- Sufficient color contrast ratio (minimum 4.5:1) for text and UI elements
- ARIA labels on all form controls and interactive elements

**Reliability:**
- Application handles backend unavailability gracefully — displays error state, does not crash
- Failed API operations do not corrupt local UI state
- No data loss on concurrent rapid operations
- Application recovers cleanly on page refresh after errors

### Additional Requirements

**Starter Template & Project Setup:**
- Initialize Next.js 16 frontend with TypeScript, Tailwind CSS, ESLint, App Router structure
- Create Express backend with TypeScript configuration and hot-reload development setup
- Add Prisma ORM with PostgreSQL 16.x via Docker Compose for database management
- Configure CORS middleware to allow frontend origin only
- Set up development scripts for concurrent frontend + backend hot-reload
- Create production Dockerfiles for frontend and backend with multi-stage builds
- Configure docker-compose.prod.yml for full-stack deployment (frontend, backend, PostgreSQL)

**Technology Stack Decisions:**
- TypeScript 5.x strict mode for both frontend and backend
- React 19.x (via Next.js canary) with Server Components by default, Client Components opt-in
- Node.js 20.x LTS runtime for backend
- PostgreSQL 16.x (latest stable) via Docker for data persistence
- Prisma ORM for type-safe database access with migrations
- Zod for validation on both client and server with shared schemas

**State Management & Patterns:**
- React Context + useState for global todo state management
- Optimistic UI pattern: immediate UI updates with background API sync and rollback on failure
- Error Boundary + Toast notification system for error handling
- Service layer pattern (routes → controllers → services) for backend organization

**Testing Requirements:**
- Comprehensive testing strategy: Unit + Integration + E2E
- Jest + React Testing Library for frontend component tests (co-located)
- Vitest or Jest for backend unit tests (co-located)
- Supertest for API integration tests (100% endpoint coverage required)
- Playwright for E2E tests with minimum 5 required scenarios:
  1. Happy path: Create todo → Mark complete → Delete todo (full CRUD cycle)
  2. Persistence: Add todo → Refresh page → Verify todo persists
  3. Validation: Attempt empty todo submission → Verify silent prevention
  4. Error recovery: Simulate backend down → Verify error message → Backend restored → Retry successful
  5. Optimistic UI: Add todo → Verify instant UI appearance → Verify backend sync → Verify data persists

**Environment Configuration:**
- .env files for all services (frontend, backend) with .env.example templates
- Zod validation for environment variables at app startup (fail-fast on misconfiguration)
- Environment variable injection via Docker Compose for all services

**Code Organization & Patterns:**
- Monorepo structure with frontend/, backend/, e2e/ folders
- Co-located tests (Component.test.tsx next to Component.tsx)
- Naming conventions: PascalCase for components, camelCase for functions/hooks, kebab-case for backend files
- Database naming: Prisma singular models with camelCase fields
- API naming: Plural resource endpoints (/api/todos) with lowercase paths
- Error format: Direct success responses (no wrapper), JSON API spec for errors

### UX Design Requirements

**UX-DR1:** Implement card-based design pattern with white cards on slate-50 background, subtle borders (border-slate-200) and shadows (shadow-sm), 8px border radius

**UX-DR2:** Implement custom checkbox component (20px × 20px) replacing browser default with indigo-600 background when checked, white checkmark SVG, border-slate-300 when unchecked

**UX-DR3:** Implement TodoInput component as card with auto-focus on page load and after submit, Enter key submit functionality, placeholder text "What needs to be done?", input clears and refocuses after submission

**UX-DR4:** Implement TodoCard component with flex layout (checkbox left, todo text center flex-1, delete button right), hover state with shadow elevation increase, responsive tap targets (44px minimum on mobile)

**UX-DR5:** Implement delete button (×) with slate-400 default color, red-600 on hover, no confirmation dialog required, aria-label for accessibility with specific todo text

**UX-DR6:** Implement EmptyState component with welcoming message "No todos yet" or "Ready when you are!", centered text with friendly tone, displays when todo list is empty

**UX-DR7:** Implement ErrorState component for initial page load failures with message "Couldn't load your todos / Check your connection", includes Retry button, role="alert" for screen readers

**UX-DR8:** Implement ErrorToast component for mid-session operation failures with specific error messages, red accent styling, auto-dismiss after 5 seconds, positioned bottom-right, role="alert" for immediate announcement

**UX-DR9:** Implement LoadingState component shown during initial page load with "Loading your todos..." message, centered with spinner, role="status" with aria-live="polite"

**UX-DR10:** Implement completed todo visual distinction with 60% opacity on entire card, text strikethrough, completed items remain visible (not hidden)

**UX-DR11:** Implement add todo animation with 200ms fade-in + slide-down effect, ease-in-out easing

**UX-DR12:** Implement toggle completion animation with 150ms checkbox scale + background color transition, text strikethrough animation, ease-in-out easing

**UX-DR13:** Implement delete animation with 200ms fade-out + height collapse, ease-out easing

**UX-DR14:** Implement hover state on todo cards with shadow elevation increase (shadow-sm → shadow-md), 300ms transition duration

**UX-DR15:** Configure Tailwind CSS with custom color palette (Slate neutral scale + Indigo accent), system font stack (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto), single 768px breakpoint, design tokens for spacing/typography

**UX-DR16:** Implement responsive design with mobile-first approach, 44px minimum tap targets on mobile, single breakpoint at 768px (md:), max-w-md centered container on desktop, prevents iOS zoom with 16px base font size

**UX-DR17:** Implement WCAG 2.1 AA accessibility compliance with keyboard navigation (Tab/Enter/Space), visible focus indicators (focus-visible:ring-2 ring-indigo-500), ARIA labels on delete buttons and form controls, semantic HTML throughout, 4.5:1 minimum contrast ratios

**UX-DR18:** Implement optimistic UI pattern with immediate UI updates on user actions, background API synchronization, graceful rollback to previous state on server failure with error toast

**UX-DR19:** Implement "silent success" feedback pattern with no explicit confirmation messages when operations succeed (result is self-evident from UI state)

**UX-DR20:** Implement "visible specific errors" feedback pattern with detailed, actionable error messages for failures (e.g., "Couldn't save your todo. Check your connection." not generic "Error occurred")

### FR Coverage Map

**FR1:** Epic 2 - User can create a new todo by entering text and submitting  
**FR2:** Epic 2 - User can view all todos in a single list  
**FR3:** Epic 2 - User can mark a todo as complete  
**FR4:** Epic 2 - User can mark a completed todo as incomplete (toggle)  
**FR5:** Epic 2 - User can delete a todo from the list  
**FR6:** Epic 2 - System persists all todos to backend storage  
**FR7:** Epic 2 - System retrieves and displays all stored todos on page load  
**FR8:** Epic 2 - System preserves todo state across browser sessions  
**FR9:** Epic 2 - System prevents creation of empty or whitespace-only todos  
**FR10:** Epic 2 - System handles todo text up to 500 characters without breaking layout  
**FR11:** Epic 2 - System handles rapid successive todo operations without duplication or data loss  
**FR12:** Epic 3 - System visually distinguishes completed todos from active todos  
**FR13:** Epic 3 - System displays an empty state when no todos exist  
**FR14:** Epic 3 - System displays a loading state while fetching data from the backend  
**FR15:** Epic 3 - System displays an error state when backend is unavailable or request fails  
**FR16:** Epic 2 - System reflects user actions immediately in UI before server confirmation (optimistic UI)  
**FR17:** Epic 2 - API supports creating a new todo (POST)  
**FR18:** Epic 2 - API supports retrieving all todos (GET)  
**FR19:** Epic 2 - API supports updating a todo's completion status (PATCH)  
**FR20:** Epic 2 - API supports deleting a todo (DELETE)  
**FR21:** Epic 2 - API returns consistent error response structure on failure  

**UX-DR Coverage:**

**UX-DR1-5:** Epic 3 - Card-based design, custom checkbox, TodoInput, TodoCard, delete button components  
**UX-DR6-9:** Epic 3 - EmptyState, ErrorState, ErrorToast, LoadingState components  
**UX-DR10-14:** Epic 3 - Visual styling (completed todos, animations, hover states)  
**UX-DR15:** Epic 3 - Tailwind CSS configuration with custom palette and design tokens  
**UX-DR16:** Epic 3 - Responsive design with mobile-first approach  
**UX-DR17:** Epic 3 - WCAG 2.1 AA accessibility compliance  
**UX-DR18:** Epic 2 - Optimistic UI pattern implementation  
**UX-DR19:** Epic 2 - Silent success feedback pattern  
**UX-DR20:** Epic 2 - Visible specific errors feedback pattern  

**Architecture & Testing Coverage:**

**Starter Template & Infrastructure:** Epic 1 - Complete monorepo setup, Docker, development environment  
**Testing Strategy:** Epic 1 - Test infrastructure setup; Epic 2 - Unit/integration tests; Epic 4 - E2E tests  
**Quality Assurance:** Epic 3 - Accessibility/performance testing; Epic 4 - Coverage reports, security review  
**Documentation:** Continuous - README, AI integration log, BMAD process documentation  

## Epic List

### Epic 1: Full-Stack Foundation & Development Environment

Development team can build and deploy the todo application with all infrastructure, tooling, and containerization in place.

**What's Delivered:**
- Complete monorepo setup (Next.js 16 + Express + PostgreSQL 16 + Docker)
- Development environment with hot-reload for frontend and backend
- Production-ready Docker Compose configuration with multi-stage builds
- Health check endpoints for container monitoring
- Test infrastructure setup (Jest, Vitest, Playwright configured with package.json scripts)
- Environment configuration (.env files, Zod validation)
- Basic "Hello World" integration proving the full stack works end-to-end

**Requirements Covered:**
- All "Additional Requirements" from Architecture (starter template, tech stack, Docker setup, environment config)
- Testing infrastructure foundation for all future epics
- NFR: Security (CORS configuration)

**Task Coverage (Training Requirements):**
- Step 3: Containerize with Docker Compose (Dockerfiles, docker-compose.yml, health checks, environment config)
- Component: Project Setup (test infrastructure)

---

### Epic 2: Core Todo Management with Persistence

Users can create, view, complete, and delete todos that persist across browser sessions with instant feedback and reliable error handling.

**What's Delivered:**
- Full CRUD operations for todos (create, read, update, delete)
- Backend REST API with all endpoints (GET, POST, PATCH, DELETE /api/todos)
- Frontend with React Context state management
- Optimistic UI pattern: immediate UI updates with background sync and rollback on failure
- Data persistence using PostgreSQL + Prisma ORM
- Input validation (prevent empty todos, handle 500-char max, rapid operations handling)
- Error handling with Error Boundary + Toast notification system
- Integration tests for each API endpoint (written as features are built)
- Component tests for frontend features (co-located with components)

**Requirements Covered:**
- FR1-FR11: All todo CRUD + persistence + validation
- FR16: Optimistic UI with immediate feedback
- FR17-FR21: Complete REST API with consistent error format
- UX-DR18-20: Optimistic UI, silent success, visible specific errors
- NFR: Performance (< 100ms UI interactions via optimistic updates)
- NFR: Security (XSS prevention, CORS, validation)
- NFR: Reliability (no data corruption, error recovery, rollback on failure)

**Task Coverage (Training Requirements):**
- Component: Backend (API CRUD operations with QA integration)
- Component: Frontend (UI for todo management with QA integration)
- QA Integration: Integration tests for API endpoints, component tests for UI

---

### Epic 3: Professional UX, Design System & Accessibility

Users experience a polished, accessible, professional-looking application that works beautifully on all devices and meets WCAG 2.1 AA standards.

**What's Delivered:**
- Card-based visual design with Tailwind CSS custom configuration
- Complete design system: Slate/Indigo color palette, system fonts, 768px breakpoint
- Custom components: Checkbox (20px), TodoInput (auto-focus), TodoCard (flex layout), DeleteButton
- Visual state components: EmptyState, ErrorState, ErrorToast, LoadingState
- Completed todo visual distinction (60% opacity + strikethrough)
- Smooth animations: add (200ms fade-in), toggle (150ms), delete (200ms), hover (300ms)
- Responsive design: mobile-first with 44px tap targets, max-w-md centered layout
- Full WCAG 2.1 AA accessibility: keyboard navigation, focus indicators, ARIA labels, 4.5:1 contrast, semantic HTML
- Accessibility audit report (Lighthouse/axe-core) targeting zero critical violations
- Performance testing documentation (Chrome DevTools analysis, bundle size verification)

**Requirements Covered:**
- FR12-FR15: Visual states (completed, empty, loading, error)
- UX-DR1-17: All design components, styling, responsive design, accessibility
- NFR: Accessibility (WCAG 2.1 AA compliance, keyboard nav, screen reader support)
- NFR: Performance (< 200KB bundle, responsive feel)

**Task Coverage (Training Requirements):**
- QA Task: Accessibility Testing (WCAG AA compliance, zero critical violations)
- QA Task: Performance Testing (Chrome DevTools analysis)

---

### Epic 4: Comprehensive E2E Testing & QA Reports

Application is thoroughly tested with comprehensive QA documentation proving production readiness and 70%+ meaningful test coverage.

**What's Delivered:**
- **5+ Playwright E2E tests** covering all user journeys:
  1. Happy path: Create todo → Mark complete → Delete todo (full CRUD cycle)
  2. Persistence: Add todo → Refresh page → Verify data persists across sessions
  3. Validation: Attempt empty todo submission → Verify silent prevention (no error modal)
  4. Error recovery: Simulate backend down → Verify error message → Backend restored → Retry successful
  5. Optimistic UI: Add todo → Verify instant UI appearance → Verify backend sync → Verify persistence
- Test coverage analysis report (target: 70%+ meaningful coverage)
- Security review report (XSS, SQL injection, CORS, input validation checks)
- Comprehensive QA summary report documenting:
  - Test coverage metrics and gaps
  - Accessibility compliance results
  - Performance benchmarks
  - Security findings and remediations
- Gap analysis and remediation plan for any issues discovered

**Requirements Covered:**
- Additional Requirements: E2E testing with Playwright (5 required scenarios explicitly defined)
- All NFRs validated through comprehensive testing
- Training requirement: Minimum 5 passing Playwright tests

**Task Coverage (Training Requirements):**
- Component: E2E Tests (Playwright MCP for browser automation)
- QA Task: Test Coverage (70% minimum meaningful coverage)
- QA Task: Security Review (XSS, injection, etc.)
- Deliverables: E2E test suites, QA reports (coverage, accessibility, security)

---

### Continuous: Documentation & AI Integration Log

Clear documentation demonstrates how BMAD guided the implementation and enables others to replicate the process.

**What's Delivered (throughout all epics):**
- **README.md** with:
  - Project overview and features
  - Setup instructions (local development)
  - Docker deployment instructions (docker-compose up)
  - Testing instructions (unit, integration, E2E)
  - Technology stack documentation
- **AI Integration Log** documenting:
  - Agent usage: which tasks used AI assistance, what prompts worked best
  - MCP server usage: Playwright MCP, Chrome DevTools MCP, Postman MCP (if used)
  - Test generation: how AI helped generate test cases, what it missed
  - Debugging with AI: specific examples where AI helped debug issues
  - Limitations encountered: where AI couldn't help, where human expertise was critical
- **BMAD Process Documentation** showing:
  - How Product Brief informed PRD
  - How PRD + UX Spec informed Architecture
  - How all artifacts informed Epic/Story breakdown
  - How stories guided implementation with acceptance criteria

**Task Coverage (Training Requirements):**
- AI Integration Documentation (all required categories)
- Deliverable: Documentation of how BMAD guided implementation
- Deliverable: README with setup instructions

---

## Epic 1: Full-Stack Foundation & Development Environment

Development team can build and deploy the todo application with all infrastructure, tooling, and containerization in place.

### Story 1.1: Initialize Next.js Frontend with TypeScript and Tailwind

As a developer,
I want a Next.js 16 frontend application with TypeScript and Tailwind CSS configured,
So that I have a modern React development environment ready for building UI components.

**Acceptance Criteria:**

**Given** I am starting a new project
**When** I run the initialization command
**Then** Next.js 16.x is installed with TypeScript 5.x configuration
**And** Tailwind CSS 4.x is configured with PostCSS
**And** ESLint is configured for code quality
**And** App Router structure is created in `frontend/src/app/`
**And** Import aliases (@/*) are configured for clean imports
**And** The dev server starts successfully on localhost:3000
**And** A basic page renders with Tailwind styles applied

### Story 1.2: Initialize Express Backend with TypeScript and Testing Setup

As a developer,
I want an Express backend with TypeScript and testing infrastructure,
So that I can build type-safe API endpoints with immediate test coverage.

**Acceptance Criteria:**

**Given** the frontend is initialized
**When** I set up the backend structure
**Then** Express 4.x is installed with TypeScript configuration
**And** Node.js 20.x LTS is the target runtime
**And** tsx and nodemon are configured for hot-reload development
**And** Jest or Vitest is configured for backend unit tests
**And** A basic Express server starts on localhost:3001
**And** A health check endpoint `/api/health` returns 200 OK
**And** The test command runs successfully with a sample test passing

### Story 1.3: Add PostgreSQL Database with Prisma ORM and Docker Compose

As a developer,
I want PostgreSQL running in Docker with Prisma ORM configured,
So that I have a persistent database ready for todo data with type-safe queries.

**Acceptance Criteria:**

**Given** the backend is initialized
**When** I configure the database setup
**Then** docker-compose.yml is created with PostgreSQL 16.x service
**And** Prisma is installed with client and migrate packages
**And** Prisma schema is initialized with datasource pointing to PostgreSQL
**And** A Todo model is defined in schema.prisma with id, text, completed, createdAt, updatedAt fields
**And** Running `docker-compose up` starts PostgreSQL on localhost:5432
**And** Running `npx prisma migrate dev` creates the todos table successfully
**And** Prisma Studio opens and shows the empty todos table
**And** Backend can connect to database via Prisma Client

### Story 1.4: Configure CORS and Environment Variables with Validation

As a developer,
I want CORS configured and environment variables validated,
So that the frontend can securely communicate with the backend and configuration errors are caught early.

**Acceptance Criteria:**

**Given** the backend and database are set up
**When** I configure CORS and environment variables
**Then** CORS middleware is installed and configured in Express
**And** Frontend origin (localhost:3000) is allowed in development
**And** .env.example files exist for both frontend and backend with all required variables documented
**And** .env files are created and added to .gitignore
**And** Zod schemas validate environment variables at backend startup
**And** Backend fails fast with clear error message if required env vars are missing
**And** Frontend can make successful API request to backend health endpoint
**And** NEXT_PUBLIC_API_URL is configured in frontend .env.local

### Story 1.5: Create Production Dockerfiles for Frontend and Backend

As a developer,
I want production-ready Dockerfiles with multi-stage builds,
So that I can deploy optimized, secure containers to any platform.

**Acceptance Criteria:**

**Given** the development environment is fully configured
**When** I create production Dockerfiles
**Then** frontend/Dockerfile exists with multi-stage build (build stage → production stage)
**And** Frontend Dockerfile uses Node 20-alpine base image
**And** Frontend Dockerfile creates non-root user for running the app
**And** Frontend production image size is optimized (< 150MB)
**And** backend/Dockerfile exists with multi-stage build
**And** Backend Dockerfile uses Node 20-alpine base image
**And** Backend Dockerfile creates non-root user
**And** Backend includes Prisma generate step in build process
**And** Both Dockerfiles can be built successfully without errors
**And** Built images can run standalone with appropriate environment variables

### Story 1.6: Configure Docker Compose Production Deployment

As a developer,
I want a docker-compose.prod.yml that orchestrates all services,
So that I can deploy the entire application with a single command.

**Acceptance Criteria:**

**Given** production Dockerfiles are created
**When** I create docker-compose.prod.yml
**Then** File defines three services: frontend, backend, postgres
**And** Frontend service builds from frontend/Dockerfile and exposes port 3000
**And** Backend service builds from backend/Dockerfile and exposes port 3001
**And** PostgreSQL service uses postgres:16-alpine image with volume for data persistence
**And** Services are connected through a Docker network
**And** Environment variables are properly configured for production
**And** DATABASE_URL connects backend to postgres service (not localhost)
**And** NEXT_PUBLIC_API_URL points to backend service
**And** Running `docker-compose -f docker-compose.prod.yml up` starts all services
**And** Frontend container is healthy and accessible
**And** Backend container is healthy and accessible
**And** Database migrations run successfully on startup

### Story 1.7: Implement Health Check Endpoints and Verify Full Stack Integration

As a developer,
I want health check endpoints for all services with monitoring,
So that I can verify the entire stack is working and containers report their status correctly.

**Acceptance Criteria:**

**Given** all services are containerized
**When** I implement health checks
**Then** Backend has `/api/health` endpoint returning JSON with status and timestamp
**And** Backend has `/api/health/db` endpoint that verifies database connection
**And** Frontend has a health check mechanism (Next.js built-in or custom)
**And** Docker Compose health checks are configured for all services
**And** Running `docker-compose ps` shows all containers as "healthy"
**And** Logs show successful health check responses
**And** Full integration test passes: Frontend → Backend API → Database → Response to Frontend
**And** README.md documents how to start development environment (`npm run dev`)
**And** README.md documents how to start production environment (`docker-compose -f docker-compose.prod.yml up`)
**And** README.md includes troubleshooting section for common setup issues

---

Now let me propose the stories for **Epic 2: Core Todo Management with Persistence**. This epic delivers the actual todo functionality with integrated QA.

### Proposed Stories for Epic 2:

**Story 2.1:** Implement Zod Validation Schemas for Todo Data  
**Story 2.2:** Create Todo Service Layer with Prisma CRUD Operations + Unit Tests  
**Story 2.3:** Build Todo REST API Endpoints with Integration Tests  
**Story 2.4:** Create React Context for Global Todo State Management  
**Story 2.5:** Implement Optimistic UI Pattern with Rollback Logic  
**Story 2.6:** Build TodoInput Component with Validation + Component Tests  
**Story 2.7:** Build TodoCard Component with Toggle and Delete + Component Tests  
**Story 2.8:** Build TodoList Component with Empty/Loading States + Component Tests  
**Story 2.9:** Implement Error Boundary and Toast Notification System + Tests  

Each story includes building the feature AND writing tests for it, following the "QA from day one" approach in your training requirements.

**Does this breakdown for Epic 2 look good?**

---

## Epic 2: Core Todo Management with Persistence

Users can create, view, complete, and delete todos that persist across browser sessions with instant feedback and reliable error handling.

### Story 2.1: Implement Zod Validation Schemas for Todo Data

As a developer,
I want shared Zod validation schemas for todo data,
So that both frontend and backend validate data consistently and catch errors early.

**Acceptance Criteria:**

**Given** I need to validate todo data on client and server
**When** I create Zod schemas
**Then** A todoCreateSchema validates todo creation (text: required string, 1-500 chars, non-empty/whitespace)
**And** A todoUpdateSchema validates todo updates (completed: boolean, text: optional string 1-500 chars)
**And** Schemas are duplicated in frontend/src/lib/validation/todo.ts and backend/src/validation/todo.schema.ts
**And** TypeScript types are inferred from schemas for type safety
**And** Unit tests verify schema validation catches empty strings, whitespace-only, > 500 chars
**And** Unit tests verify schema allows valid todo text (1-500 chars)
**And** Error messages are user-friendly ("Todo text is required" not "String must contain at least 1 character")

### Story 2.2: Create Todo Service Layer with Prisma CRUD Operations + Unit Tests

As a developer,
I want a service layer that handles all todo database operations with unit tests,
So that business logic is separated from HTTP handling and thoroughly tested.

**Acceptance Criteria:**

**Given** Prisma is configured with Todo model
**When** I create the TodoService
**Then** TodoService.findAll() retrieves all todos ordered by createdAt descending
**And** TodoService.create(data) creates a new todo with validated data
**And** TodoService.update(id, data) updates todo completion status
**And** TodoService.delete(id) removes a todo by ID
**And** Each method returns proper types (Todo, Todo[], null for not found)
**And** Service handles Prisma errors and throws meaningful errors
**And** Unit tests cover all CRUD operations using test database or mocks
**And** Unit tests verify error handling (not found, invalid data, database errors)
**And** Test coverage for service layer is > 80%
**And** All tests pass successfully

### Story 2.3: Build Todo REST API Endpoints with Integration Tests

As a developer,
I want REST API endpoints for todo operations with comprehensive integration tests,
So that the frontend can perform all CRUD operations and I have confidence the API works correctly.

**Acceptance Criteria:**

**Given** TodoService is implemented
**When** I create API routes with controllers
**Then** GET /api/todos returns all todos as JSON array (200 OK)
**And** POST /api/todos creates todo, returns created todo (201 Created)
**And** PATCH /api/todos/:id updates completion status, returns updated todo (200 OK)
**And** DELETE /api/todos/:id deletes todo, returns 204 No Content
**And** All endpoints use Zod validation middleware
**And** Invalid requests return 400 Bad Request with JSON error (JSON API spec format)
**And** Not found returns 404 with JSON error
**And** Server errors return 500 with JSON error (no stack traces in production)
**And** Supertest integration tests cover all endpoints (GET, POST, PATCH, DELETE)
**And** Integration tests verify success cases and error cases (400, 404, 500)
**And** Integration tests verify correct HTTP status codes and response formats
**And** All API integration tests pass (100% endpoint coverage)

### Story 2.4: Create React Context for Global Todo State Management

As a developer,
I want a TodoContext providing global state and operations,
So that components can access and modify todos without prop drilling.

**Acceptance Criteria:**

**Given** the backend API is functional
**When** I create TodoContext
**Then** TodoContext provides: todos (Todo[]), isLoading (boolean), error (string | null)
**And** TodoContext provides methods: addTodo, toggleTodo, deleteTodo, refetchTodos
**And** Context fetches todos from API on mount and sets isLoading appropriately
**And** Context handles API errors and sets error state with user-friendly messages
**And** useTodos() custom hook provides access to context
**And** Hook throws error if used outside TodoProvider
**And** Component tests verify context provides expected state and methods
**And** Component tests verify loading state during fetch
**And** Component tests verify error state when API fails
**And** All context tests pass

### Story 2.5: Implement Optimistic UI Pattern with Rollback Logic

As a developer,
I want optimistic UI updates with automatic rollback on failure,
So that the app feels instant while remaining honest about errors.

**Acceptance Criteria:**

**Given** TodoContext is implemented
**When** I add optimistic UI logic to context methods
**Then** addTodo immediately adds todo to local state with temporary ID
**And** addTodo calls POST API in background
**And** On API success, temporary todo is replaced with server response (real ID)
**And** On API failure, temporary todo is removed and error toast is shown
**And** toggleTodo immediately updates todo.completed in local state
**And** toggleTodo calls PATCH API in background
**And** On API failure, todo.completed reverts to previous value and error toast shown
**And** deleteTodo immediately removes todo from local state
**And** deleteTodo calls DELETE API in background
**And** On API failure, todo is restored to list and error toast shown
**And** Rapid successive operations queue properly (no race conditions or duplicates)
**And** Unit tests verify optimistic updates happen immediately (< 100ms)
**And** Unit tests verify rollback on API failure
**And** Unit tests verify no data corruption on concurrent operations
**And** All optimistic UI tests pass

### Story 2.6: Build TodoInput Component with Validation + Component Tests

As a developer,
I want a TodoInput component that handles todo creation with proper validation,
So that users can quickly add todos with a clean, accessible input experience.

**Acceptance Criteria:**

**Given** TodoContext and optimistic UI are implemented
**When** I build the TodoInput component
**Then** Component renders as a card with text input field
**And** Input has placeholder "What needs to be done?"
**And** Input auto-focuses on page load and after successful submission
**And** Pressing Enter key submits the form
**And** Empty or whitespace-only input does nothing (silent validation, no error message)
**And** Valid input (1-500 chars) calls addTodo from context
**And** Input clears and refocuses after successful submission
**And** Component prevents input > 500 characters via maxLength attribute
**And** Component uses Zod schema for client-side validation
**And** Component tests verify auto-focus behavior
**And** Component tests verify Enter key submission
**And** Component tests verify empty input does nothing
**And** Component tests verify valid input calls addTodo
**And** Component tests verify input clears after submission
**And** All component tests pass with React Testing Library

### Story 2.7: Build TodoCard Component with Toggle and Delete + Component Tests

As a developer,
I want a TodoCard component that displays a todo with toggle and delete actions,
So that users can manage individual todos with clear visual feedback.

**Acceptance Criteria:**

**Given** TodoContext and optimistic UI are implemented
**When** I build the TodoCard component
**Then** Component renders todo text, checkbox, and delete button in flex layout
**And** Checkbox shows checked state when todo.completed is true
**And** Clicking checkbox calls toggleTodo from context
**And** Completed todos show visual distinction (will be enhanced in Epic 3)
**And** Delete button (×) is always visible
**And** Clicking delete button calls deleteTodo from context
**And** Delete button has aria-label "Delete [todo.text]" for accessibility
**And** Long todo text (up to 500 chars) wraps properly without breaking layout
**And** Component tests verify checkbox toggles on click
**And** Component tests verify delete button calls deleteTodo
**And** Component tests verify completed state visual feedback
**And** Component tests verify accessibility (ARIA labels, semantic HTML)
**And** All component tests pass with React Testing Library

### Story 2.8: Build TodoList Component with Empty/Loading States + Component Tests

As a developer,
I want a TodoList component that displays all todos with proper loading and empty states,
So that users always see appropriate feedback regardless of data state.

**Acceptance Criteria:**

**Given** TodoCard component is implemented
**When** I build the TodoList component
**Then** Component consumes todos, isLoading, error from TodoContext via useTodos hook
**And** When isLoading is true, component shows "Loading your todos..." message
**And** When error is not null, component shows error message
**And** When todos array is empty (and not loading), component shows "No todos yet" or "Ready when you are!"
**And** When todos exist, component renders list of TodoCard components
**And** TodoCards are rendered in order (newest first based on createdAt)
**And** Component wraps cards in semantic <ul> with <li> elements
**And** Component tests verify loading state displayed when isLoading is true
**And** Component tests verify empty state displayed when todos is empty array
**And** Component tests verify error state displayed when error is set
**And** Component tests verify TodoCards rendered for each todo
**And** All component tests pass with React Testing Library

### Story 2.9: Implement Error Boundary and Toast Notification System + Tests

As a developer,
I want an Error Boundary and toast notification system for graceful error handling,
So that errors never crash the app and users always receive clear feedback.

**Acceptance Criteria:**

**Given** all todo components are implemented
**When** I create error handling infrastructure
**Then** ErrorBoundary component catches React errors and displays fallback UI
**And** ErrorBoundary logs errors for debugging
**And** ErrorBoundary displays user-friendly message (not stack trace)
**And** ErrorBoundary provides "Retry" button to recover
**And** ErrorToast component displays temporary notifications (auto-dismiss after 5 seconds)
**And** Toast shows specific error messages ("Couldn't save your todo. Check your connection.")
**And** Toast has role="alert" for screen reader announcement
**And** Toast positioned at bottom-right with red accent styling
**And** TodoContext uses toast to show errors from failed API operations
**And** Multiple toasts stack properly if multiple errors occur
**And** Component tests verify ErrorBoundary catches errors and shows fallback
**And** Component tests verify ErrorBoundary retry functionality
**And** Component tests verify ErrorToast renders with correct message
**And** Component tests verify ErrorToast auto-dismisses after timeout
**And** All error handling tests pass

---

Now let me propose the stories for **Epic 3: Professional UX, Design System & Accessibility**. This epic focuses on visual polish and WCAG compliance.

### Proposed Stories for Epic 3:

**Story 3.1:** Configure Tailwind CSS with Custom Design Tokens and Color Palette  
**Story 3.2:** Implement Card-Based Design Pattern for All Components  
**Story 3.3:** Create Custom Checkbox Component with Indigo Styling  
**Story 3.4:** Add Visual States (Empty, Loading, Error) with Proper Styling  
**Story 3.5:** Implement Completed Todo Visual Distinction (Opacity + Strikethrough)  
**Story 3.6:** Add Smooth Animations (Add, Toggle, Delete, Hover)  
**Story 3.7:** Implement Responsive Design with Mobile-First Approach  
**Story 3.8:** Ensure WCAG 2.1 AA Compliance (Keyboard Nav, ARIA, Contrast)  
**Story 3.9:** Run Accessibility Audit and Create Compliance Report  
**Story 3.10:** Run Performance Testing and Create Performance Report  

**Does this breakdown for Epic 3 look good?**

---

## Epic 3: Professional UX, Design System & Accessibility

Users experience a polished, accessible, professional-looking application that works beautifully on all devices and meets WCAG 2.1 AA standards.

### Story 3.1: Configure Tailwind CSS with Custom Design Tokens and Color Palette

As a developer,
I want Tailwind configured with custom design tokens matching the UX spec,
So that all components use consistent colors, spacing, and typography from a single source of truth.

**Acceptance Criteria:**

**Given** Tailwind CSS is installed
**When** I configure tailwind.config.ts
**Then** Color palette uses Slate neutral scale (slate-50, 200, 400, 500, 600, 900)
**And** Accent color is Indigo (indigo-500, 600, 700)
**And** Semantic colors are defined (red-600 for errors, green-600 for success)
**And** System font stack is configured (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)
**And** Single breakpoint is defined at 768px (md:)
**And** Default spacing scale (4px base unit) is retained
**And** Custom max-width is defined (max-w-md = 448px)
**And** Focus ring colors use indigo-500
**And** All color combinations meet 4.5:1 contrast ratio (WCAG AA)
**And** Configuration is documented in code comments

### Story 3.2: Implement Card-Based Design Pattern for All Components

As a user,
I want all todos and the input field to appear as clear, distinct cards,
So that the interface feels organized and items are easy to distinguish.

**Acceptance Criteria:**

**Given** Tailwind is configured with design tokens
**When** I apply card styling to components
**Then** TodoInput has white background, border-slate-200 border, shadow-sm, rounded-lg (8px)
**And** TodoCard has white background, border-slate-200 border, shadow-sm, rounded-lg
**And** All cards have consistent padding (p-4 = 16px)
**And** Page background is slate-50
**And** Cards are spaced 12px apart vertically (space-y-3)
**And** Container has max-w-md (448px) and is centered on screen
**And** Container has responsive padding (px-6 on mobile, px-8 on desktop at md: breakpoint)
**And** Design matches UX specification card-based direction exactly
**And** Visual regression testing confirms card appearance (manual review or screenshot comparison)

### Story 3.3: Create Custom Checkbox Component with Indigo Styling

As a user,
I want checkboxes that are visually clear and satisfying to interact with,
So that marking todos complete feels polished and intentional.

**Acceptance Criteria:**

**Given** card-based design is implemented
**When** I create custom checkbox styling
**Then** Checkbox is 20px × 20px square
**And** Unchecked state has border-2 border-slate-300, white background, rounded corners
**And** Checked state has bg-indigo-600 background with white checkmark SVG icon
**And** Hover on unchecked checkbox darkens border to border-slate-400
**And** Focus shows visible ring-2 ring-indigo-500 ring-offset-2
**And** Checkbox uses native <input type="checkbox"> (hidden) for accessibility
**And** Custom styled element is associated with native input via label
**And** Checkbox state (checked/unchecked) is announced by screen readers
**And** Space bar toggles checkbox when focused
**And** Component tests verify checked/unchecked visual states
**And** Component tests verify keyboard interaction (Space toggles)

### Story 3.4: Add Visual States (Empty, Loading, Error) with Proper Styling

As a user,
I want clear, friendly visual feedback for empty, loading, and error states,
So that I always understand what's happening and never feel lost.

**Acceptance Criteria:**

**Given** card-based design system is in place
**When** I implement state components
**Then** EmptyState shows centered text "No todos yet" with welcoming message
**And** EmptyState uses text-lg, text-slate-600, py-12 for calm, friendly appearance
**And** LoadingState shows "Loading your todos..." with optional spinner
**And** LoadingState uses text-center, py-12, text-slate-600
**And** LoadingState has role="status" and aria-live="polite" for screen readers
**And** ErrorState shows "Couldn't load your todos / Check your connection" in red-600
**And** ErrorState includes "Retry" button styled with bg-indigo-600 text-white
**And** ErrorState has role="alert" for immediate screen reader announcement
**And** ErrorToast appears at bottom-right with bg-red-50, border-l-4 border-red-600
**And** ErrorToast has shadow-lg for elevation
**And** ErrorToast auto-dismisses after 5 seconds
**And** All states match UX specification exactly

### Story 3.5: Implement Completed Todo Visual Distinction (Opacity + Strikethrough)

As a user,
I want completed todos to look clearly different from active ones,
So that I can immediately see my progress and what's left to do.

**Acceptance Criteria:**

**Given** TodoCard component exists
**When** I add completed state styling
**Then** Completed todos have opacity-60 applied to entire card
**And** Todo text has line-through text decoration when completed
**And** Completed state uses color change AND strikethrough (not color alone) for accessibility
**And** Transition between active and completed is smooth (150ms duration)
**And** Completed todos remain visible in the list (not hidden)
**And** Checkbox remains fully opaque even when todo is completed (clarity)
**And** Visual distinction is clear on both light and dark mode (if applicable)
**And** Component tests verify completed class is applied when todo.completed is true
**And** Visual regression confirms completed appearance

### Story 3.6: Add Smooth Animations (Add, Toggle, Delete, Hover)

As a user,
I want subtle, smooth animations when interacting with todos,
So that the app feels polished and my actions feel tactile and confirmed.

**Acceptance Criteria:**

**Given** all components are styled with card-based design
**When** I add animation CSS
**Then** New todos fade in with 200ms duration and slight slide-down effect (ease-in-out)
**And** Todo toggle has 150ms checkbox scale transition and text strikethrough animation
**And** Delete action has 200ms fade-out with height collapse (ease-out)
**And** Card hover increases shadow (shadow-sm → shadow-md) with 300ms transition
**And** Delete button color changes (slate-400 → red-600) on hover with smooth transition
**And** All animations respect prefers-reduced-motion media query
**And** Users with motion sensitivity see instant state changes (no animation)
**And** Animations feel smooth on 60fps devices
**And** No janky or laggy animation performance
**And** Animation timing matches UX specification exactly (add: 200ms, toggle: 150ms, delete: 200ms, hover: 300ms)

### Story 3.7: Implement Responsive Design with Mobile-First Approach

As a user,
I want the app to work perfectly on my phone, tablet, and desktop,
So that I can manage todos comfortably on any device.

**Acceptance Criteria:**

**Given** base styles are mobile-first
**When** I add responsive CSS
**Then** Mobile (< 768px) has px-6 (24px) container padding
**And** Desktop (≥ 768px) has px-8 (32px) container padding via md: prefix
**And** All interactive elements have 44px minimum tap target height on mobile
**And** Input field has 16px font size to prevent iOS zoom
**And** Cards have max-w-md (448px) centered layout on desktop
**And** Empty horizontal space on wide screens is intentional (centered design)
**And** Layout never scrolls horizontally on any screen size (320px - 2560px tested)
**And** Touch targets are comfortable for thumb interaction on mobile
**And** Hover states work on desktop but don't break touch devices
**And** All affordances are visible on mobile (no hover-only controls)
**And** Responsive testing passes on iPhone, iPad, and desktop browsers
**And** Layout tested at 375px (iPhone SE), 768px (iPad), 1440px (desktop)

### Story 3.8: Ensure WCAG 2.1 AA Compliance (Keyboard Nav, ARIA, Contrast)

As a user with accessibility needs,
I want the app to be fully accessible via keyboard and screen reader,
So that I can use all features independently regardless of my abilities.

**Acceptance Criteria:**

**Given** all components are implemented with responsive design
**When** I test accessibility compliance
**Then** All interactive elements are keyboard accessible (Tab, Enter, Space, Escape)
**And** Tab order is logical (input → todos → delete buttons → next todo)
**And** Focus indicators are visible on all interactive elements (ring-2 ring-indigo-500)
**And** All buttons use semantic <button> elements (not divs with onClick)
**And** All form inputs have associated labels (explicit or aria-label)
**And** Delete buttons have specific aria-label "Delete [todo.text]"
**And** Screen reader text uses sr-only utility where needed
**And** Empty/Loading/Error states have appropriate ARIA roles (status, alert)
**And** All text meets 4.5:1 contrast ratio minimum (slate-900 on white, etc.)
**And** Color is not the sole indicator of state (strikethrough + opacity for completed)
**And** Semantic HTML structure is correct (form, ul/li, headings)
**And** Manual keyboard-only navigation test passes (no mouse)
**And** Manual screen reader test passes (VoiceOver on macOS or NVDA on Windows)

### Story 3.9: Run Accessibility Audit and Create Compliance Report

As a developer,
I want a comprehensive accessibility audit with documented results,
So that I can verify WCAG 2.1 AA compliance and address any issues found.

**Acceptance Criteria:**

**Given** WCAG compliance implementation is complete
**When** I run accessibility audits
**Then** Lighthouse accessibility audit is run and score is documented
**And** axe-core DevTools scan is run on all pages/states
**And** Automated tests find zero critical WCAG violations
**And** Any warnings are reviewed and justified or fixed
**And** Manual keyboard navigation testing is documented
**And** Manual screen reader testing is documented (specific flows tested)
**And** Color contrast ratios are verified for all text/background combinations
**And** Touch target sizes are verified on mobile devices
**And** Accessibility compliance report is created documenting:
  - Lighthouse score (target: 90+)
  - axe-core results (zero critical issues)
  - Manual testing results
  - Any warnings with justification
  - Remediation plan for any issues
**And** Report is saved as QA documentation artifact
**And** Training requirement met: Zero critical WCAG violations

### Story 3.10: Run Performance Testing and Create Performance Report

As a developer,
I want performance testing with documented results,
So that I verify the app meets NFR targets and identify any optimization opportunities.

**Acceptance Criteria:**

**Given** the application is fully implemented
**When** I run performance testing
**Then** Chrome DevTools Performance analysis is run on key user flows
**And** Lighthouse performance audit is run and scores are documented
**And** Bundle size is measured and verified < 200KB gzipped
**And** Page load time is measured and verified < 2 seconds on broadband
**And** UI interaction latency is measured (optimistic UI < 100ms perceived)
**And** API response times are measured (< 500ms target)
**And** Performance report documents:
  - Lighthouse performance score
  - Bundle size (total and gzipped)
  - Page load metrics (FCP, LCP, TTI)
  - Runtime performance (interaction latency)
  - API response times
  - Any bottlenecks identified
  - Optimization recommendations
**And** Report includes screenshots from Chrome DevTools
**And** Report is saved as QA documentation artifact
**And** All NFR performance targets are met or deviations are documented

---

Now let me propose the stories for **Epic 4: Comprehensive E2E Testing & QA Reports**. This epic covers the mandatory 5 Playwright E2E tests and all QA deliverables.

### Proposed Stories for Epic 4:

**Story 4.1:** Set Up Playwright E2E Testing Infrastructure  
**Story 4.2:** Create E2E Test - Happy Path (Full CRUD Cycle)  
**Story 4.3:** Create E2E Test - Data Persistence Across Sessions  
**Story 4.4:** Create E2E Test - Empty Input Validation  
**Story 4.5:** Create E2E Test - Error Recovery Flow  
**Story 4.6:** Create E2E Test - Optimistic UI Behavior  
**Story 4.7:** Generate Test Coverage Report (Target 70%+)  
**Story 4.8:** Conduct Security Review and Create Report  
**Story 4.9:** Create Comprehensive QA Summary Report  

**Does this breakdown for Epic 4 look good?**

---

## Epic 4: Comprehensive E2E Testing & QA Reports

Application is thoroughly tested with comprehensive QA documentation proving production readiness and 70%+ meaningful test coverage.

### Story 4.1: Set Up Playwright E2E Testing Infrastructure

As a developer,
I want Playwright configured with proper test structure and utilities,
So that I can write reliable E2E tests that run consistently in CI/CD.

**Acceptance Criteria:**

**Given** the application is functional
**When** I set up Playwright
**Then** Playwright is installed in e2e/ directory with package.json
**And** playwright.config.ts defines test configuration with baseURL pointing to app
**And** Test browsers are configured (Chromium, Firefox, WebKit or subset)
**And** Test directory structure is created (e2e/tests/, e2e/fixtures/)
**And** Base URL is configurable via environment variable
**And** Screenshots on failure are enabled
**And** Video recording on failure is enabled
**And** Test timeout is set appropriately (30 seconds default)
**And** Helper functions are created for common operations (addTodo, getTodos, etc.)
**And** Test database reset utility is created for clean test state
**And** Running `npm test` in e2e/ executes all Playwright tests
**And** Tests can run in headless mode (CI) and headed mode (local development)
**And** Playwright HTML reporter is configured for test results

### Story 4.2: Create E2E Test - Happy Path (Full CRUD Cycle)

As a QA engineer,
I want an E2E test covering the complete todo lifecycle,
So that I verify all CRUD operations work together in a real user scenario.

**Acceptance Criteria:**

**Given** Playwright infrastructure is set up
**When** I create the happy path E2E test
**Then** Test navigates to application home page
**And** Test verifies page loads successfully (input field visible)
**And** Test creates a new todo by typing "Buy groceries" and pressing Enter
**And** Test verifies todo appears in the list immediately with correct text
**And** Test verifies todo is marked as active (not completed)
**And** Test clicks the checkbox to mark todo complete
**And** Test verifies todo shows completed state (visual change)
**And** Test clicks delete button (×) on the todo
**And** Test verifies todo is removed from the list
**And** Test verifies empty state appears ("No todos yet")
**And** Test passes consistently (no flakiness)
**And** Test completes in < 30 seconds
**And** Training requirement met: E2E Test 1 complete

### Story 4.3: Create E2E Test - Data Persistence Across Sessions

As a QA engineer,
I want an E2E test verifying data persists across browser refresh,
So that I confirm todos are stored in the database and survive sessions.

**Acceptance Criteria:**

**Given** Playwright infrastructure is set up
**When** I create the persistence E2E test
**Then** Test creates a todo "Walk the dog"
**And** Test verifies todo appears in the list
**And** Test refreshes the page (page.reload())
**And** Test verifies loading state appears briefly
**And** Test verifies todo "Walk the dog" is still in the list after refresh
**And** Test verifies todo retains its completion state if it was toggled
**And** Test creates second todo "Read a book"
**And** Test closes and reopens browser (new page context)
**And** Test verifies both todos are present in the list
**And** Test verifies data was fetched from backend (not localStorage)
**And** Test passes consistently
**And** Training requirement met: E2E Test 2 complete

### Story 4.4: Create E2E Test - Empty Input Validation

As a QA engineer,
I want an E2E test verifying empty input is silently prevented,
So that I confirm the validation works without showing error modals.

**Acceptance Criteria:**

**Given** Playwright infrastructure is set up
**When** I create the validation E2E test
**Then** Test navigates to application
**And** Test focuses input field
**And** Test presses Enter without typing anything
**And** Test verifies no todo is added to the list
**And** Test verifies no error message or modal appears (silent validation)
**And** Test verifies empty state remains ("No todos yet")
**And** Test types only whitespace ("   ") and presses Enter
**And** Test verifies no todo is added (whitespace-only also prevented)
**And** Test types valid text "Valid todo" and presses Enter
**And** Test verifies todo is added successfully
**And** Test verifies input field is cleared and refocused after successful add
**And** Test passes consistently
**And** Training requirement met: E2E Test 3 complete

### Story 4.5: Create E2E Test - Error Recovery Flow

As a QA engineer,
I want an E2E test simulating backend failure and recovery,
So that I verify error handling and user recovery paths work correctly.

**Acceptance Criteria:**

**Given** Playwright infrastructure is set up
**When** I create the error recovery E2E test
**Then** Test intercepts API requests using page.route()
**And** Test simulates backend down by returning 500 error for GET /api/todos
**And** Test navigates to application
**And** Test verifies error state appears ("Couldn't load your todos")
**And** Test verifies error message includes actionable guidance ("Check your connection")
**And** Test verifies "Retry" button is present
**And** Test restores normal API responses (stop intercepting)
**And** Test clicks "Retry" button
**And** Test verifies loading state appears
**And** Test verifies todos load successfully (or empty state if no todos)
**And** Test verifies application recovered gracefully
**And** Test simulates failed POST by intercepting and returning 500
**And** Test attempts to add todo "Test todo"
**And** Test verifies error toast appears with specific message
**And** Test verifies todo is NOT in the list (optimistic UI rolled back)
**And** Test passes consistently
**And** Training requirement met: E2E Test 4 complete

### Story 4.6: Create E2E Test - Optimistic UI Behavior

As a QA engineer,
I want an E2E test verifying optimistic UI updates work correctly,
So that I confirm the app feels instant while maintaining data integrity.

**Acceptance Criteria:**

**Given** Playwright infrastructure is set up
**When** I create the optimistic UI E2E test
**Then** Test navigates to application
**And** Test adds a todo "Test optimistic UI"
**And** Test verifies todo appears in UI in < 100ms (before API response completes)
**And** Test uses Playwright's network throttling to slow API response
**And** Test verifies todo is visible while API request is in flight
**And** Test waits for API response to complete
**And** Test verifies todo remains in list (successful backend sync)
**And** Test verifies todo has real ID from server (not temporary ID)
**And** Test refreshes page to confirm data persisted to database
**And** Test verifies todo is still present after refresh
**And** Test toggles todo completion
**And** Test verifies visual change happens immediately
**And** Test verifies PATCH request completes in background
**And** Test simulates slow network and verifies updates still feel instant
**And** Test passes consistently
**And** Training requirement met: E2E Test 5 complete

### Story 4.7: Generate Test Coverage Report (Target 70%+)

As a developer,
I want comprehensive test coverage analysis across all test types,
So that I identify untested code and ensure production readiness.

**Acceptance Criteria:**

**Given** all unit, integration, component, and E2E tests are written
**When** I generate coverage reports
**Then** Coverage collection is configured for backend (Jest/Vitest with --coverage)
**And** Coverage collection is configured for frontend (Jest with --coverage)
**And** Coverage report includes line, branch, function, and statement coverage
**And** Backend service layer has > 80% coverage
**And** Frontend components have meaningful coverage (> 70%)
**And** API integration tests cover 100% of endpoints
**And** Coverage report identifies untested code paths
**And** Coverage report is generated in HTML format for easy review
**And** Coverage summary is saved as text/JSON for automation
**And** Test coverage report documents:
  - Overall coverage percentage (target: 70%+ meaningful coverage)
  - Coverage by file/module
  - Uncovered lines and branches
  - Test type breakdown (unit, integration, component, E2E)
**And** Report explains why certain code is not covered (if < 70%)
**And** Report saved as QA documentation artifact
**And** Training requirement met: Minimum 70% meaningful coverage

### Story 4.8: Conduct Security Review and Create Report

As a developer,
I want a security review documenting potential vulnerabilities,
So that I verify the application follows security best practices.

**Acceptance Criteria:**

**Given** the application is fully implemented
**When** I conduct security review
**Then** XSS prevention is verified (React auto-escaping, no dangerouslySetInnerHTML)
**And** SQL injection prevention is verified (Prisma parameterized queries, no raw SQL)
**And** CORS configuration is verified (only frontend origin allowed)
**And** Input validation is verified (Zod schemas on client and server)
**And** Sensitive data handling is verified (no passwords in logs, no data in error messages)
**And** Environment variable security is verified (.env files gitignored, no secrets in code)
**And** Dependency vulnerabilities are checked (npm audit run, critical issues addressed)
**And** Authentication is reviewed (not applicable for MVP, architecture supports future auth)
**And** HTTPS configuration is reviewed (production deployment requirement documented)
**And** Security review report documents:
  - Security checklist (XSS, injection, CORS, validation, secrets)
  - npm audit results
  - Dependency vulnerabilities found and remediation plan
  - Security best practices followed
  - Recommendations for production deployment
**And** Report saved as QA documentation artifact
**And** Training requirement met: Security review complete

### Story 4.9: Create Comprehensive QA Summary Report

As a developer,
I want a comprehensive QA summary report documenting all quality assurance activities,
So that I can demonstrate production readiness and provide complete QA documentation.

**Acceptance Criteria:**

**Given** all QA activities are complete (testing, accessibility, performance, security)
**When** I create the QA summary report
**Then** Report includes executive summary of QA activities performed
**And** Report includes test coverage summary (70%+ meaningful coverage achieved)
**And** Report includes all 5 E2E test scenarios with pass/fail status
**And** Report includes accessibility audit results (Lighthouse, axe-core, zero critical violations)
**And** Report includes performance testing results (bundle size, load time, API response time)
**And** Report includes security review findings and remediations
**And** Report documents testing breakdown:
  - Unit tests: count, coverage, key areas tested
  - Integration tests: API endpoints covered (100%)
  - Component tests: React components tested
  - E2E tests: 5 scenarios documented with results
**And** Report documents quality metrics:
  - Test pass rate (target: 100%)
  - Coverage percentage (target: 70%+)
  - Accessibility score (target: 90+)
  - Performance score
  - Zero critical security issues
**And** Report includes gap analysis (any areas not fully tested or issues found)
**And** Report includes remediation plan for any issues identified
**And** Report documents QA tools used (Jest, Vitest, Playwright, Lighthouse, axe-core)
**And** Report is formatted professionally (markdown or PDF)
**And** Report saved as qa-summary-report.md in project documentation
**And** Training requirement met: QA reports deliverable complete

---

Now let me propose the stories for **Continuous: Documentation & AI Integration Log**. These stories span all epics.

### Proposed Documentation Stories:

**Story D.1:** Create Project README with Setup Instructions  
**Story D.2:** Document AI Integration Log Throughout Implementation  
**Story D.3:** Document BMAD Process and Artifact Flow  

**Does this breakdown for Documentation look good?**

---

## Continuous: Documentation & AI Integration Log

Clear documentation demonstrates how BMAD guided the implementation and enables others to replicate the process.

### Story D.1: Create Project README with Setup Instructions

As a developer,
I want comprehensive README documentation,
So that anyone can understand, set up, and run the project quickly.

**Acceptance Criteria:**

**Given** the application is functional
**When** I create README.md in project root
**Then** README includes project overview and purpose (BMAD training todo app)
**And** README lists key features (CRUD todos, persistence, optimistic UI, accessibility)
**And** README documents technology stack:
  - Frontend: Next.js 16, React 19, TypeScript 5, Tailwind CSS 4
  - Backend: Express 4, Node.js 20 LTS, Prisma, PostgreSQL 16
  - Testing: Jest, Vitest, React Testing Library, Playwright
  - Deployment: Docker, Docker Compose
**And** README includes prerequisites (Node.js 20+, Docker, npm/yarn)
**And** README documents development setup:
  - Clone repository
  - Install dependencies (npm install in frontend/ and backend/)
  - Copy .env.example to .env files
  - Start Docker Compose for PostgreSQL
  - Run database migrations
  - Start development servers (npm run dev)
**And** README documents testing commands:
  - Backend unit tests: cd backend && npm test
  - Frontend component tests: cd frontend && npm test
  - E2E tests: cd e2e && npm test
  - Coverage: npm test -- --coverage
**And** README documents Docker deployment:
  - docker-compose -f docker-compose.prod.yml up
  - Access application at localhost:3000
**And** README includes troubleshooting section for common issues
**And** README includes project structure overview
**And** README includes links to additional documentation
**And** Training requirement met: README with setup instructions

### Story D.2: Document AI Integration Log Throughout Implementation

As a developer,
I want detailed documentation of AI assistance throughout the project,
So that I can demonstrate effective AI-driven development and share learnings.

**Acceptance Criteria:**

**Given** AI tools are used throughout implementation
**When** I maintain AI integration log
**Then** Log documents agent usage:
  - Which tasks were completed with AI assistance
  - Specific prompts that worked well
  - Examples of effective prompt engineering
  - Tasks where AI excelled
  - Tasks where AI struggled
**And** Log documents MCP server usage:
  - Playwright MCP for E2E test automation
  - Chrome DevTools MCP for performance analysis
  - Postman MCP for API validation (if used)
  - Benefits each MCP server provided
**And** Log documents test generation:
  - How AI assisted in generating unit tests
  - How AI assisted in generating integration tests
  - How AI assisted in generating component tests
  - What AI-generated tests missed (edge cases, etc.)
**And** Log documents debugging with AI:
  - Specific bugs where AI helped identify root cause
  - Error messages AI helped interpret
  - Code refactoring suggestions from AI
  - Examples of AI-assisted problem solving
**And** Log documents limitations encountered:
  - Code AI couldn't generate correctly
  - Concepts AI misunderstood
  - Where human expertise was critical
  - Prompt adjustments needed for better results
**And** Log is maintained in ai-integration-log.md in docs/ folder
**And** Log includes timestamps and context for each entry
**And** Log is updated throughout implementation (not retroactively)
**And** Training requirement met: AI integration documentation

### Story D.3: Document BMAD Process and Artifact Flow

As a developer,
I want documentation showing how BMAD guided the entire development process,
So that I can demonstrate spec-driven development and help others learn BMAD.

**Acceptance Criteria:**

**Given** all BMAD artifacts were created
**When** I document the BMAD process
**Then** Documentation explains BMAD workflow overview:
  - Product Brief → PRD → UX Design → Architecture → Epics/Stories → Implementation
**And** Documentation shows how Product Brief informed PRD:
  - Key requirements clarified
  - Project classification established
  - Success criteria defined
**And** Documentation shows how PRD informed UX Design:
  - User journeys extracted from requirements
  - Visual design decisions tied to PRD goals
  - Accessibility requirements from NFRs
**And** Documentation shows how PRD + UX informed Architecture:
  - Technology choices justified by requirements
  - Implementation patterns derived from UX specs
  - Testing strategy aligned with quality requirements
**And** Documentation shows how all artifacts informed Epic/Story breakdown:
  - FR coverage map showing traceability
  - Story acceptance criteria derived from requirements
  - UX-DRs incorporated into implementation stories
**And** Documentation explains benefits of BMAD approach:
  - Clear specifications reduced ambiguity
  - AI agents could implement with less guidance
  - Testing requirements were clear from start
  - Traceability from requirement to code
**And** Documentation includes lessons learned:
  - What worked well with BMAD
  - Challenges encountered
  - Recommendations for future projects
**And** Documentation is saved as bmad-process-documentation.md in docs/
**And** Documentation references all BMAD artifacts in _bmad-output/
**And** Training requirement met: Documentation of how BMAD guided implementation

---

## Summary

**Total Stories Created:** 38 stories across 4 epics + 3 documentation stories = 41 total

**Epic 1:** 7 stories - Full-Stack Foundation & Development Environment  
**Epic 2:** 9 stories - Core Todo Management with Persistence  
**Epic 3:** 10 stories - Professional UX, Design System & Accessibility  
**Epic 4:** 9 stories - Comprehensive E2E Testing & QA Reports  
**Continuous:** 3 stories - Documentation & AI Integration Log  

**Requirements Coverage:**
- ✅ All 21 Functional Requirements mapped to stories
- ✅ All 20 UX Design Requirements mapped to stories
- ✅ All 4 NFR categories addressed
- ✅ All Architecture requirements included
- ✅ All Training deliverables covered:
  - BMAD artifacts (complete)
  - Working application (Epic 1 + 2 + 3)
  - Unit, integration, E2E test suites (Epic 2 + 4)
  - Dockerfiles and docker-compose.yml (Epic 1)
  - QA reports (Epic 3 + 4)
  - Documentation (Continuous)

**Training Success Criteria Alignment:**
- ✅ Phase 1-2 Deliverables: All BMAD artifacts created with clear traceability
- ✅ Working Application: Epics 1-3 deliver fully functional todo app
- ✅ Test Coverage: Story 4.7 targets minimum 70% meaningful coverage
- ✅ E2E Tests: Stories 4.2-4.6 deliver minimum 5 passing Playwright tests
- ✅ Docker Deployment: Epic 1 ensures `docker-compose up` works
- ✅ Accessibility: Story 3.9 targets zero critical WCAG violations
- ✅ Documentation: Continuous stories deliver README, AI log, BMAD process docs

