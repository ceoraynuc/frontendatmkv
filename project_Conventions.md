# MK Volunteers Portal — Frontend Conventions

## Stack
- Next.js App Router (`src/app/`), TypeScript, Tailwind CSS v4
- Icons: lucide-react only (no emoji, ever)
- Fonts: Figtree (`--font-sans` in globals.css)

## Colors (defined in src/app/globals.css @theme block)
- primary-* : brand green (#006634 base), use primary-350 for dark mode accents
- secondary-* : brand blue (#0a6294 base)
- accent-* : brand cream (#fdeeb7 base)
- Never use raw hex colors in components — always use these tokens

## Dark Mode
- Manual toggle via Context in `src/app/provider.tsx` (useTheme hook)
- Class-based: `.dark` on <html>, NOT prefers-color-scheme
- Every bg-white needs dark:bg-[#161b22] (cards) or dark:bg-[#0d1117] (page bg)
- Every border-gray-200 needs dark:border-white/[0.08]
- Every text-gray-800 needs dark:text-gray-100; text-gray-500 needs dark:text-gray-400
- Buttons: bg-primary-700 dark:bg-primary-350, with dark:text-gray-900 (dark text on bright dark-mode green)

## Animations (defined in globals.css)
- animate-fade-in — page content, overlays
- animate-scale-in origin-top-right — dropdowns/popups
- animate-slide-in-left — drawers/sidebars
- Buttons get automatic press feedback (global CSS rule) — no need to add manually

## Accessibility
- Every icon-only button MUST have aria-label
- Dropdowns/toggles get aria-expanded
- List-item action buttons (e.g. "Download X") get descriptive aria-label including the item name

## Data pattern (mock-first)
- Mock functions live in src/lib/mock*.ts, typed with interfaces matching the MongoDB schema
- Every mock function returns { success: boolean, data/error }
- UI components never hardcode data inline — always import from src/lib/mock*.ts
- This makes swapping to real API calls later a one-line change per call

## File structure
- Each dashboard feature = folder under src/app/dashboard/ with its own page.tsx
- Shared layouts (like AuthLayout) go in src/app/components/
- Dynamic routes use [paramName] folder naming

## Component style
- "use client" only when needed (state, hooks, browser APIs)
- Rounded corners: rounded-lg (buttons/inputs), rounded-xl (cards)
- Card pattern: bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-white/[0.08] p-5