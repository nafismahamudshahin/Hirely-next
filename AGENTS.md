# Hirely

- Next.js 16 App Router app; pages live in `app/`. Root landing page is `app/page.tsx`; shared recruiter/admin/seeker dashboard shell and auth check are in `app/dashboard/layout.tsx`.
- `proxy.ts` protects dashboard/auth routes; Better Auth is configured in `lib/auth.ts` with MongoDB and exposed through `app/api/auth/[...all]/route.ts`.
- Job CRUD uses the external API at `NEXT_PUBLIC_API_URL` via `lib/api/action/jobs.ts`. Keep search/filter/sort behavior aligned with the backend query contract; no query means all jobs.
- Shared feature components are grouped under `components/`; shadcn-style primitives are in `components/ui/`. `@/*` maps to the repository root in `tsconfig.json`.
- Styling uses Tailwind CSS 4, imported in `app/globals.css`. `lucide-react` 1.70 lacks common social-brand icons; use inline SVGs for those.

## Setup and checks

- Install with `npm ci`; configure `NEXT_PUBLIC_API_URL`, `MONGODB_URL`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, and `GITHUB_CLIENT_SECRET` in the environment.
- Run from the repository root: `npm run dev`, `npm run lint`, `npm run typecheck`, `npm run build`.
- No test runner or CI workflow is configured. Use `npm run build` as the final integration check.
- `npm run format` rewrites every `.ts` and `.tsx` file; use `npx prettier --write <file>` for a focused formatting change.

## Next.js notes

- Next.js is pinned to 16.4.4. Before changing App Router APIs, images, fonts, data loading, or server/client boundaries, check the matching guides under `node_modules/next/dist/docs/`.
