<!-- Copilot / AI agent instructions for contributors working on SetMyBizz -->
# SetMyBizz — AI coding assistant guidance

Purpose: provide concise, actionable information so an AI coding agent can be immediately productive in this repository.

- Project type: Next.js 13 (app directory) TypeScript React app. Entry: `app/`.
- Styling: Tailwind CSS utility classes live in JSX; global CSS in `app/globals.css`.
- Fonts: configured via `next/font` in `app/layout.tsx`.

Architecture / patterns
- Routing: file-system routing under `app/`. Each folder with a `page.tsx` becomes a route (e.g. `/onboarding/focus-area`).
- Server vs Client: pages that use browser APIs or local state include the top-line directive `"use client"`. Keep interactive code in client components and lightweight; server components are the default elsewhere.
- Page composition: many onboarding pages define a local React component (e.g. `FocusContent`) and export a `Page` that wraps it in `Suspense` (see `app/onboarding/focus-area/page.tsx`).
- Navigation & state passing: navigation uses `next/navigation` hooks (`useRouter`, `useSearchParams`) and encodes transient selections into query params before routing (example: selected focus areas are pushed as `?focus=a,b` in `app/onboarding/focus-area/page.tsx`).
- Icons: `lucide-react` is used directly as JSX components (imported at top of files).

Developer workflows
- Run dev server: `npm run dev` (starts Next dev server at http://localhost:3000).
- Build: `npm run build` / Start production: `npm run start`.
- Lint: `npm run lint` (the script invokes `eslint` — ensure your environment has Node + packages installed).

Conventions to follow
- Prefer inline Tailwind classes on JSX elements — the UI is expressed primarily with utility classes.
- Keep interactive logic inside `"use client"` components. If you add a new interactive page, add the directive at the top.
- When passing selection or step state between onboarding pages, use query params rather than global state or localStorage. Look at `onboarding/*` pages for examples.
- Small, page-scoped helper components are fine inside the `page.tsx` file. Only extract to `components/` when reused across pages.

Important files to inspect
- `app/layout.tsx` — global layout, font setup.
- `app/globals.css` — global CSS and Tailwind base styles.
- `app/page.tsx` — landing UI and navigation entry.
- `app/onboarding/**/page.tsx` — step-by-step onboarding flow; each page shows the pattern for navigation, state, and UI.
- `package.json` — scripts and core dependencies (Next, React, Tailwind-related packages, `lucide-react`).

Edge-cases and gotchas
- There is no explicit `tailwind.config.js` or test harness in the repo snapshot; if you add Tailwind customizations or tests, also add the config + scripts.
- `npm run lint` runs `eslint` without a specific config script in package.json — ensure `.eslintrc` or `eslint-config-next` settings exist if you change lint rules.

How to make changes (recommended small workflow)
1. Install deps: `npm install`.
2. Run locally: `npm run dev` and test at `http://localhost:3000`.
3. Make a focused change and run `npm run lint` before opening a PR.
4. Keep UI changes limited to one route/feature per PR.

If you are an AI assistant working on a change
- Start by opening the route under `app/` that your change affects (e.g. `app/onboarding/*`).
- Check for `"use client"` — add it if the component will use hooks or browser APIs.
- Preserve Tailwind utility patterns rather than introducing large CSS files.
- Use `next/navigation` hooks for client-side redirects and query param handling.

Questions / feedback
If any guidance is unclear or a pattern evolves, please update this file and ping maintainers in the PR description.
