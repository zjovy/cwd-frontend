# CLAUDE.md

This file provides guidance to AI coding agents when working with code in this
repository.

## Commands

- **Dev server:** `npm run dev`
- **Build:** `npm run build`
- **Lint/format:** `npm run lint` (runs `npx prettier --write .`)
- **Test:** `npm run test` (vitest, jsdom environment)

## Architecture

React 19 SPA using Vite, styled-components, and React Router v7. Firebase
handles authentication (email/password + Google OAuth). A separate backend (URL
via `VITE_BACKEND_URL`) provides user profile data and auth token sync.

### Path alias

`@/` maps to `./src/` (configured in vite.config.js, jsconfig.json, and eslint).
Use `@/` for all imports outside the current directory.

### Routing & auth flow

`App.jsx` defines all routes wrapped in `UserProvider` (Firebase auth state) and
`BrowserRouter`. Routes are split into:

- **PrivateRoute** — requires authenticated user, redirects to `/login`
- **PublicOnlyRoute** — accessible only when logged out, redirects to `/`

Two layout wrappers: `NavLayout` (top navbar for all routes) and `MainLayout`
(sidebar for authenticated pages like dashboard).

### Key conventions

- **Styling:** styled-components (not CSS modules). Global styles in `App.css`
  and `index.css`.
- **Props:** All components must define `propTypes`.
- **File extensions:** Only `.jsx` files may contain JSX, and all `.jsx` files
  must contain JSX. Plain logic files use `.js`.
- **Import ordering** (enforced by prettier plugin): react → third-party →
  absolute (`common/`, `pages/`) → relative. Groups separated by blank lines,
  specifiers sorted alphabetically.
- **Formatting:** Single quotes, semicolons, 2-space indent, ~80 char line
  width, `jsxSingleQuote: true`.
- **SVGs:** Imported as React components via `vite-plugin-svgr`. Icon
  definitions centralized in `src/assets/icons/icons.js`.

### Frontend guidelines

- **Reuse shared components** — check `common/components/` before creating new
  UI elements (buttons, cards, badges, modals, tables).
- **Files should not exceed 200 lines** — split into smaller components or
  extract helpers.
- **Component hierarchy** — follow atomic design: `atoms/` (Button, Badge, Card)
  → `molecules/` (UserProfile) → `organisms/` (Sidebar, DonationTable).
- **Co-locate page-specific components** — only promote to `common/components/`
  when reused across multiple pages.
- **Keep styles near their component** — define styled-components or style
  objects in the same file, not in separate stylesheets.
- **Lift state minimally** — keep state in the lowest component that needs it;
  use context only for truly global state (auth, theme).
- **Extract custom hooks for reusable logic** — data fetching, subscriptions,
  and complex state should live in `hooks/` as `use*` functions (e.g.,
  `useDonations`, `useUser`). Keep hooks focused on one concern.

### Environment

Copy `.env.example` to `.env` and fill in Firebase credentials and backend URL.
All env vars are prefixed with `VITE_`.
