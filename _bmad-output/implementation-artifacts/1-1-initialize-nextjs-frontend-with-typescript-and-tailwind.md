# Story 1.1: Initialize Next.js Frontend with TypeScript and Tailwind

Status: ready-for-dev

## Story

As a developer,
I want a Next.js 16 frontend application with TypeScript and Tailwind CSS configured,
So that I have a modern React development environment ready for building UI components.

## Acceptance Criteria

**Given** I am starting a new project
**When** I run the initialization command
**Then** Next.js 16.x is installed with TypeScript 5.x configuration
**And** Tailwind CSS 4.x is configured with PostCSS
**And** ESLint is configured for code quality
**And** App Router structure is created in `frontend/src/app/`
**And** Import aliases (@/*) are configured for clean imports
**And** The dev server starts successfully on localhost:3000
**And** A basic page renders with Tailwind styles applied

## Developer Context

### Critical Architecture Requirements

**Technology Stack (MUST FOLLOW):**
- **Next.js:** 16.x with App Router (mandatory, not Pages Router)
- **TypeScript:** 5.x with strict mode enabled
- **Tailwind CSS:** 4.x (latest stable)
- **React:** 19.x (canary) - included with Next.js 16
- **Node.js:** 20.x LTS runtime
- **Package Manager:** npm (consistency across project)

**Project Structure (STRICT REQUIREMENT):**
```
/frontend/
├── src/
│   ├── app/              # App Router pages and layouts (REQUIRED)
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles with Tailwind directives
│   ├── components/       # React components (create empty for now)
│   └── lib/              # Utility functions, API client (create empty for now)
├── public/               # Static assets
├── tailwind.config.ts    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
├── tsconfig.json         # TypeScript configuration
├── next.config.js        # Next.js configuration
├── package.json
└── .eslintrc.json        # ESLint configuration
```

**Initialization Command (EXACT):**
```bash
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**Command Breakdown:**
- `@latest` - Ensures Next.js 16.x
- `frontend` - Project folder name
- `--typescript` - Enables TypeScript with tsconfig.json
- `--tailwind` - Configures Tailwind CSS with PostCSS
- `--eslint` - Sets up ESLint for code quality
- `--app` - Uses App Router (NOT Pages Router)
- `--src-dir` - Creates src/ directory for organized code
- `--import-alias "@/*"` - Configures path aliases for clean imports

### Tailwind CSS Configuration Requirements

**Custom Configuration (to be added AFTER initialization):**

The UX specification requires custom Tailwind configuration. Update `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Slate neutral scale (primary neutral)
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Indigo accent scale (primary interactive color)
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      screens: {
        'md': '768px', // Single breakpoint for responsive design
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      borderRadius: {
        'DEFAULT': '8px',
      },
    },
  },
  plugins: [],
}

export default config
```

**globals.css Requirements:**

Update `src/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base font size - prevents iOS zoom on input focus */
html {
  font-size: 16px;
}

/* Base styles */
body {
  @apply bg-slate-50 text-slate-900 antialiased;
}
```

### TypeScript Configuration Requirements

**tsconfig.json (verify strict mode):**

Ensure strict mode is enabled for type safety:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,  // MUST be true
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Testing Requirements

**Verification Steps (MUST COMPLETE):**

1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   - Server MUST start on localhost:3000
   - No compilation errors allowed

3. **Verify App Router Structure:**
   - Check `src/app/layout.tsx` exists
   - Check `src/app/page.tsx` exists
   - Verify App Router (not Pages Router) is active

4. **Test Basic Page with Tailwind:**
   
   Update `src/app/page.tsx`:
   ```tsx
   export default function Home() {
     return (
       <main className="min-h-screen flex items-center justify-center bg-slate-50">
         <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
           <h1 className="text-2xl font-semibold text-slate-900 mb-2">
             trainingnf
           </h1>
           <p className="text-slate-600">
             Next.js 16 + TypeScript + Tailwind CSS ✓
           </p>
         </div>
       </main>
     )
   }
   ```

5. **Verify Tailwind Styles:**
   - Visit localhost:3000 in browser
   - Verify centered white card with shadow appears
   - Verify Slate color palette is applied
   - Verify custom border-radius (8px) works

6. **Test ESLint:**
   ```bash
   npm run lint
   ```
   - Should complete with no errors
   - May have warnings (acceptable for initial setup)

7. **Create Empty Project Structure:**
   ```bash
   mkdir -p src/components src/lib
   ```

### File Structure After Completion

```
/frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with Tailwind
│   │   ├── page.tsx          # Home page with test content
│   │   └── globals.css       # Updated with custom base styles
│   ├── components/           # Empty (ready for Epic 2)
│   └── lib/                  # Empty (ready for Epic 2)
├── public/
├── tailwind.config.ts        # Updated with custom Slate/Indigo palette
├── postcss.config.js
├── tsconfig.json             # Verify strict: true
├── next.config.js
├── package.json
├── .eslintrc.json
└── README.md                 # Next.js default (replace in Story 1.7)
```

### Common LLM Pitfalls to Avoid

**❌ DO NOT:**
- Use Pages Router (`pages/` directory) - MUST use App Router (`app/`)
- Install older Next.js versions (must be 16.x)
- Skip TypeScript strict mode
- Use default Tailwind colors without customization
- Create `src/pages/` folder (wrong router type)
- Install unnecessary dependencies (keep it minimal for now)
- Configure custom webpack (Next.js handles bundling)
- Add authentication, API routes, or database connections (wrong epic)

**✅ DO:**
- Use App Router exclusively (`src/app/`)
- Enable TypeScript strict mode
- Customize Tailwind config with Slate/Indigo palette
- Create empty `/components` and `/lib` folders for future stories
- Test the dev server before marking complete
- Verify Tailwind styles render correctly in browser
- Keep dependencies minimal (only what create-next-app provides)

### Performance Considerations

- Next.js 16 uses Turbopack for faster dev builds
- App Router enables React Server Components by default
- No web fonts (system font stack) = instant text rendering
- Bundle size target: < 200KB gzipped (tracked in Epic 3)

### References

**Source Documents:**
- [Architecture: Starter Template Evaluation](../_bmad-output/planning-artifacts/architecture.md#starter-template-evaluation)
- [Architecture: Initialization Approach](../_bmad-output/planning-artifacts/architecture.md#initialization-approach)
- [UX Design: Tailwind Configuration](../_bmad-output/planning-artifacts/ux-design-specification.md#design-tokens-tailwind-configuration)
- [Epic 1: Story 1.1](../_bmad-output/planning-artifacts/epics.md#story-11-initialize-nextjs-frontend-with-typescript-and-tailwind)

### Next Story Context

**Story 1.2** will create the Express backend. This story is intentionally frontend-only to establish clear separation of concerns.

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Implementation Notes

**Initialization:**
- Successfully installed Next.js 16.2.4 with TypeScript 5.x using `create-next-app@latest`
- Configured with App Router, src directory, and import aliases (@/*)
- Tailwind CSS v4 was installed (latest version uses CSS-based configuration instead of JS/TS config)

**Key Implementation Decisions:**

1. **Tailwind CSS v4 Configuration:**
   - Tailwind v4 uses CSS-based configuration via `@theme` directive in globals.css
   - No separate tailwind.config.ts file needed (breaking change from v3)
   - Configured custom Slate and Indigo color palettes as CSS custom properties
   - Set system font stack and custom border radius (8px) via CSS variables

2. **Color Palette:**
   - Implemented full Slate neutral scale (50-900) for primary neutrals
   - Implemented full Indigo accent scale (50-900) for primary interactive elements
   - Background set to slate-50 (#f8fafc) for consistency with UX spec

3. **Project Structure:**
   - Created empty `/src/components` and `/src/lib` folders for future stories
   - Used App Router structure in `/src/app` (not Pages Router)
   - Verified import aliases (@/*) are configured correctly

4. **Test Page:**
   - Created simple centered card layout demonstrating Tailwind classes work correctly
   - Verified custom Slate and default shadow/border-radius values apply

### Files Created/Modified

**Created Files:**
- `frontend/` - Complete Next.js application directory
- `frontend/src/app/page.tsx` - Test page with Tailwind styling
- `frontend/src/app/layout.tsx` - Root layout (auto-generated)
- `frontend/src/app/globals.css` - Updated with custom color palette
- `frontend/src/components/` - Empty directory for future components
- `frontend/src/lib/` - Empty directory for utilities/helpers

**Configuration Files:**
- `frontend/package.json` - Dependencies including Next.js 16.2.4, React 19.2.4, Tailwind v4
- `frontend/tsconfig.json` - Strict mode enabled, import aliases configured
- `frontend/postcss.config.mjs` - Tailwind PostCSS plugin
- `frontend/eslint.config.mjs` - ESLint configuration
- `frontend/next.config.ts` - Next.js configuration

### Completion Checklist

- [x] Next.js 16.x installed with TypeScript 5.x
- [x] Tailwind CSS configured with custom Slate/Indigo palette (v4 CSS-based config)
- [x] App Router structure created in `src/app/`
- [x] Import aliases (@/*) configured
- [x] ESLint configured and passing (no errors)
- [x] Dev server starts successfully on localhost:3000 (verified process on port 3000)
- [x] Test page renders with Tailwind styles (centered white card on slate-50 background)
- [x] Empty `components/` and `lib/` folders created
- [x] TypeScript strict mode verified (strict: true in tsconfig.json)
- [x] All acceptance criteria met

---

**Status:** done  
**Last Updated:** 2026-04-20  
**Completed by:** Claude Sonnet 4.5
